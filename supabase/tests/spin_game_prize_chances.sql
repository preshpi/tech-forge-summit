-- Run only in a disposable migrated database. The assertions inspect saved
-- probability snapshots and use 100% only where a deterministic win is needed.
begin;
create function public.prize_chance_assert(ok boolean, message text) returns void language plpgsql as $$ begin if ok is distinct from true then raise exception 'Assertion failed: %',message; end if; end $$;
insert into public.game_prizes(id,name,quantity,active,win_chance) values
 ('24000000-0000-4000-8000-000000000001','Rare',5,true,2),
 ('24000000-0000-4000-8000-000000000002','Merch',5,true,5),
 ('24000000-0000-4000-8000-000000000003','Standard',5,true,20);
do $$ begin
 begin update public.game_prizes set win_chance=94 where name='Standard'; raise exception 'Total over 100 accepted'; exception when check_violation then null; end;
end $$;
update public.game_settings set win_chance=100;
set local role service_role;
select public.spin_game('64000000-0000-4000-8000-000000000001','Weighted','weighted@example.invalid',repeat('7',64));
select public.prize_chance_assert((select win_chance=27 from public.game_attempts where email='weighted@example.invalid'),'Attempt stores the total available prize chance');
select public.prize_chance_assert((select jsonb_array_length(wheel)=7 from public.game_attempts where email='weighted@example.invalid'),'Wheel contains three prizes and four loss segments');
select public.prize_chance_assert((select (select sum((segment->>'weight')::numeric) from jsonb_array_elements(wheel) segment)=100 from public.game_attempts where email='weighted@example.invalid'),'Saved wheel weights total 100%');
select public.prize_chance_assert((select (select (segment->>'weight')::integer from jsonb_array_elements(wheel) segment where segment->>'id'='24000000-0000-4000-8000-000000000001')=2 from public.game_attempts where email='weighted@example.invalid'),'Rare prize retains its 2% chance');
select public.prize_chance_assert((select (select (segment->>'weight')::integer from jsonb_array_elements(wheel) segment where segment->>'id'='24000000-0000-4000-8000-000000000002')=5 from public.game_attempts where email='weighted@example.invalid'),'Merch retains its 5% chance');
select public.prize_chance_assert((select (select (segment->>'weight')::integer from jsonb_array_elements(wheel) segment where segment->>'id'='24000000-0000-4000-8000-000000000003')=20 from public.game_attempts where email='weighted@example.invalid'),'Standard prize retains its 20% chance');
select public.prize_chance_assert((select (select sum((segment->>'weight')::numeric) from jsonb_array_elements(wheel) segment where segment->>'id' like 'no-prize%')=73 from public.game_attempts where email='weighted@example.invalid'),'Unused 73% remains non-winning');
reset role;
update public.game_prizes set active=false;
update public.game_prizes set active=true,win_chance=100 where name='Rare';
set local role service_role;
select public.prize_chance_assert(public.spin_game('64000000-0000-4000-8000-000000000002','Certain','certain@example.invalid',repeat('8',64))->>'prize_name'='Rare','100% configured prize wins deterministically');
select public.prize_chance_assert((select quantity=4 from public.game_prizes where name='Rare'),'Weighted win decrements only its prize stock');
rollback;
