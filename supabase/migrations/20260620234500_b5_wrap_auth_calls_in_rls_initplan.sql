-- B5 (auth_rls_initplan): wrap auth.<fn>() calls in RLS policy expressions in a
-- scalar subselect so Postgres evaluates them ONCE per query (initplan) instead of
-- once per row. This is a pure performance change: the value returned is identical,
-- so it does NOT change which rows any role can see/modify.
--
-- Transformation: auth.uid()/auth.jwt()/auth.email()/auth.role()  ->  (SELECT auth.<fn>())
--
-- Safe + idempotent:
--   * Only policies whose USING/WITH CHECK contain an UNwrapped auth call are touched
--     (guard `!~* 'select[ (]+auth\.'` skips anything already wrapped), so re-running
--     this migration is a no-op and there is no risk of double-wrapping.
--   * Roles / command / permissive flag are preserved (ALTER POLICY only rewrites the
--     USING / WITH CHECK expressions).
--   * Excludes the 3 already-optimised policies (signin_errors / signup_errors admin
--     read, survey_responses UPDATE).
-- Applied to supabase-dev only. Verified via get_advisors (auth_rls_initplan 89 -> 0)
-- and a policy-count check (no policies added/dropped).

do $$
declare
  r record;
  using_clause text;
  check_clause text;
begin
  for r in
    select schemaname, tablename, policyname, qual, with_check
    from pg_policies
    where schemaname in ('public','private')
      and ( (qual is not null       and qual       ~ 'auth\.(uid|jwt|email|role)\(\)' and qual       !~* 'select[ (]+auth\.')
         or (with_check is not null and with_check ~ 'auth\.(uid|jwt|email|role)\(\)' and with_check !~* 'select[ (]+auth\.') )
  loop
    using_clause := case when r.qual is not null
      then ' USING (' || regexp_replace(r.qual, 'auth\.(uid|jwt|email|role)\(\)', '(SELECT auth.\1())', 'g') || ')'
      else '' end;
    check_clause := case when r.with_check is not null
      then ' WITH CHECK (' || regexp_replace(r.with_check, 'auth\.(uid|jwt|email|role)\(\)', '(SELECT auth.\1())', 'g') || ')'
      else '' end;
    execute format('ALTER POLICY %I ON %I.%I%s%s', r.policyname, r.schemaname, r.tablename, using_clause, check_clause);
  end loop;
end $$;
