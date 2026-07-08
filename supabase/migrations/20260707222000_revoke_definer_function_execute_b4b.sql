-- C2 (B4b continuation): strip anon/public EXECUTE from SECURITY DEFINER
-- functions on newprod (advisor: anon_security_definer_function_executable ×97).
--
-- Anon keeps EXECUTE only on:
--   • get_addresspoint_from_address — signup address validation runs pre-auth
--   • get_addresspoints_geojson     — public about-page map
--   • has_permission / is_admin / check_admin_permission — referenced by RLS
--     policies, which run as the querying role (policies are TO public)
-- (jwt_can / jwt_property_ids / jwt_kyng_area_ids are not SECURITY DEFINER and
-- are unaffected.)
--
-- Internal pipeline/trigger/debug functions additionally lose `authenticated`
-- — they are invoked by pg_cron, triggers, or operators only. App-called RPCs
-- keep `authenticated` EXECUTE; several rely on in-function jwt_can gates
-- and/or definer-internal scoping.

-- 1. Anon/public revoke for every definer function outside the allowlist.
DO $$
DECLARE fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef
      AND has_function_privilege('anon', p.oid, 'EXECUTE')
      AND p.proname NOT IN (
        'get_addresspoint_from_address',
        'get_addresspoints_geojson',
        'has_permission',
        'is_admin',
        'check_admin_permission'
      )
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM public, anon', fn.sig);
  END LOOP;
END $$;

-- 2. Internal-only functions: nothing app-facing calls these as a signed-in
--    user; pg_cron/triggers/definer-internal calls run as the function owner.
DO $$
DECLARE fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'read_secret',
        'extract_addresspoints','extract_properties','extract_properties_singlepart',
        'extract_proways','extract_waypoints',
        'refresh_spatial_data','regenerate_project_area','make_kyng_address_points',
        'get_address_point_extract','build_parcel_polygon',
        'cleanup_orphaned_attributes','cleanup_orphaned_spatial_features',
        'find_orphaned_attributes','find_orphaned_spatial_features',
        'delete_unused_property_profile','delete_claim_for_email_array','delete_email_claim',
        'add_role_to_enum','debug_jwt_claims','debug_user_access',
        'trg_kyng_coordinator_role_sync','trg_user_roles_materialize','update_kyng_area_users_join',
        'sync_user_role_materialization','sync_kyng_coordinator_role',
        'log_auth_failure'
      )
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM public, anon, authenticated', fn.sig);
  END LOOP;
END $$;

-- 3. Stop future functions from inheriting anon/public EXECUTE by default.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE EXECUTE ON FUNCTIONS FROM public;
