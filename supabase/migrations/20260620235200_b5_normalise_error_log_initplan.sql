-- B5 (auth_rls_initplan) follow-up: the signin_errors/signup_errors admin-read
-- policies (added in 20260620070420_b3_tighten_error_log_policies) wrapped the whole
-- `auth.jwt() ->> 'user_role'` extraction in a subselect: (SELECT (auth.jwt() ->> ...)).
-- That already evaluates auth.jwt() once, but the advisor's heuristic wants the select
-- around the auth call itself. Normalise to the canonical (SELECT auth.jwt()) ->> ...
-- form. Pure performance/cosmetic; the admin-only semantics are unchanged.

alter policy "Admins can read signin errors" on public.signin_errors
  using ((((select auth.jwt()) ->> 'user_role'::text) = 'admin'::text));

alter policy "Admins can read signup errors" on public.signup_errors
  using ((((select auth.jwt()) ->> 'user_role'::text) = 'admin'::text));
