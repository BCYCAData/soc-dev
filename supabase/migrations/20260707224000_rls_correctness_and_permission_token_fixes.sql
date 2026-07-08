-- C4: RLS correctness + permission-token hygiene.
--
-- 1. survey_responses had UPDATE USING(true)/CHECK(true) for authenticated —
--    any signed-in user could rewrite anyone's legacy survey row. Scope to the
--    row owner (matched by email, as the legacy import has no user_id) or an
--    admin. The app itself never writes this table.
DROP POLICY IF EXISTS "Enable UPDATE for authenticated users only" ON public.survey_responses;
CREATE POLICY "update_own_or_admin" ON public.survey_responses
  FOR UPDATE
  USING ((SELECT auth.email()) = email_address OR public.jwt_can('admin'))
  WITH CHECK ((SELECT auth.email()) = email_address OR public.jwt_can('admin'));

-- 2. signin_errors / signup_errors: the always-true anon INSERT policies are
--    intentional (pre-auth failure logging has no user context), but the roles
--    only ever INSERT — remove every other table privilege.
REVOKE SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.signin_errors, public.signup_errors
  FROM anon, authenticated;

-- 3. Internal staging/audit/pipeline tables have RLS enabled with no policies
--    (locked by design; only definer functions and operators read them).
--    Remove the PostgREST-facing grants entirely so they are not exposed at all.
REVOKE ALL ON
  public.kyng_areas_candidate,
  public.kyng_areas_pre_snap_20260526,
  public.project_area,
  public.project_area_log,
  public.project_properties_singlepart,
  public.spatial_data_audit,
  public.spatial_refresh_log,
  public.stg_kyng_areas_from_gpkg
FROM anon, authenticated;

-- 4. Permission-token hygiene: the menu/permission constant is
--    'admin.emergency.service-map' (hyphenated); replace the drifted
--    'servicemap' spelling everywhere it appears in permission bundles.
UPDATE public.role_permissions
SET permission = replace(permission, 'admin.emergency.servicemap', 'admin.emergency.service-map')
WHERE permission LIKE '%admin.emergency.servicemap%';

UPDATE public.user_permissions
SET permission = replace(permission, 'admin.emergency.servicemap', 'admin.emergency.service-map')
WHERE permission LIKE '%admin.emergency.servicemap%';
