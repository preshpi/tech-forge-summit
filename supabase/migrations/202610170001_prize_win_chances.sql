alter table public.game_prizes
 add column win_chance integer not null default 1
 check (win_chance between 0 and 100);

update public.game_prizes
set win_chance = case
 when lower(name) in ('premium ticket', 'pitch your business') then 2
 when lower(name) = 'techforge merch' then 5
 else 20
end;

-- Keep the legacy aggregate setting accurate for older deployed clients. New
-- clients calculate the total directly from the available prize rows.
update public.game_settings
set win_chance = (
 select coalesce(sum(win_chance), 0)::integer
 from public.game_prizes
 where active and quantity > 0
);

create function private.enforce_game_prize_chance_total()
returns trigger
language plpgsql
set search_path = ''
as $$
declare configured_total integer;
begin
 if new.active and new.quantity > 0 then
  select coalesce(sum(win_chance), 0)::integer
  into configured_total
  from public.game_prizes
  where id <> new.id and active and quantity > 0;

  if configured_total + new.win_chance > 100 then
   raise exception using
    errcode = '23514',
    message = 'Available prize chances cannot total more than 100%.';
  end if;
 end if;
 return new;
end
$$;

create trigger enforce_game_prize_chance_total
before insert or update of win_chance, active, quantity on public.game_prizes
for each row execute function private.enforce_game_prize_chance_total();

create or replace function public.spin_game(p_request uuid, p_name text, p_email text, p_identity text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
 old public.game_attempts;
 prize public.game_prizes;
 candidate public.game_prizes;
 prior public.game_attempts;
 wheel jsonb;
 attempt_id uuid;
 segment_id text;
 result_outcome text;
 total_chance integer;
 cumulative_chance integer := 0;
 draw numeric;
 won boolean := false;
 prize_count integer;
begin
 p_name := btrim(p_name);
 p_email := lower(btrim(p_email));
 if p_request is null or p_name is null or length(p_name) not between 1 and 100 or p_email is null or length(p_email) > 254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
  return jsonb_build_object('error', 'Please enter a valid name and email address.');
 end if;
 if p_identity is null or p_identity !~ '^[a-f0-9]{64}$' then
  return jsonb_build_object('error', 'Unable to verify your network. Please try again later.');
 end if;

 perform pg_advisory_xact_lock(20261009);
 select * into old from public.game_attempts where request_id = p_request;
 if found then
  if old.email <> p_email or old.name <> p_name then
   return jsonb_build_object('error', 'These spin details do not match the original request.');
  end if;
  return jsonb_build_object('id', old.id, 'outcome', old.outcome, 'prize_id', old.prize_id, 'prize_name', old.prize_name, 'prize_image', old.prize_image, 'wheel', old.wheel, 'win_chance', old.win_chance, 'segment_id', old.segment_id);
 end if;

 select a.* into prior
 from private.game_ip_attempts i
 join public.game_attempts a on a.id = i.attempt_id
 where i.identity = p_identity;
 if exists(select 1 from public.game_attempts where email = p_email) and
    (prior.id is null or prior.email <> p_email or prior.name <> p_name or prior.outcome <> 'try_again') then
  return jsonb_build_object('error', 'This email has already been used to spin. One attempt per email address.');
 end if;
 if prior.id is not null and (prior.email <> p_email or prior.name <> p_name or prior.outcome <> 'try_again') then
  return jsonb_build_object('error', 'Someone has already spun from this network. One attempt per IP address.');
 end if;

 lock table public.game_prizes in share row exclusive mode;
 select count(*), coalesce(sum(win_chance), 0)::integer
 into prize_count, total_chance
 from public.game_prizes
 where active and quantity > 0;
 if prize_count = 0 then
  return jsonb_build_object('error', 'All prizes have been won. Please check back later.');
 end if;
 if total_chance > 100 then
  return jsonb_build_object('error', 'The game prize chances are not configured correctly.');
 end if;

 with segments as (
  select id::text, name, win_chance::numeric as weight,
   row_number() over(order by id) as position, 0 as kind
  from public.game_prizes
  where active and quantity > 0 and win_chance > 0
  union all
  select case when n = 4 then 'no-prize' else 'no-prize-try-' || n end,
   case when n = 4 then 'Nothing For You' else 'Try again' end,
   (100 - total_chance)::numeric / 4, n, 1
  from generate_series(1, 4) n
  where total_chance < 100
 )
 select jsonb_agg(jsonb_build_object('id', id, 'name', name, 'weight', weight) order by position, kind)
 into wheel
 from segments;

 draw := random() * 100;
 for candidate in
  select * from public.game_prizes
  where active and quantity > 0 and win_chance > 0
  order by id
 loop
  cumulative_chance := cumulative_chance + candidate.win_chance;
  if draw < cumulative_chance then
   prize := candidate;
   won := true;
   exit;
  end if;
 end loop;

 if won then
  update public.game_prizes set quantity = quantity - 1 where id = prize.id;
  segment_id := prize.id::text;
  result_outcome := 'won';
 else
  segment_id := case floor(random() * 4)::integer
   when 0 then 'no-prize-try-1'
   when 1 then 'no-prize-try-2'
   when 2 then 'no-prize-try-3'
   else 'no-prize'
  end;
  result_outcome := case when segment_id = 'no-prize' then 'no_prize' else 'try_again' end;
 end if;

 insert into public.game_attempts(request_id, name, email, outcome, prize_id, prize_name, prize_image, wheel, win_chance, segment_id)
 values(p_request, p_name, p_email, result_outcome, prize.id, prize.name, prize.image, wheel, total_chance, segment_id)
 returning id into attempt_id;
 insert into private.game_ip_attempts(identity, attempt_id)
 values(p_identity, attempt_id)
 on conflict(identity) do update set attempt_id = excluded.attempt_id;
 if won then
  insert into public.game_wins(id, request_id, name, email, prize_id, prize_name, prize_image, wheel)
  values(attempt_id, p_request, p_name, p_email, prize.id, prize.name, prize.image, wheel);
 end if;

 return jsonb_build_object('id', attempt_id, 'outcome', result_outcome, 'prize_id', prize.id, 'prize_name', prize.name, 'prize_image', prize.image, 'wheel', wheel, 'win_chance', total_chance, 'segment_id', segment_id);
end
$$;
