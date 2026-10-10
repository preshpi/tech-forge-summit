begin;
create function public.retry_assert(ok boolean, message text) returns void language plpgsql as $$ begin if ok is distinct from true then raise exception 'Assertion failed: %',message; end if; end $$;
insert into public.game_prizes(id,name,quantity,active) values('23000000-0000-4000-8000-000000000001','Retry prize',10,true);
-- Seed an earned retry for each segment; no random outcomes are needed for eligibility checks.
insert into public.game_attempts(id,request_id,name,email,outcome,wheel,win_chance,segment_id)
select ('43000000-0000-4000-8000-00000000000'||n)::uuid,('33000000-0000-4000-8000-00000000000'||n)::uuid,
 'Retry attendee','retry'||n||'@example.invalid','try_again',jsonb_build_array(jsonb_build_object('id','no-prize-try-'||n,'name','Try again','weight',20)),20,'no-prize-try-'||n from generate_series(1,3) n;
insert into private.game_ip_attempts(identity,attempt_id) select repeat(n::text,64),('43000000-0000-4000-8000-00000000000'||n)::uuid from generate_series(1,3) n;
update public.game_settings set win_chance=100;
set local role service_role;
select public.retry_assert(public.spin_game(gen_random_uuid(),'Other','other@example.invalid',repeat('1',64)) ? 'error','Cannot transfer retry to another email');
select public.retry_assert(public.spin_game(gen_random_uuid(),'Retry attendee','retry1@example.invalid',repeat('f',64)) ? 'error','Cannot transfer retry to another network');
select public.retry_assert(public.spin_game(gen_random_uuid(),'Other','retry1@example.invalid',repeat('1',64)) ? 'error','Cannot change retry name');
update public.game_prizes set quantity=0;
select public.retry_assert(public.spin_game('73000000-0000-4000-8000-000000000001','Retry attendee','retry1@example.invalid',repeat('1',64)) ? 'error','No stock rejects earned retry');
select public.retry_assert((select count(*)=3 from public.game_attempts),'No stock does not consume retry');
update public.game_prizes set quantity=10;
select public.retry_assert(public.spin_game(('33000000-0000-4000-8000-00000000000'||n)::uuid,'Retry attendee','retry'||n||'@example.invalid',repeat(n::text,64))->>'segment_id'='no-prize-try-'||n,'Retry receipts preserve each segment') from generate_series(1,3) n;
select public.retry_assert(public.spin_game(('53000000-0000-4000-8000-00000000000'||n)::uuid,'Retry attendee','retry'||n||'@example.invalid',repeat(n::text,64))->>'outcome'='won','Each earned retry can award a prize') from generate_series(1,3) n;
select public.retry_assert((select quantity=7 from public.game_prizes),'Only three wins consumed stock');
select public.retry_assert((select count(*)=6 from public.game_attempts),'Admin history retains retries and final wins');
select public.retry_assert(public.spin_game('53000000-0000-4000-8000-000000000001','Retry attendee','retry1@example.invalid',repeat('1',64))->>'outcome'='won','Lost response replay returns same win');
select public.retry_assert((select quantity=7 from public.game_prizes),'Replay consumes no extra stock');
select public.retry_assert(public.spin_game(gen_random_uuid(),'Retry attendee','retry1@example.invalid',repeat('1',64)) ? 'error','Winner cannot spin again');
select public.retry_assert(public.spin_game('33000000-0000-4000-8000-000000000001','Retry attendee','retry1@example.invalid',repeat('1',64))->>'outcome'='try_again','Historical retry receipt is unchanged');
select public.retry_assert(public.spin_game(gen_random_uuid(),'Retry attendee','retry1@example.invalid',repeat('1',64)) ? 'error','Replaying a historical retry cannot reopen the game');
-- Final non-winner cannot resume either.
insert into public.game_attempts(id,request_id,name,email,outcome,wheel,win_chance,segment_id) values('43000000-0000-4000-8000-000000000004',gen_random_uuid(),'Finished','finished@example.invalid','no_prize','[]',20,'no-prize');
reset role;
insert into private.game_ip_attempts(identity,attempt_id) values(repeat('4',64),'43000000-0000-4000-8000-000000000004');
set local role service_role;
select public.retry_assert(public.spin_game(gen_random_uuid(),'Finished','finished@example.invalid',repeat('4',64)) ? 'error','Nothing For You ends game');
select public.retry_assert(public.spin_game(gen_random_uuid(),'Other','another@example.invalid',repeat('4',64)) ? 'error','Final loss blocks a different email on the same network');
update public.game_settings set win_chance=0;
select public.spin_game('63000000-0000-4000-8000-000000000001','Zero','zero@example.invalid',repeat('5',64));
select public.retry_assert((select outcome in ('try_again','no_prize') and prize_id is null and jsonb_array_length(wheel)=4 and ((outcome='try_again')=(segment_id<>'no-prize')) from public.game_attempts where email='zero@example.invalid'),'0% draws only retry or Nothing For You with matching segment');
select public.retry_assert((select quantity=7 from public.game_prizes),'Non-winning result leaves stock unchanged');
update public.game_settings set win_chance=20;
select public.spin_game('63000000-0000-4000-8000-000000000002','Twenty','twenty@example.invalid',repeat('6',64));
select public.retry_assert((select jsonb_array_length(wheel)=5 and (select sum((s->>'weight')::numeric) from jsonb_array_elements(wheel) s)=100 and (select count(*) from jsonb_array_elements(wheel) s where s->>'name'='Try again')=3 and (select count(*) from jsonb_array_elements(wheel) s where s->>'name'='Nothing For You')=1 and (select sum((s->>'weight')::numeric) from jsonb_array_elements(wheel) s where s->>'id' like 'no-prize%')=80 from public.game_attempts where email='twenty@example.invalid'),'20% prize, 60% retry, 20% final loss wheel');
reset role;
select public.retry_assert((select count(*)=6 from private.game_ip_attempts),'Each network has one current result');
rollback;
