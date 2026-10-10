-- Older wins have no recorded IP and cannot be backfilled.
create table private.game_ip_wins (
 identity text primary key check (identity ~ '^[a-f0-9]{64}$'),
 win_id uuid not null unique references public.game_wins(id) on delete restrict
);
alter table private.game_ip_wins enable row level security;
revoke all on private.game_ip_wins from public, anon, authenticated, service_role;
-- Remove the unprotected RPC so stale clients cannot bypass the network limit.
drop function public.spin_game(uuid,text,text);
create function public.spin_game(p_request uuid, p_name text, p_email text, p_identity text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare old public.game_wins; prize public.game_prizes; wheel jsonb; win_id uuid;
begin
 p_name := btrim(p_name); p_email := lower(btrim(p_email));
 if p_request is null or p_name is null or length(p_name) not between 1 and 100 or p_email is null or length(p_email) > 254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
  return jsonb_build_object('error','Please enter a valid name and email address.');
 end if;
 if p_identity is null or p_identity !~ '^[a-f0-9]{64}$' then return jsonb_build_object('error','Unable to verify your network. Please try again later.'); end if;
 perform pg_advisory_xact_lock(20261009);
 select * into old from public.game_wins where request_id = p_request;
 if found then
  if old.email <> p_email or old.name <> p_name then return jsonb_build_object('error','These spin details do not match the original request.'); end if;
  return jsonb_build_object('id',old.id,'prize_id',old.prize_id,'prize_name',old.prize_name,'prize_image',old.prize_image,'wheel',old.wheel);
 end if;
 if exists(select 1 from public.game_wins where email = p_email) then return jsonb_build_object('error','This email has already won a prize. One win per email address.'); end if;
 if exists(select 1 from private.game_ip_wins where identity = p_identity) then return jsonb_build_object('error','A prize has already been won from this network. One win per IP address.'); end if;
 -- Serialize stock changes, including admin inserts/activation, with the draw.
 lock table public.game_prizes in share row exclusive mode;
 select jsonb_agg(jsonb_build_object('id',id,'name',name) order by id) into wheel from public.game_prizes where active and quantity > 0;
 select * into prize from public.game_prizes where active and quantity > 0 order by random() limit 1;
 if not found then return jsonb_build_object('error','All prizes have been won. Please check back later.'); end if;
 update public.game_prizes set quantity = quantity - 1 where id = prize.id;
 insert into public.game_wins(request_id,name,email,prize_id,prize_name,prize_image,wheel)
 values(p_request,p_name,p_email,prize.id,prize.name,prize.image,wheel) returning id into win_id;
 insert into private.game_ip_wins(identity,win_id) values(p_identity,win_id);
 return jsonb_build_object('id',win_id,'prize_id',prize.id,'prize_name',prize.name,'prize_image',prize.image,'wheel',wheel);
end $$;
revoke all on function public.spin_game(uuid,text,text,text) from public, anon, authenticated;
grant execute on function public.spin_game(uuid,text,text,text) to service_role;
