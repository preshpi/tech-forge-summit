alter table public.question_events add column kind text not null default 'pre' check(kind in ('pre','main'));
update public.question_events set kind='main' where slug='main-event-2026';
create function private.validate_question_schedule() returns trigger language plpgsql security definer set search_path='' as $$
declare e public.question_events; day date;
begin
 select * into e from public.question_events where id=new.event_id for update;
 if new.published then
  if new.starts_at is null then raise exception 'Published sessions require a confirmed date'; end if;
  day := (new.starts_at at time zone 'Africa/Lagos')::date;
  if e.kind='main' and (e.event_date is null or day<>e.event_date) then raise exception 'Main Event sessions must use the event date'; end if;
  if e.kind='pre' and exists(select 1 from public.question_sessions s where s.event_id=new.event_id and s.id<>new.id and s.published and (s.starts_at at time zone 'Africa/Lagos')::date=day) then raise exception 'Pre-TechForge sessions must use different dates'; end if;
 end if;
 return new;
end;
$$;
create trigger validate_question_schedule before insert or update on public.question_sessions for each row execute function private.validate_question_schedule();
create function private.validate_question_event_date() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.kind='main' and exists(select 1 from public.question_sessions s where s.event_id=new.id and s.published and (new.event_date is null or (s.starts_at at time zone 'Africa/Lagos')::date<>new.event_date)) then raise exception 'Unpublish sessions before changing the event date'; end if;
 if new.kind='pre' and exists(select 1 from public.question_sessions s where s.event_id=new.id and s.published group by (s.starts_at at time zone 'Africa/Lagos')::date having count(*)>1) then raise exception 'Pre-TechForge sessions must use different dates'; end if;
 return new;
end;
$$;
create trigger validate_question_event_date before update on public.question_events for each row execute function private.validate_question_event_date();
