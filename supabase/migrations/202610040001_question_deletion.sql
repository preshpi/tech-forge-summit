alter table public.audience_questions add column deleted boolean not null default false;
create table private.question_owners (
 question_id uuid primary key references public.audience_questions(id),
 token_hash text not null check(token_hash ~ '^[a-f0-9]{64}$')
);
alter table private.question_owners enable row level security;
revoke all on private.question_owners from public, anon, authenticated;
drop policy question_read on public.audience_questions;
create policy question_read on public.audience_questions for select to anon, authenticated using (
 not deleted and (public.is_question_admin() or (visible and exists(
  select 1 from public.question_sessions s join public.question_events e on e.id=s.event_id
  where s.id=session_id and s.published and e.published
 )))
);
drop policy question_moderate on public.audience_questions;
create policy question_moderate on public.audience_questions for update to authenticated
 using (not deleted and public.is_question_admin()) with check (not deleted and public.is_question_admin());
-- Keep the legacy six-argument RPC for old deployed clients; new clients always provide a token.
create function public.submit_audience_question(p_session uuid,p_request uuid,p_identity text,p_name text,p_point text,p_body text,p_delete_token text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; digest text; owner_hash text;
begin
 if p_delete_token is null or p_delete_token !~ '^[a-f0-9]{64}$' then return jsonb_build_object('error','invalid_token','status',400); end if;
 digest:=encode(sha256(convert_to(p_delete_token,'UTF8')),'hex');
 perform pg_advisory_xact_lock(hashtextextended(p_request::text,0));
 result:=public.submit_audience_question(p_session,p_request,p_identity,p_name,p_point,p_body);
 if result ? 'error' then return result; end if;
 if (result->>'replayed')::boolean then
  select token_hash into owner_hash from private.question_owners where question_id=(result->>'id')::uuid;
  if owner_hash is distinct from digest then return jsonb_build_object('error','idempotency_conflict','status',409); end if;
 else
  insert into private.question_owners(question_id,token_hash) values((result->>'id')::uuid,digest);
 end if;
 return result || jsonb_build_object('deletion_enabled',true);
end;
$$;
revoke all on function public.submit_audience_question(uuid,uuid,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.submit_audience_question(uuid,uuid,text,text,text,text,text) to service_role;
create function public.delete_audience_question(p_question uuid,p_delete_token text,p_identity text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare owner_hash text; hits integer;
begin
 if p_delete_token is null or p_delete_token !~ '^[a-f0-9]{64}$' or p_identity is null or p_identity !~ '^[a-f0-9]{64}$' then return jsonb_build_object('error','invalid_token','status',400); end if;
 insert into private.question_limits(bucket,window_start,hits) values('delete:'||p_identity,now(),1)
 on conflict(bucket) do update set
  hits=case when private.question_limits.window_start < now()-interval '10 minutes' then 1 else private.question_limits.hits+1 end,
  window_start=case when private.question_limits.window_start < now()-interval '10 minutes' then now() else private.question_limits.window_start end
 returning question_limits.hits into hits;
 if hits>20 then return jsonb_build_object('error','rate_limited','status',429); end if;
 perform pg_advisory_xact_lock(hashtextextended(p_question::text,1));
 select token_hash into owner_hash from private.question_owners where question_id=p_question;
 -- Wrong tokens and unknown questions have the same response; no publication/intake dependency.
 if owner_hash is distinct from encode(sha256(convert_to(p_delete_token,'UTF8')),'hex') then return jsonb_build_object('error','deletion_denied','status',403); end if;
 -- Retain a minimal tombstone so submission retries cannot recreate deleted content.
 update public.audience_questions set deleted=true,visible=false,name='Anonymous',speaker_point=null,body='Deleted question' where id=p_question and not deleted;
 return jsonb_build_object('deleted',true);
end;
$$;
revoke all on function public.delete_audience_question(uuid,text,text) from public,anon,authenticated;
grant execute on function public.delete_audience_question(uuid,text,text) to service_role;
