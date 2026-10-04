begin;
create function public.tf_assert(ok boolean,message text) returns void language plpgsql as $$ begin if ok is distinct from true then raise exception 'Assertion failed: %',message; end if; end $$;
insert into auth.users(id,email) values('10000000-0000-4000-8000-000000000001','admin-test@example.invalid');
select public.provision_question_admin('10000000-0000-4000-8000-000000000001');
insert into public.question_events(id,slug,title,edition,published,kind) values('20000000-0000-4000-8000-000000000001','deletion-test','Deletion test',2026,true,'pre');
insert into public.question_sessions(id,event_id,slug,title,published,intake_open,starts_at) values('30000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','one','Test one',true,true,'2026-01-01T12:00:00+01:00');
create temporary table deletion_fixture(label text,id uuid);
insert into deletion_fixture values
('one',(public.submit_audience_question('30000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',repeat('a',64),'Owner one','Referenced point','First owned question',repeat('b',64))->>'id')::uuid),
('two',(public.submit_audience_question('30000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000002',repeat('a',64),'Owner two','','Second owned question',repeat('c',64))->>'id')::uuid);
grant select on deletion_fixture to anon,authenticated,service_role;
select public.tf_assert((select token_hash<>repeat('b',64) and length(token_hash)=64 from private.question_owners where question_id=(select id from deletion_fixture where label='one')),'Only token hashes stored');
select public.tf_assert((public.submit_audience_question('30000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',repeat('a',64),'Owner one','Referenced point','First owned question',repeat('b',64))->>'replayed')='true','Retry retains ownership');
select public.tf_assert((public.submit_audience_question('30000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',repeat('a',64),'Owner one','Referenced point','First owned question',repeat('c',64))->>'status')='409','Retry cannot replace owner key');
set local role anon;
do $$ begin
 begin perform * from private.question_owners; raise exception 'Public ownership read allowed'; exception when insufficient_privilege then null; end;
 begin perform public.delete_audience_question((select id from deletion_fixture where label='one'),repeat('b',64),repeat('a',64)); raise exception 'Direct public deletion RPC allowed'; exception when insufficient_privilege then null; end;
 begin delete from public.audience_questions where id=(select id from deletion_fixture where label='one'); raise exception 'Direct public delete allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
select public.tf_assert((public.delete_audience_question((select id from deletion_fixture where label='two'),repeat('b',64),repeat('a',64))->>'status')='403','One owner cannot delete another question');
select public.tf_assert((public.delete_audience_question(gen_random_uuid(),repeat('b',64),repeat('a',64))->>'status')='403','Unknown ID reveals no existence information');
select public.tf_assert((public.delete_audience_question((select id from deletion_fixture where label='one'),null,repeat('a',64))->>'status')='400','Missing token rejected');
-- Ownership works after closure, moderation, and unpublication.
update public.question_sessions set intake_open=false where id='30000000-0000-4000-8000-000000000001';
update public.audience_questions set visible=false where id=(select id from deletion_fixture where label='one');
update public.question_events set published=false where id='20000000-0000-4000-8000-000000000001';
select public.tf_assert((public.delete_audience_question((select id from deletion_fixture where label='one'),repeat('b',64),repeat('a',64))->>'deleted')='true','Owner deletes hidden question after intake closes');
select public.tf_assert((public.delete_audience_question((select id from deletion_fixture where label='one'),repeat('b',64),repeat('a',64))->>'deleted')='true','Duplicate deletion is idempotent');
select public.tf_assert((select deleted and not visible and name='Anonymous' and speaker_point is null and body='Deleted question' from public.audience_questions where id=(select id from deletion_fixture where label='one')),'Personal text erased');
select public.tf_assert((public.submit_audience_question('30000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001',repeat('a',64),'Owner one','Referenced point','First owned question',repeat('b',64))->>'replayed')='true','Submission retry cannot recreate deleted content');
select public.tf_assert((select count(*)=2 from public.audience_questions),'Retry inserts no new record');
update public.question_events set published=true where id='20000000-0000-4000-8000-000000000001';
set local role anon;
select public.tf_assert((select count(*)=1 from public.audience_questions),'Only surviving question is public');
reset role;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000001',true);
set local role authenticated;
update public.audience_questions set visible=true where id=(select id from deletion_fixture where label='one');
select public.tf_assert((select count(*)=1 from public.audience_questions),'Admin cannot read or restore deleted question');
do $$ begin
 begin delete from public.audience_questions; raise exception 'Authenticated direct delete allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
-- Failed guesses also consume the persistent deletion limit.
do $$ begin for i in 1..20 loop perform public.delete_audience_question((select id from deletion_fixture where label='two'),repeat('d',64),repeat('e',64)); end loop; end $$;
select public.tf_assert((public.delete_audience_question((select id from deletion_fixture where label='two'),repeat('c',64),repeat('e',64))->>'status')='429','Persistent deletion rate limit enforced');
rollback;
