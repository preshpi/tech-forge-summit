create function public.provision_question_admin(p_user uuid) returns void language sql security definer set search_path='' as $$
 insert into private.admins(user_id) values(p_user) on conflict do nothing;
$$;
revoke all on function public.provision_question_admin(uuid) from public, anon, authenticated;
grant execute on function public.provision_question_admin(uuid) to service_role;
