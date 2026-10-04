-- Destructive operator-only reset. Run manually after confirming deletion.
-- This is deliberately not a migration and does not change Auth or admin access.
begin;
set local lock_timeout = '10s';
set local statement_timeout = '60s';
lock table public.question_events, public.question_sessions, public.audience_questions,
 private.question_requests, private.question_owners, private.question_limits in access exclusive mode;

create temporary table question_reset_admins on commit drop as select user_id from private.admins;

delete from private.question_requests;
delete from private.question_owners;
delete from private.question_limits;
delete from public.audience_questions;

-- Unpublish first so schedule constraints allow dates to be cleared.
update public.question_sessions set published = false, intake_open = false;
delete from public.question_sessions s where not exists (
 select 1 from public.question_events e where e.id = s.event_id and (
  (e.slug = 'pre-techforge-2026' and s.slug in ('session-1','session-2','session-3','session-4','session-5'))
  or (e.slug = 'main-event-2026' and s.slug in ('session-1','session-2'))
 )
);
delete from public.question_events where slug not in ('pre-techforge-2026','main-event-2026');

insert into public.question_events (slug,title,edition,kind,published,event_date) values
 ('pre-techforge-2026','Pre-TechForge',2026,'pre',false,null),
 ('main-event-2026','Main Event',2026,'main',false,null)
on conflict (slug) do update set title = excluded.title, edition = excluded.edition,
 kind = excluded.kind, published = false, event_date = null;

insert into public.question_sessions (event_id,slug,title,position,speaker,starts_at,published,intake_open)
select e.id, 'session-' || n, 'Session ' || n, n, null, null, false, false
from public.question_events e cross join lateral generate_series(1,case when e.kind = 'pre' then 5 else 2 end) n
on conflict (event_id,slug) do update set title = excluded.title, position = excluded.position,
 speaker = null, starts_at = null, published = false, intake_open = false;

do $$
begin
 if (select count(*) from public.question_events) <> 2
 or (select count(*) from public.question_sessions) <> 7
 or exists(select 1 from public.question_events where published or event_date is not null or edition <> 2026)
 or exists(select 1 from public.question_sessions where published or intake_open or speaker is not null or starts_at is not null)
 or exists(select 1 from public.audience_questions)
 or exists(select 1 from private.question_requests)
 or exists(select 1 from private.question_owners)
 or exists(select 1 from private.question_limits) then
  raise exception 'Question reset verification failed';
 end if;
 if exists(select user_id from private.admins except select user_id from question_reset_admins)
 or exists(select user_id from question_reset_admins except select user_id from private.admins) then
  raise exception 'Admin access changed; rolling back';
 end if;
end;
$$;
commit;
