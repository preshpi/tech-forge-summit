create table public.game_prizes (
 id uuid primary key default gen_random_uuid(),
 name text not null check (length(btrim(name)) between 1 and 100),
 description text not null default '' check (length(description) <= 500),
 image text check (image is null or (length(image) <= 480000 and image ~ '^data:image/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$')),
 quantity integer not null default 1 check (quantity between 0 and 100000),
 active boolean not null default false,
 created_at timestamptz not null default now()
);
create table public.game_wins (
 id uuid primary key default gen_random_uuid(), request_id uuid not null unique,
 name text not null check (length(btrim(name)) between 1 and 100),
 email text not null unique check (length(email) <= 254 and email = lower(btrim(email)) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 prize_id uuid not null references public.game_prizes(id),
 prize_name text not null, prize_image text, wheel jsonb not null,
 created_at timestamptz not null default now()
);
create index game_wins_listing on public.game_wins(created_at desc, id desc);
alter table public.game_prizes enable row level security;
alter table public.game_wins enable row level security;
revoke all on public.game_prizes, public.game_wins from public, anon, authenticated;
grant select on public.game_prizes to anon, authenticated;
grant insert, update on public.game_prizes to authenticated;
grant select on public.game_wins to authenticated;
grant all on public.game_prizes, public.game_wins to service_role;
create policy game_prize_read on public.game_prizes for select to anon, authenticated using ((active and quantity > 0) or public.is_question_admin());
create policy game_prize_insert on public.game_prizes for insert to authenticated with check (public.is_question_admin());
create policy game_prize_update on public.game_prizes for update to authenticated using (public.is_question_admin()) with check (public.is_question_admin());
create policy game_winner_read on public.game_wins for select to authenticated using (public.is_question_admin());

-- Award and stock decrement happen in one transaction. Retries return the same award.
create function public.spin_game(p_request uuid, p_name text, p_email text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare old public.game_wins; prize public.game_prizes; wheel jsonb; win_id uuid;
begin
 p_name := btrim(p_name); p_email := lower(btrim(p_email));
 if p_request is null or p_name is null or length(p_name) not between 1 and 100 or p_email is null or length(p_email) > 254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
  return jsonb_build_object('error','Please enter a valid name and email address.');
 end if;
 perform pg_advisory_xact_lock(20261009);
 select * into old from public.game_wins where request_id = p_request;
 if found then
  if old.email <> p_email or old.name <> p_name then return jsonb_build_object('error','These spin details do not match the original request.'); end if;
  return jsonb_build_object('id',old.id,'prize_id',old.prize_id,'prize_name',old.prize_name,'prize_image',old.prize_image,'wheel',old.wheel);
 end if;
 if exists(select 1 from public.game_wins where email = p_email) then return jsonb_build_object('error','This email has already won a prize. One win per email address.'); end if;
 -- Serialize stock changes, including admin inserts/activation, with the draw.
 lock table public.game_prizes in share row exclusive mode;
 select jsonb_agg(jsonb_build_object('id',id,'name',name) order by id) into wheel from public.game_prizes where active and quantity > 0;
 select * into prize from public.game_prizes where active and quantity > 0 order by random() limit 1;
 if not found then return jsonb_build_object('error','All prizes have been won. Please check back later.'); end if;
 update public.game_prizes set quantity = quantity - 1 where id = prize.id;
 insert into public.game_wins(request_id,name,email,prize_id,prize_name,prize_image,wheel)
 values(p_request,p_name,p_email,prize.id,prize.name,prize.image,wheel) returning id into win_id;
 return jsonb_build_object('id',win_id,'prize_id',prize.id,'prize_name',prize.name,'prize_image',prize.image,'wheel',wheel);
end $$;
revoke all on function public.spin_game(uuid,text,text) from public, anon, authenticated;
grant execute on function public.spin_game(uuid,text,text) to service_role;
