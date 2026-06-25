-- Companion to 20260625000000 (hook now reads property_ids from
-- user_property_profile_join). The custom_access_token_hook reads its source
-- tables with supabase_auth_admin as the effective RLS role; every other source
-- table (user_roles_primary, user_permissions, user_communities,
-- kyng_area_users_join) grants supabase_auth_admin SELECT and has an
-- "Allow auth admin to read ..." policy with USING (true).
--
-- user_property_profile_join was missing both, so the rewritten hook read zero
-- rows and emitted an empty property_ids claim -> 403 on every property route.
-- Replicate the same access here.
GRANT SELECT ON public.user_property_profile_join TO supabase_auth_admin;

CREATE POLICY "Allow auth admin to read user_property_profile_join"
  ON public.user_property_profile_join
  AS PERMISSIVE
  FOR SELECT
  TO supabase_auth_admin
  USING (true);
