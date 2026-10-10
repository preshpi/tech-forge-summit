create table public.game_settings (
 id boolean primary key default true check (id),
 win_chance integer not null default 20 check (win_chance between 0 and 100)
);
insert into public.game_settings(id,win_chance) values(true,20);
alter table public.game_settings enable row level security;
revoke all on public.game_settings from public, anon, authenticated;
grant select on public.game_settings to anon, authenticated;
grant update(win_chance) on public.game_settings to authenticated;
grant all on public.game_settings to service_role;
create policy game_settings_read on public.game_settings for select to anon, authenticated using (true);
create policy game_settings_update on public.game_settings for update to authenticated using (public.is_question_admin()) with check (public.is_question_admin());

create table public.game_attempts (
 id uuid primary key default gen_random_uuid(), request_id uuid not null unique,
 name text not null check (length(btrim(name)) between 1 and 100),
 email text not null unique check (length(email) <= 254 and email = lower(btrim(email)) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 outcome text not null check (outcome in ('won','no_prize')),
 prize_id uuid references public.game_prizes(id), prize_name text, prize_image text,
 wheel jsonb not null, win_chance integer not null check (win_chance between 0 and 100),
 created_at timestamptz not null default now(),
 check ((outcome = 'won' and prize_id is not null and prize_name is not null) or
        (outcome = 'no_prize' and prize_id is null and prize_name is null and prize_image is null))
);
create index game_attempts_listing on public.game_attempts(created_at desc,id desc);
alter table public.game_attempts enable row level security;
revoke all on public.game_attempts from public, anon, authenticated;
grant select on public.game_attempts to authenticated;
grant all on public.game_attempts to service_role;
create policy game_attempt_read on public.game_attempts for select to authenticated using (public.is_question_admin());
-- Retain the IDs, receipts and email limits of every historical winner.
insert into public.game_attempts(id,request_id,name,email,outcome,prize_id,prize_name,prize_image,wheel,win_chance,created_at)
 select id,request_id,name,email,'won',prize_id,prize_name,prize_image,wheel,100,created_at from public.game_wins;
alter table private.game_ip_wins rename to game_ip_attempts;
alter table private.game_ip_attempts rename column win_id to attempt_id;
alter table private.game_ip_attempts drop constraint game_ip_wins_win_id_fkey;
alter table private.game_ip_attempts add constraint game_ip_attempts_attempt_id_fkey foreign key(attempt_id) references public.game_attempts(id) on delete restrict;

create or replace function public.spin_game(p_request uuid, p_name text, p_email text, p_identity text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare old public.game_attempts; prize public.game_prizes; wheel jsonb; attempt_id uuid; chance integer; won boolean; prize_count integer;
begin
 p_name := btrim(p_name); p_email := lower(btrim(p_email));
 if p_request is null or p_name is null or length(p_name) not between 1 and 100 or p_email is null or length(p_email) > 254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
  return jsonb_build_object('error','Please enter a valid name and email address.');
 end if;
 if p_identity is null or p_identity !~ '^[a-f0-9]{64}$' then return jsonb_build_object('error','Unable to verify your network. Please try again later.'); end if;
 perform pg_advisory_xact_lock(20261009);
 select * into old from public.game_attempts where request_id = p_request;
 if found then
  if old.email <> p_email or old.name <> p_name then return jsonb_build_object('error','These spin details do not match the original request.'); end if;
  return jsonb_build_object('id',old.id,'outcome',old.outcome,'prize_id',old.prize_id,'prize_name',old.prize_name,'prize_image',old.prize_image,'wheel',old.wheel,'win_chance',old.win_chance);
 end if;
 if exists(select 1 from public.game_attempts where email = p_email) then return jsonb_build_object('error','This email has already been used to spin. One attempt per email address.'); end if;
 if exists(select 1 from private.game_ip_attempts where identity = p_identity) then return jsonb_build_object('error','Someone has already spun from this network. One attempt per IP address.'); end if;
 select win_chance into chance from public.game_settings where id = true for share;
 if chance is null then return jsonb_build_object('error','The game is not configured yet.'); end if;
 lock table public.game_prizes in share row exclusive mode;
 select count(*) into prize_count from public.game_prizes where active and quantity > 0;
 if prize_count = 0 then return jsonb_build_object('error','All prizes have been won. Please check back later.'); end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',id,'name',name,'weight',chance::numeric/prize_count) order by id),'[]'::jsonb)
 into wheel from public.game_prizes where active and quantity > 0 and chance > 0;
 if chance < 100 then wheel := wheel || jsonb_build_array(jsonb_build_object('id','no-prize','name','No prize this time','weight',100-chance)); end if;
 won := random() * 100 < chance;
 if won then
  select * into prize from public.game_prizes where active and quantity > 0 order by random() limit 1;
  update public.game_prizes set quantity = quantity - 1 where id = prize.id;
 end if;
 insert into public.game_attempts(request_id,name,email,outcome,prize_id,prize_name,prize_image,wheel,win_chance)
 values(p_request,p_name,p_email,case when won then 'won' else 'no_prize' end,prize.id,prize.name,prize.image,wheel,chance) returning id into attempt_id;
 insert into private.game_ip_attempts(identity,attempt_id) values(p_identity,attempt_id);
 if won then
  insert into public.game_wins(id,request_id,name,email,prize_id,prize_name,prize_image,wheel)
  values(attempt_id,p_request,p_name,p_email,prize.id,prize.name,prize.image,wheel);
 end if;
 return jsonb_build_object('id',attempt_id,'outcome',case when won then 'won' else 'no_prize' end,'prize_id',prize.id,'prize_name',prize.name,'prize_image',prize.image,'wheel',wheel,'win_chance',chance);
end $$;
revoke all on function public.spin_game(uuid,text,text,text) from public, anon, authenticated;
grant execute on function public.spin_game(uuid,text,text,text) to service_role;
