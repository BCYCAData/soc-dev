-- B3: tighten always-true RLS policies on the pre-auth error-log tables
-- (signin_errors, signup_errors).
--
-- Before:
--   * SELECT to `authenticated` USING (true)  -> ANY signed-in user could read
--     every row (email, client_ip, user_agent, error_details, metadata) — a PII
--     leak. No app code reads these tables (writes only, via errorLogging.ts).
--   * INSERT to `anon` WITH CHECK (true)       -> arbitrary unbounded inserts.
--
-- After:
--   * SELECT restricted to admins via the server-set `user_role` JWT claim
--     (injected by custom_access_token_hook; not user-editable). Wrapped in a
--     scalar subquery so it is evaluated once per query (auth_rls_initplan).
--   * INSERT still allowed for `anon` (required pre-auth) but bounded by payload
--     length caps. (RLS can't rate-limit row counts — that needs app-level.)

-- ---- signin_errors ----
drop policy if exists "Enable read access for authenticated users" on public.signin_errors;
drop policy if exists "Allow anonymous inserts" on public.signin_errors;

create policy "Admins can read signin errors"
  on public.signin_errors for select to authenticated
  using ( (select auth.jwt() ->> 'user_role') = 'admin' );

create policy "Allow bounded anonymous inserts"
  on public.signin_errors for insert to anon
  with check (
    length(email) <= 320
    and length(error_type) <= 100
    and length(error_message) <= 2000
    and (user_agent is null or length(user_agent) <= 1000)
    and (error_details is null or length(error_details::text) <= 10000)
    and (metadata is null or length(metadata::text) <= 10000)
  );

-- ---- signup_errors ----
drop policy if exists "Enable read access for authenticated users" on public.signup_errors;
drop policy if exists "Allow anonymous inserts" on public.signup_errors;

create policy "Admins can read signup errors"
  on public.signup_errors for select to authenticated
  using ( (select auth.jwt() ->> 'user_role') = 'admin' );

create policy "Allow bounded anonymous inserts"
  on public.signup_errors for insert to anon
  with check (
    length(email) <= 320
    and length(error_type) <= 100
    and length(error_message) <= 2000
    and (user_agent is null or length(user_agent) <= 1000)
    and (error_details is null or length(error_details::text) <= 10000)
    and (metadata is null or length(metadata::text) <= 10000)
  );
