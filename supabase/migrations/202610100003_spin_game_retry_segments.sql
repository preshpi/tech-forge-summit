-- Each Try again is recorded and permits a new request by the same attendee/network.
alter table public.game_attempts drop constraint game_attempts_email_key;
alter table public.game_attempts drop constraint game_attempts_outcome_check;
alter table public.game_attempts drop constraint game_attempts_check;
alter table public.game_attempts add column segment_id text;
update public.game_attempts set segment_id=coalesce(prize_id::text,'no-prize');
alter table public.game_attempts alter column segment_id set not null;
alter table public.game_attempts add constraint game_attempts_outcome_check check(outcome in ('won','no_prize','try_again'));
alter table public.game_attempts add constraint game_attempts_check check(
 (outcome='won' and prize_id is not null and prize_name is not null and segment_id=prize_id::text) or
 (outcome in ('no_prize','try_again') and prize_id is null and prize_name is null and prize_image is null and
  ((outcome='no_prize' and segment_id='no-prize') or (outcome='try_again' and segment_id in ('no-prize-try-1','no-prize-try-2','no-prize-try-3'))))
);
create unique index game_attempts_final_email on public.game_attempts(email) where outcome<>'try_again';
create index game_attempts_email on public.game_attempts(email);

create or replace function public.spin_game(p_request uuid, p_name text, p_email text, p_identity text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare old public.game_attempts; prize public.game_prizes; wheel jsonb; attempt_id uuid; prior public.game_attempts; segment_id text; result_outcome text; chance integer; won boolean; prize_count integer;
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
  return jsonb_build_object('id',old.id,'outcome',old.outcome,'prize_id',old.prize_id,'prize_name',old.prize_name,'prize_image',old.prize_image,'wheel',old.wheel,'win_chance',old.win_chance,'segment_id',old.segment_id);
 end if;
 select a.* into prior from private.game_ip_attempts i join public.game_attempts a on a.id=i.attempt_id where i.identity=p_identity;
 if exists(select 1 from public.game_attempts where email=p_email) and
    (prior.id is null or prior.email<>p_email or prior.name<>p_name or prior.outcome<>'try_again') then
  return jsonb_build_object('error','This email has already been used to spin. One attempt per email address.');
 end if;
 if prior.id is not null and (prior.email<>p_email or prior.name<>p_name or prior.outcome<>'try_again') then
  return jsonb_build_object('error','Someone has already spun from this network. One attempt per IP address.');
 end if;
 select win_chance into chance from public.game_settings where id = true for share;
 if chance is null then return jsonb_build_object('error','The game is not configured yet.'); end if;
 lock table public.game_prizes in share row exclusive mode;
 select count(*) into prize_count from public.game_prizes where active and quantity > 0;
 if prize_count = 0 then return jsonb_build_object('error','All prizes have been won. Please check back later.'); end if;
 with segments as (
  select id::text as id,name,chance::numeric/prize_count as weight,row_number() over(order by id) as position,0 as kind
  from public.game_prizes where active and quantity>0 and chance>0
  union all
  select case when n=4 then 'no-prize' else 'no-prize-try-'||n end,
   case when n=4 then 'Nothing For You' else 'Try again' end,(100-chance)::numeric/4,n,1
  from generate_series(1,4) n where chance<100
 ) select jsonb_agg(jsonb_build_object('id',id,'name',name,'weight',weight) order by position,kind) into wheel from segments;
 won := random() * 100 < chance;
 if won then
  select * into prize from public.game_prizes where active and quantity > 0 order by random() limit 1;
  update public.game_prizes set quantity = quantity - 1 where id = prize.id;
  segment_id := prize.id::text;
  result_outcome := 'won';
 else
  segment_id := case floor(random()*4)::integer when 0 then 'no-prize-try-1' when 1 then 'no-prize-try-2' when 2 then 'no-prize-try-3' else 'no-prize' end;
  result_outcome := case when segment_id='no-prize' then 'no_prize' else 'try_again' end;
 end if;
 insert into public.game_attempts(request_id,name,email,outcome,prize_id,prize_name,prize_image,wheel,win_chance,segment_id)
 values(p_request,p_name,p_email,result_outcome,prize.id,prize.name,prize.image,wheel,chance,segment_id) returning id into attempt_id;
 insert into private.game_ip_attempts(identity,attempt_id) values(p_identity,attempt_id) on conflict(identity) do update set attempt_id=excluded.attempt_id;
 if won then
  insert into public.game_wins(id,request_id,name,email,prize_id,prize_name,prize_image,wheel)
  values(attempt_id,p_request,p_name,p_email,prize.id,prize.name,prize.image,wheel);
 end if;
 return jsonb_build_object('id',attempt_id,'outcome',result_outcome,'prize_id',prize.id,'prize_name',prize.name,'prize_image',prize.image,'wheel',wheel,'win_chance',chance,'segment_id',segment_id);
end $$;
revoke all on function public.spin_game(uuid,text,text,text) from public, anon, authenticated;
grant execute on function public.spin_game(uuid,text,text,text) to service_role;
