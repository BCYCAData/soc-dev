-- Replace the blanket `temp_permissive` RLS policy on 21 tables.
--
-- WHY
-- ---
-- Every one of the 21 tables below carried a single policy literally named
-- `temp_permissive`:
--
--     POLICY temp_permissive FOR ALL TO public
--       USING (auth.uid() IS NOT NULL)          -- with_check NULL -> USING governs writes too
--
-- Because it is FOR ALL with a NULL WITH CHECK, the only condition to write ANY
-- row is "be logged in" (and the qual is auth.uid() IS NOT NULL, NOT
-- user_id = auth.uid(), so a user is not even limited to their own rows).
--
-- Three of these tables feed the access-token hook / RBAC:
--   * user_permissions  -> permissions JWT claim
--   * user_role         -> read by both token-hook variants
--   * role_permissions  -> role -> permission catalog
-- So an ordinary authenticated user could INSERT an admin bundle for their own
-- id and, on the next token refresh, be minted an admin JWT. This is a live
-- privilege-escalation hole and the top cutover blocker.
--
-- DESIGN
-- ------
-- Admins are NOT a separate Postgres role: every logged-in user (admin or not)
-- connects as `authenticated`. The admin/user distinction lives only in the JWT
-- and is enforced by jwt_can() inside RLS. So:
--   * We keep the `authenticated` write GRANT on tables that admins or owners
--     legitimately write through RLS, and let the RLS policy gate them.
--   * We revoke the `authenticated` write GRANT only on tables written purely by
--     cron / SECURITY DEFINER functions / service_role (which bypass RLS).
--   * We revoke the `anon` write GRANT on all 21 (anon never writes any of them).
--
-- The RBAC materialiser (sync_user_role_materialization) and the token hook
-- (custom_access_token_hook) are both SECURITY DEFINER owned by `postgres`, so
-- they bypass RLS and are unaffected by this lockdown. The cache / NSW-source /
-- GIS tables are refreshed by pg_cron / service_role and are likewise unaffected.
--
-- Read model:
--   * Sensitive (per-user / trust) tables: read restricted to owner + admin.
--   * Non-sensitive reference / cache / GIS tables: authenticated read preserved
--     (identical to today's logged-in read), writes removed.
--
-- This migration is intentionally NOT applied automatically. Review, then apply
-- against newprod. A verification block is included at the bottom (commented).

BEGIN;

-- Ensure RLS is on (idempotent; every target already has it because
-- temp_permissive could not exist otherwise).
ALTER TABLE public.user_permissions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_communities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_postal_address    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_agent         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.street_type_aliases    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suburb_aliases         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_login_attempts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_status          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.address_response       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coordinates_kyng       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geojson                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_result        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.street_list            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_addresspoints  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_properties     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_proways        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_waypoints      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_geometry      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.x_project_area         ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- 1. Drop the blanket bridge policy on all 21 tables.
--    (Auth-admin read policies on user_permissions / user_communities are left
--    intact -- they are dropped by name nowhere here.)
-- --------------------------------------------------------------------------
DROP POLICY IF EXISTS temp_permissive ON public.user_permissions;
DROP POLICY IF EXISTS temp_permissive ON public.user_role;
DROP POLICY IF EXISTS temp_permissive ON public.role_permissions;
DROP POLICY IF EXISTS temp_permissive ON public.user_communities;
DROP POLICY IF EXISTS temp_permissive ON public.user_postal_address;
DROP POLICY IF EXISTS temp_permissive ON public.property_agent;
DROP POLICY IF EXISTS temp_permissive ON public.street_type_aliases;
DROP POLICY IF EXISTS temp_permissive ON public.suburb_aliases;
DROP POLICY IF EXISTS temp_permissive ON public.failed_login_attempts;
DROP POLICY IF EXISTS temp_permissive ON public.health_status;
DROP POLICY IF EXISTS temp_permissive ON public.address_response;
DROP POLICY IF EXISTS temp_permissive ON public.coordinates_kyng;
DROP POLICY IF EXISTS temp_permissive ON public.geojson;
DROP POLICY IF EXISTS temp_permissive ON public.property_result;
DROP POLICY IF EXISTS temp_permissive ON public.street_list;
DROP POLICY IF EXISTS temp_permissive ON public.project_addresspoints;
DROP POLICY IF EXISTS temp_permissive ON public.project_properties;
DROP POLICY IF EXISTS temp_permissive ON public.project_proways;
DROP POLICY IF EXISTS temp_permissive ON public.project_waypoints;
DROP POLICY IF EXISTS temp_permissive ON public.property_geometry;
DROP POLICY IF EXISTS temp_permissive ON public.x_project_area;

-- ==========================================================================
-- 2. TRUST ROOT -- admin-write, restricted read.
--    Data is materialised by SECURITY DEFINER triggers, so no ordinary write
--    path exists; the admin_manage policy is for corrective admin action and
--    the definer trigger keeps working (it bypasses RLS).
-- ==========================================================================

-- user_permissions (user_id, permission) -> permissions claim
DROP POLICY IF EXISTS admin_manage_user_permissions ON public.user_permissions;
DROP POLICY IF EXISTS user_read_own_user_permissions ON public.user_permissions;
CREATE POLICY admin_manage_user_permissions ON public.user_permissions
  FOR ALL TO public
  USING ((SELECT jwt_can('admin.users')));
CREATE POLICY user_read_own_user_permissions ON public.user_permissions
  FOR SELECT TO public
  USING (user_id = (SELECT auth.uid()));
-- (existing "Allow auth admin to read user_permissions" policy preserved)

-- user_role (legacy single-column table, empty; read by the token hook)
DROP POLICY IF EXISTS admin_manage_user_role ON public.user_role;
DROP POLICY IF EXISTS "Allow auth admin to read user_role" ON public.user_role;
CREATE POLICY admin_manage_user_role ON public.user_role
  FOR ALL TO public
  USING ((SELECT jwt_can('admin.users')));
-- Both token-hook variants read public.user_role. supabase_auth_admin has no
-- read path today (empty table masked it); add one so any invoker-mode hook
-- keeps reading it. Grant + policy mirror user_permissions / user_communities.
GRANT SELECT ON public.user_role TO supabase_auth_admin;
CREATE POLICY "Allow auth admin to read user_role" ON public.user_role
  FOR SELECT TO supabase_auth_admin
  USING (true);

-- role_permissions (role -> permission catalog). Managed under
-- admin/site/roles/permissions; read by both the permissions and assignments
-- admin pages. Writes gated to the permissions admin; reads to either.
DROP POLICY IF EXISTS admin_manage_role_permissions ON public.role_permissions;
DROP POLICY IF EXISTS admin_read_role_permissions ON public.role_permissions;
CREATE POLICY admin_manage_role_permissions ON public.role_permissions
  FOR ALL TO public
  USING ((SELECT jwt_can('admin.site.roles.permissions')));
CREATE POLICY admin_read_role_permissions ON public.role_permissions
  FOR SELECT TO public
  USING (
    (SELECT jwt_can('admin.site.roles.assignments'))
    OR (SELECT jwt_can('admin.site.roles.permissions'))
  );

-- user_communities (user_id, community_slug) -> community_slugs claim
DROP POLICY IF EXISTS admin_manage_user_communities ON public.user_communities;
DROP POLICY IF EXISTS user_read_own_user_communities ON public.user_communities;
CREATE POLICY admin_manage_user_communities ON public.user_communities
  FOR ALL TO public
  USING ((SELECT jwt_can('admin.users')));
CREATE POLICY user_read_own_user_communities ON public.user_communities
  FOR SELECT TO public
  USING (user_id = (SELECT auth.uid()));
-- (existing "Allow auth admin to read user_communities" policy preserved)

-- ==========================================================================
-- 3. OWNER-MANAGED -- users read/write their own rows; admin.users manages all.
-- ==========================================================================

-- user_postal_address (user_id PK). Upserted by the personal-profile form.
DROP POLICY IF EXISTS admin_manage_user_postal_address ON public.user_postal_address;
DROP POLICY IF EXISTS user_manage_own_postal_address ON public.user_postal_address;
CREATE POLICY admin_manage_user_postal_address ON public.user_postal_address
  FOR ALL TO public
  USING ((SELECT jwt_can('admin.users')));
CREATE POLICY user_manage_own_postal_address ON public.user_postal_address
  FOR ALL TO public
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- property_agent (property_id PK -> property_profile.id). Upserted/deleted by
-- the personal-profile form; ownership is via the property_ids JWT claim.
DROP POLICY IF EXISTS admin_manage_property_agent ON public.property_agent;
DROP POLICY IF EXISTS user_manage_own_property_agent ON public.property_agent;
CREATE POLICY admin_manage_property_agent ON public.property_agent
  FOR ALL TO public
  USING ((SELECT jwt_can('admin.users')));
CREATE POLICY user_manage_own_property_agent ON public.property_agent
  FOR ALL TO public
  USING (property_id = ANY ((SELECT jwt_property_ids())::uuid[]))
  WITH CHECK (property_id = ANY ((SELECT jwt_property_ids())::uuid[]));

-- ==========================================================================
-- 4. REFERENCE -- admin-write (address-data domain), authenticated read.
-- ==========================================================================

-- street_type_aliases / suburb_aliases: address-matching reference data.
DROP POLICY IF EXISTS admin_manage_street_type_aliases ON public.street_type_aliases;
DROP POLICY IF EXISTS authenticated_read_street_type_aliases ON public.street_type_aliases;
CREATE POLICY admin_manage_street_type_aliases ON public.street_type_aliases
  FOR ALL TO public
  USING ((SELECT jwt_can('admin.site.data.addresses')));
CREATE POLICY authenticated_read_street_type_aliases ON public.street_type_aliases
  FOR SELECT TO public
  USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS admin_manage_suburb_aliases ON public.suburb_aliases;
DROP POLICY IF EXISTS authenticated_read_suburb_aliases ON public.suburb_aliases;
CREATE POLICY admin_manage_suburb_aliases ON public.suburb_aliases
  FOR ALL TO public
  USING ((SELECT jwt_can('admin.site.data.addresses')));
CREATE POLICY authenticated_read_suburb_aliases ON public.suburb_aliases
  FOR SELECT TO public
  USING ((SELECT auth.uid()) IS NOT NULL);

-- ==========================================================================
-- 5. CACHE / NSW-SOURCE / GIS -- read-only for authenticated; written only by
--    cron / SECURITY DEFINER / service_role (which bypass RLS). No write policy.
-- ==========================================================================
DROP POLICY IF EXISTS authenticated_read_address_response ON public.address_response;
CREATE POLICY authenticated_read_address_response ON public.address_response
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS authenticated_read_coordinates_kyng ON public.coordinates_kyng;
CREATE POLICY authenticated_read_coordinates_kyng ON public.coordinates_kyng
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS authenticated_read_geojson ON public.geojson;
CREATE POLICY authenticated_read_geojson ON public.geojson
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS authenticated_read_property_result ON public.property_result;
CREATE POLICY authenticated_read_property_result ON public.property_result
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS authenticated_read_street_list ON public.street_list;
CREATE POLICY authenticated_read_street_list ON public.street_list
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS authenticated_read_project_addresspoints ON public.project_addresspoints;
CREATE POLICY authenticated_read_project_addresspoints ON public.project_addresspoints
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS authenticated_read_project_properties ON public.project_properties;
CREATE POLICY authenticated_read_project_properties ON public.project_properties
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS authenticated_read_project_proways ON public.project_proways;
CREATE POLICY authenticated_read_project_proways ON public.project_proways
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS authenticated_read_project_waypoints ON public.project_waypoints;
CREATE POLICY authenticated_read_project_waypoints ON public.project_waypoints
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS authenticated_read_property_geometry ON public.property_geometry;
CREATE POLICY authenticated_read_property_geometry ON public.property_geometry
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS authenticated_read_x_project_area ON public.x_project_area;
CREATE POLICY authenticated_read_x_project_area ON public.x_project_area
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS authenticated_read_health_status ON public.health_status;
CREATE POLICY authenticated_read_health_status ON public.health_status
  FOR SELECT TO public USING ((SELECT auth.uid()) IS NOT NULL);

-- ==========================================================================
-- 6. SECURITY LOG -- admin read only; written by service_role / definer.
-- ==========================================================================
DROP POLICY IF EXISTS admin_read_failed_login_attempts ON public.failed_login_attempts;
CREATE POLICY admin_read_failed_login_attempts ON public.failed_login_attempts
  FOR SELECT TO public
  USING ((SELECT jwt_can('admin.users')));

-- ==========================================================================
-- 7. Revoke redundant write GRANTs.
--    anon: revoke writes on all 21 (anon never writes any of them).
--    authenticated: revoke writes only where the writer is cron / definer /
--    service_role (no admin- or owner-write path runs through RLS).
--    SELECT grants are left intact so the read policies above can function.
-- ==========================================================================

-- anon -- all 21 tables
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON
  public.user_permissions, public.user_role, public.role_permissions,
  public.user_communities, public.user_postal_address, public.property_agent,
  public.street_type_aliases, public.suburb_aliases, public.failed_login_attempts,
  public.health_status, public.address_response, public.coordinates_kyng,
  public.geojson, public.property_result, public.street_list,
  public.project_addresspoints, public.project_properties, public.project_proways,
  public.project_waypoints, public.property_geometry, public.x_project_area
FROM anon;

-- authenticated -- only the cron / definer / service_role-written tables
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON
  public.failed_login_attempts, public.health_status, public.address_response,
  public.coordinates_kyng, public.geojson, public.property_result,
  public.street_list, public.project_addresspoints, public.project_properties,
  public.project_proways, public.project_waypoints, public.property_geometry,
  public.x_project_area
FROM authenticated;

COMMIT;

-- ==========================================================================
-- VERIFICATION (run after apply; expect zero rows / all-true)
-- ==========================================================================
-- -- (a) No temp_permissive policy remains:
-- SELECT tablename FROM pg_policies
--  WHERE schemaname='public' AND policyname='temp_permissive';
--
-- -- (b) Every target table still has at least one policy:
-- SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
--  WHERE n.nspname='public' AND c.relkind='r'
--    AND c.relname IN ('user_permissions','user_role','role_permissions','user_communities',
--      'user_postal_address','property_agent','street_type_aliases','suburb_aliases',
--      'failed_login_attempts','health_status','address_response','coordinates_kyng','geojson',
--      'property_result','street_list','project_addresspoints','project_properties',
--      'project_proways','project_waypoints','property_geometry','x_project_area')
--    AND NOT EXISTS (SELECT 1 FROM pg_policies p
--      WHERE p.schemaname='public' AND p.tablename=c.relname);
--
-- -- (c) anon has no write grants on the 21:
-- SELECT table_name, privilege_type FROM information_schema.role_table_grants
--  WHERE table_schema='public' AND grantee='anon'
--    AND privilege_type IN ('INSERT','UPDATE','DELETE')
--    AND table_name IN ('user_permissions','user_role','role_permissions','user_communities',
--      'user_postal_address','property_agent','street_type_aliases','suburb_aliases',
--      'failed_login_attempts','health_status','address_response','coordinates_kyng','geojson',
--      'property_result','street_list','project_addresspoints','project_properties',
--      'project_proways','project_waypoints','property_geometry','x_project_area');
--
-- -- (d) supabase_auth_admin can read user_role:
-- SELECT has_table_privilege('supabase_auth_admin','public.user_role','SELECT');
--
-- ==========================================================================
-- ROLLBACK (restores the prior blanket policy on all 21; re-opens the hole)
-- ==========================================================================
-- BEGIN;
--   -- drop the new policies (names above), then per table:
--   -- CREATE POLICY temp_permissive ON public.<table>
--   --   FOR ALL TO public USING (auth.uid() IS NOT NULL);
--   -- and re-GRANT INSERT,UPDATE,DELETE,... as needed.
-- COMMIT;
