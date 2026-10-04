-- Run against a disposable migrated Supabase database as postgres. Rolls back all fixtures.
begin;
create function public.tf_assert(ok boolean, message text) returns void language plpgsql as $$ begin if ok is distinct from true then raise exception 'Assertion failed: %',message; end if; end $$;
insert into auth.users(id,email) values ('10000000-0000-4000-8000-000000000001','admin-test@example.invalid'),('10000000-0000-4000-8000-000000000002','attendee-test@example.invalid');
insert into public.question_events(id,slug,title,edition,published,kind) values
('20000000-0000-4000-8000-000000000001','test-event','Test event',2026,true,'pre'),
('20000000-0000-4000-8000-000000000002','test-draft','Test draft',2026,false,'pre');
insert into public.question_sessions(id,event_id,slug,title,published,intake_open,starts_at) values
('30000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','one','Test one',true,true,'2026-01-01T12:00:00+01:00'),
('30000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000001','two','Test two',true,true,'2026-01-02T12:00:00+01:00'),
('30000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000002','draft','Test draft',false,false,null);
set local role anon;
select public.tf_assert((select count(*)=1 from public.question_events),'Only published events are public');
select public.tf_assert((select count(*)=2 from public.question_sessions),'Only published sessions of published events are public');
do $$ begin
 begin insert into public.audience_questions(session_id,body) values('30000000-0000-4000-8000-000000000001','Direct public write'); raise exception 'Direct insert allowed'; exception when insufficient_privilege then null; end;
 begin perform public.submit_audience_question('30000000-0000-4000-8000-000000000001',gen_random_uuid(),repeat('a',64),'','','Bypass endpoint test'); raise exception 'Public RPC allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
set local role service_role;
select public.tf_assert((public.submit_audience_question('30000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',repeat('a',64),'  ','','A valid first question')->>'replayed')='false','First submission');
select public.tf_assert((public.submit_audience_question('30000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',repeat('a',64),'','','A valid first question')->>'replayed')='true','Duplicate retry returns original');
select public.tf_assert((public.submit_audience_question('30000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000001',repeat('a',64),'','','A valid first question')->>'status')='409','Session cannot change on retry');
select public.tf_assert((public.submit_audience_question('30000000-0000-4000-8000-000000000003',gen_random_uuid(),repeat('b',64),'','','Draft question denied')->>'status')='404','Draft insertion rejected');
select public.submit_audience_question('30000000-0000-4000-8000-000000000002',gen_random_uuid(),repeat('b',64),'Example','Referenced point','A question for session two');
reset role;
select public.tf_assert((select count(*)=1 from private.question_limits where bucket='ip:'||repeat('a',64) and hits=1),'Retry consumes no rate limit');
set local role anon;
select public.tf_assert((select count(*)=1 from public.audience_questions where session_id='30000000-0000-4000-8000-000000000001'),'Session one isolation');
select public.tf_assert((select count(*)=1 from public.audience_questions where session_id='30000000-0000-4000-8000-000000000002'),'Session two isolation');
select public.tf_assert((select name='Anonymous' and speaker_point is null from public.audience_questions where session_id='30000000-0000-4000-8000-000000000001'),'Optional name and point');
reset role;
update public.question_sessions set intake_open=false where id='30000000-0000-4000-8000-000000000001';
set local role service_role;
select public.tf_assert((public.submit_audience_question('30000000-0000-4000-8000-000000000001',gen_random_uuid(),repeat('a',64),'','','Closed intake question')->>'status')='409','Closed intake rejected');
select public.tf_assert((public.submit_audience_question('30000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',repeat('a',64),'','','A valid first question')->>'replayed')='true','Committed retry works after closure');
reset role;
set local role anon;
select public.tf_assert((select count(*)=2 from public.audience_questions),'Closed questions remain readable');
reset role;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000002',true);
set local role authenticated;
select public.tf_assert(not public.is_question_admin(),'Registered attendees are not admins');
update public.question_events set title='Unauthorised change' where id='20000000-0000-4000-8000-000000000001';
select public.tf_assert((select title='Test event' from public.question_events where id='20000000-0000-4000-8000-000000000001'),'Non-admin cannot manage events');
do $$ begin
 begin perform public.provision_question_admin('10000000-0000-4000-8000-000000000002'); raise exception 'Self-promotion allowed'; exception when insufficient_privilege then null; end;
 begin insert into private.admins values('10000000-0000-4000-8000-000000000002'); raise exception 'Allowlist writable'; exception when insufficient_privilege then null; end;
