create schema if not exists private;
revoke all on schema private from public;
create table private.admins (user_id uuid primary key references auth.users(id) on delete cascade);
create function public.is_question_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from private.admins where user_id = auth.uid());
$$;
revoke all on function public.is_question_admin() from public;
grant execute on function public.is_question_admin() to anon, authenticated;
create table public.question_events (
 id uuid primary key default gen_random_uuid(), slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text not null check (length(btrim(title)) between 1 and 160), edition integer not null check (edition between 2026 and 2100),
 published boolean not null default false, event_date date
);
create table public.question_sessions (
 id uuid primary key default gen_random_uuid(), event_id uuid not null references public.question_events(id) on delete restrict,
 slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), title text not null check (length(btrim(title)) between 1 and 160),
 speaker text check (length(speaker) <= 160), starts_at timestamptz,
 published boolean not null default false, intake_open boolean not null default false, position integer not null default 0,
 unique(event_id, slug), check (not intake_open or published)
);
create index question_sessions_listing on public.question_sessions(event_id, position, id);
create table public.audience_questions (
 id uuid primary key default gen_random_uuid(), session_id uuid not null references public.question_sessions(id) on delete restrict,
 name text not null default 'Anonymous' check (length(btrim(name)) between 1 and 80),
 speaker_point text check (length(speaker_point) <= 300), body text not null check (length(btrim(body)) between 10 and 2000),
 visible boolean not null default true, created_at timestamptz not null default now()
);
create index audience_questions_page on public.audience_questions(session_id, created_at desc, id desc);
create index audience_questions_visible_page on public.audience_questions(session_id, created_at desc, id desc) where visible;
create table private.question_requests (
 request_id uuid primary key, fingerprint text not null, question_id uuid not null references public.audience_questions(id), created_at timestamptz not null default now()
);
create table private.question_limits (bucket text primary key, window_start timestamptz not null, hits integer not null);
alter table private.admins enable row level security;
alter table private.question_requests enable row level security;
alter table private.question_limits enable row level security;
alter table public.question_events enable row level security;
alter table public.question_sessions enable row level security;
alter table public.audience_questions enable row level security;
revoke all on public.question_events, public.question_sessions, public.audience_questions from public, anon, authenticated;
grant select on public.question_events, public.question_sessions, public.audience_questions to anon, authenticated;
grant insert, update on public.question_events, public.question_sessions to authenticated;
grant update(visible) on public.audience_questions to authenticated;
create policy event_read on public.question_events for select to anon, authenticated using (published or public.is_question_admin());
create policy event_admin_insert on public.question_events for insert to authenticated with check (public.is_question_admin());
create policy event_admin_update on public.question_events for update to authenticated using (public.is_question_admin()) with check (public.is_question_admin());
create policy session_read on public.question_sessions for select to anon, authenticated using (public.is_question_admin() or (published and exists(select 1 from public.question_events e where e.id = event_id and e.published)));
create policy session_admin_insert on public.question_sessions for insert to authenticated with check (public.is_question_admin());
create policy session_admin_update on public.question_sessions for update to authenticated using (public.is_question_admin()) with check (public.is_question_admin());
create policy question_read on public.audience_questions for select to anon, authenticated using (public.is_question_admin() or (visible and exists(select 1 from public.question_sessions s join public.question_events e on e.id = s.event_id where s.id = session_id and s.published and e.published)));
create policy question_moderate on public.audience_questions for update to authenticated using (public.is_question_admin()) with check (public.is_question_admin());
-- Locks also serialize intake/publication changes against submissions.
create function public.submit_audience_question(p_session uuid, p_request uuid, p_identity text, p_name text, p_point text, p_body text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare s public.question_sessions; e public.question_events; old private.question_requests; fingerprint text; q uuid; bucket_name text; hits integer;
begin
 if p_identity is null or length(p_identity) <> 64 or p_identity !~ '^[a-f0-9]+$' then raise exception 'Invalid identity'; end if;
 p_name := coalesce(nullif(btrim(p_name), ''), 'Anonymous'); p_point := nullif(btrim(p_point), ''); p_body := btrim(p_body);
 if p_body is null or length(p_body) not between 10 and 2000 or length(p_name)>80 or length(p_point)>300 then raise exception 'Invalid question'; end if;
 fingerprint := encode(sha256(convert_to(jsonb_build_array(p_session,p_identity,p_name,p_point,p_body)::text,'UTF8')),'hex');
 perform pg_advisory_xact_lock(hashtextextended(p_request::text,0));
 select * into old from private.question_requests where request_id = p_request;
 if found then
  if old.fingerprint <> fingerprint then return jsonb_build_object('error','idempotency_conflict','status',409); end if;
  return jsonb_build_object('id',old.question_id,'replayed',true);
 end if;
 select * into s from public.question_sessions where id=p_session for share;
 if not found then return jsonb_build_object('error','unavailable','status',404); end if;
 select * into e from public.question_events where id=s.event_id for share;
 if not s.published or not e.published then return jsonb_build_object('error','unavailable','status',404); end if;
 if not s.intake_open then return jsonb_build_object('error','intake_closed','status',409); end if;
 -- Global session cap also protects storage if client addresses are rotated.
 foreach bucket_name in array array['ip:'||p_identity, 'session:'||p_session::text] loop
  insert into private.question_limits(bucket,window_start,hits) values(bucket_name,now(),1)
  on conflict(bucket) do update set
   hits=case when private.question_limits.window_start < now()-interval '10 minutes' then 1 else private.question_limits.hits+1 end,
   window_start=case when private.question_limits.window_start < now()-interval '10 minutes' then now() else private.question_limits.window_start end
  returning question_limits.hits into hits;
  if hits > (case when bucket_name like 'ip:%' then 5 else 100 end) then return jsonb_build_object('error','rate_limited','status',429); end if;
 end loop;
 insert into public.audience_questions(session_id,name,speaker_point,body) values(p_session,p_name,p_point,p_body) returning id into q;
 insert into private.question_requests(request_id,fingerprint,question_id) values(p_request,fingerprint,q);
 return jsonb_build_object('id',q,'replayed',false);
end;
$$;
revoke all on function public.submit_audience_question(uuid,uuid,text,text,text,text) from public, anon, authenticated;
grant execute on function public.submit_audience_question(uuid,uuid,text,text,text,text) to service_role;
insert into public.question_events(slug,title,edition) values ('pre-techforge-2026','Pre-TechForge',2026),('main-event-2026','Main Event',2026);
insert into public.question_sessions(event_id,slug,title,position)
select e.id,'session-'||n,'Session '||n,n from public.question_events e cross join generate_series(1,5) n where e.slug='pre-techforge-2026';
insert into public.question_sessions(event_id,slug,title,position)
select e.id,'session-'||n,'Session '||n,n from public.question_events e cross join generate_series(1,2) n where e.slug='main-event-2026';
