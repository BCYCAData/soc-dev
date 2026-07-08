-- C5: RLS/init-plan + index performance batch.
--
-- 1. Wrap auth.uid()/auth.jwt()/auth.email()/jwt_can()/jwt_property_ids()/
--    jwt_kyng_area_ids()/check_admin_permission() calls in scalar subselects so
--    they evaluate once per statement instead of per row (advisor:
--    auth_rls_initplan ×51). Array-returning helpers get the
--    `(SELECT fn())::uuid[]` form so `= ANY (...)` keeps its array-expression
--    meaning. Purely mechanical — semantics unchanged.
CREATE FUNCTION pg_temp.wrap_calls(expr text) RETURNS text LANGUAGE sql AS $f$
  SELECT CASE WHEN expr IS NULL THEN NULL ELSE
    replace(
      replace(
        replace(
          regexp_replace(
            regexp_replace(
              replace(
                replace(
                  replace(expr, '( SELECT auth.email() AS email)', '@@EMAIL_WRAPPED@@'),
                  'auth.uid()', '( SELECT auth.uid())'),
                'auth.jwt()', '( SELECT auth.jwt())'),
              'jwt_can\(''([^'']*)''::text\)', '( SELECT jwt_can(''\1''::text))', 'g'),
            'check_admin_permission\(''([^'']*)''::text\)', '( SELECT check_admin_permission(''\1''::text))', 'g'),
          'jwt_property_ids()', '(( SELECT jwt_property_ids())::uuid[])'),
        'jwt_kyng_area_ids()', '(( SELECT jwt_kyng_area_ids())::uuid[])'),
      '@@EMAIL_WRAPPED@@', '( SELECT auth.email() AS email)')
  END;
$f$;

DO $$
DECLARE pol record; nq text; nc text; stmt text;
BEGIN
  FOR pol IN SELECT * FROM pg_policies WHERE schemaname = 'public' LOOP
    nq := pg_temp.wrap_calls(pol.qual);
    nc := pg_temp.wrap_calls(pol.with_check);
    IF nq IS DISTINCT FROM pol.qual OR nc IS DISTINCT FROM pol.with_check THEN
      stmt := format('ALTER POLICY %I ON public.%I', pol.policyname, pol.tablename);
      IF nq IS NOT NULL AND nq IS DISTINCT FROM pol.qual THEN
        stmt := stmt || format(' USING (%s)', nq);
      END IF;
      IF nc IS NOT NULL AND nc IS DISTINCT FROM pol.with_check THEN
        stmt := stmt || format(' WITH CHECK (%s)', nc);
      END IF;
      EXECUTE stmt;
    END IF;
  END LOOP;
END $$;

-- 2. Drop permissive-policy duplicates (advisor: multiple_permissive_policies).
--    Each admin_read_* SELECT policy below has a same-table admin_manage_* ALL
--    policy with an IDENTICAL qual — FOR ALL already covers SELECT, so removal
--    changes nothing.
DROP POLICY IF EXISTS "admin_read_all_requests"    ON public.community_access_requests;
DROP POLICY IF EXISTS "admin_read_bcyca_profiles"  ON public.community_bcyca_profile;
DROP POLICY IF EXISTS "admin_read_external_profiles" ON public.community_external_profile;
DROP POLICY IF EXISTS "admin_read_mondrook_profiles" ON public.community_mondrook_profile;
DROP POLICY IF EXISTS "admin_read_tinonee_profiles"  ON public.community_tinonee_profile;
DROP POLICY IF EXISTS "admin_read_attributes"      ON public.feature_attributes;
DROP POLICY IF EXISTS "admin_read_all_templates"   ON public.feature_templates;
DROP POLICY IF EXISTS "admin_read_kyng_assignments" ON public.kyng_area_users_join;
DROP POLICY IF EXISTS "admin_read_all_properties"  ON public.property_profile;
DROP POLICY IF EXISTS "admin_read_all_features"    ON public.spatial_features;
DROP POLICY IF EXISTS "admin_read_all_profiles"    ON public.user_profile;
DROP POLICY IF EXISTS "admin_read_property_joins"  ON public.user_property_profile_join;

--    Dead policies: C4 revoked SELECT on the error tables, and template_fields
--    already has public_read (true) + admin_manage, making temp_permissive
--    redundant (regular users have no business writing templates).
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.signin_errors;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.signup_errors;
DROP POLICY IF EXISTS "temp_permissive" ON public.template_fields;

-- 3. Covering indexes for the 11 unindexed foreign keys.
CREATE INDEX IF NOT EXISTS idx_address_validation_errors_user_id ON public.address_validation_errors (user_id);
CREATE INDEX IF NOT EXISTS idx_community_access_requests_community ON public.community_access_requests (requested_community_id);
CREATE INDEX IF NOT EXISTS idx_community_access_requests_user ON public.community_access_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_cro_concordance_option_id ON public.community_request_options_concordance (option_id);
CREATE INDEX IF NOT EXISTS idx_cro_lut_concordance ON public.community_request_options_lut (concordance);
CREATE INDEX IF NOT EXISTS idx_kyng_area_users_join_user ON public.kyng_area_users_join (user_id);
CREATE INDEX IF NOT EXISTS idx_kyng_area_users_join_area ON public.kyng_area_users_join (kyng_area_id);
CREATE INDEX IF NOT EXISTS idx_profile_required_question_updated_by ON public.profile_required_question (updated_by);
CREATE INDEX IF NOT EXISTS idx_property_profile_kyng ON public.property_profile (kyng);
CREATE INDEX IF NOT EXISTS idx_property_profile_community ON public.property_profile (community);
CREATE INDEX IF NOT EXISTS idx_spatial_features_user_property ON public.spatial_features (user_id, property_id);

-- 4. Duplicate indexes.
DROP INDEX IF EXISTS public.idx_spatial_features_property_id; -- identical to idx_spatial_features_property
DO $$
BEGIN
  -- user_postal_address_user_id_key duplicates the primary key on (user_id).
  ALTER TABLE public.user_postal_address DROP CONSTRAINT IF EXISTS user_postal_address_user_id_key;
EXCEPTION WHEN dependent_objects_still_exist THEN
  RAISE NOTICE 'user_postal_address_user_id_key retained: another object depends on it';
END $$;