end $$;
reset role;
select public.provision_question_admin('10000000-0000-4000-8000-000000000001');
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
set local role authenticated;
select public.tf_assert(public.is_question_admin(),'Allowlisted admin authorised');
select public.tf_assert((select count(*)=4 from public.question_events),'Admin sees drafts');
update public.audience_questions set visible=false where session_id='30000000-0000-4000-8000-000000000001';
do $$ begin
 begin update public.audience_questions set body='Rewritten question'; raise exception 'Question body edit allowed'; exception when insufficient_privilege then null; end;
end $$;
update public.question_events set title='Admin managed event' where id='20000000-0000-4000-8000-000000000001';
select public.tf_assert((select title='Admin managed event' from public.question_events where id='20000000-0000-4000-8000-000000000001'),'Allowlisted admin can manage event');
reset role;
select set_config('request.jwt.claim.sub','',true);
set local role anon;
select public.tf_assert((select count(*)=1 from public.audience_questions),'Hidden questions not public');
reset role;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
set local role authenticated;
update public.audience_questions set visible=true where session_id='30000000-0000-4000-8000-000000000001';
reset role;
select set_config('request.jwt.claim.sub','',true);
set local role anon;
select public.tf_assert((select count(*)=2 from public.audience_questions),'Restored questions public');
reset role;
update public.question_events set published=false where id='20000000-0000-4000-8000-000000000001';
set local role anon;
select public.tf_assert((select count(*)=0 from public.audience_questions),'Unpublished parent hides questions');
select public.tf_assert((select count(*)=0 from public.question_sessions),'Unpublished parent hides sessions');
reset role;
update public.question_events set published=true where id='20000000-0000-4000-8000-000000000001';
update public.question_sessions set intake_open=true where id='30000000-0000-4000-8000-000000000001';
set local role service_role;
do $$ begin for i in 1..4 loop perform public.submit_audience_question('30000000-0000-4000-8000-000000000001',gen_random_uuid(),repeat('a',64),'','','Rate limit question '||i); end loop; end $$;
select public.tf_assert((public.submit_audience_question('30000000-0000-4000-8000-000000000001',gen_random_uuid(),repeat('a',64),'','','Sixth submission fails')->>'status')='429','Persistent limit enforced');
reset role;
do $$ begin
 begin update public.question_sessions set starts_at='2026-01-01T14:00:00+01:00' where id='30000000-0000-4000-8000-000000000002'; raise exception 'Same Pre-TechForge date allowed'; exception when raise_exception then if sqlerrm not like 'Pre-TechForge sessions%' then raise; end if; end;
end $$;
insert into public.question_events(id,slug,title,edition,kind,event_date) values('20000000-0000-4000-8000-000000000003','main-test','Main test',2026,'main','2026-02-01');
insert into public.question_sessions(event_id,slug,title,published,starts_at) values('20000000-0000-4000-8000-000000000003','main-one','Main one',true,'2026-02-01T12:00:00+01:00'),('20000000-0000-4000-8000-000000000003','main-two','Main two',true,'2026-02-01T14:00:00+01:00');
do $$ begin
 begin insert into public.question_sessions(event_id,slug,title,published,starts_at) values('20000000-0000-4000-8000-000000000003','main-wrong','Wrong date',true,'2026-02-02T12:00:00+01:00'); raise exception 'Wrong Main Event date allowed'; exception when raise_exception then if sqlerrm not like 'Main Event sessions%' then raise; end if; end;
 begin update public.question_events set event_date='2026-02-02' where id='20000000-0000-4000-8000-000000000003'; raise exception 'Event date invalidated published sessions'; exception when raise_exception then if sqlerrm not like 'Unpublish sessions%' then raise; end if; end;
end $$;
rollback;
