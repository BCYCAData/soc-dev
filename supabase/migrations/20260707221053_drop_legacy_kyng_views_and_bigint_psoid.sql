-- C1: Remove the legacy per-KYNG-area SECURITY DEFINER view stack (166 views,
-- advisor ERROR security_definer_view) plus their generator functions; convert
-- the four remaining definer views to security_invoker; widen
-- property_geometry.principaladdresssiteoid to bigint (source is bigint —
-- scripts/migrate-legacy/README.md "Known gaps").
--
-- Verified before writing: nothing outside the kyng_* view set depends on the
-- views; no function references the four converted views; the app reads KYNG
-- data via get_kyngs_geojson / get_*_properties_by_kyng_area (base tables).

-- 1. Generator functions (the only code referencing the kyng_* views).
DROP FUNCTION IF EXISTS public.create_kyngs_views();
DROP FUNCTION IF EXISTS public.create_kyng_property_fragment_views();

-- 2. Every kyng_* view (chains within the set only; CASCADE covers ordering).
DO $$
DECLARE v record;
BEGIN
  FOR v IN
    SELECT c.relname
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'v' AND c.relname LIKE 'kyng\_%'
  LOOP
    EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', v.relname);
  END LOOP;
END $$;

-- 3. Remaining SECURITY DEFINER views → caller's rights (RLS applies).
ALTER VIEW public.categorized_features SET (security_invoker = on);
ALTER VIEW public.feature_details SET (security_invoker = on);
ALTER VIEW public._kyng_edge_classification SET (security_invoker = on);
ALTER VIEW public._kyng_snap_review_cases SET (security_invoker = on);

-- 4. principaladdresssiteoid int4 → bigint on property_geometry, plus the two
--    functions whose signatures carry the old width. (RETURN TABLE/argument
--    types must match exactly or plpgsql fails at runtime.)
ALTER TABLE public.property_geometry ALTER COLUMN principaladdresssiteoid TYPE bigint;

DROP FUNCTION IF EXISTS public.get_property_geometry_for_user(uuid);
CREATE FUNCTION public.get_property_geometry_for_user(id_input uuid)
RETURNS TABLE(
    id uuid,
    principaladdresssiteoid bigint,
    address_point extensions.geometry,
    way_point extensions.geometry,
    property extensions.geometry,
    created_at timestamp with time zone,
    last_updated timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO '$user', 'public', 'extensions'
AS $$
begin
	return query select * from public.property_geometry where property_geometry.id in (select property_id from public.user_property_profile_join where user_id = id_input);
end;
$$;
REVOKE ALL ON FUNCTION public.get_property_geometry_for_user(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_property_geometry_for_user(uuid) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.create_property_for_user(uuid, integer, text, text, text, text, text);
CREATE FUNCTION public.create_property_for_user(
    user_id uuid,
    var_principaladdresssiteoid bigint,
    var_valid_address_street text,
    var_valid_address_suburb text,
    var_valid_address_postcode text,
    var_search_address_street text,
    var_search_address_suburb text
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    var_property_uuid UUID;
BEGIN
    -- Check if user already has this property
    IF NOT EXISTS (
        SELECT 1
        FROM user_property_profile_join upj
        JOIN property_profile pp ON pp.id = upj.property_id
        WHERE upj.user_id = create_property_for_user.user_id
        AND pp.principaladdresssiteoid = var_principaladdresssiteoid
    ) THEN
        IF NOT EXISTS (
            SELECT 1
            FROM property_profile
            WHERE principaladdresssiteoid = var_principaladdresssiteoid
        ) THEN
            var_property_uuid := gen_random_uuid();

            INSERT INTO property_profile (
                id,
                principaladdresssiteoid,
                property_address_street,
                property_address_suburb,
                property_address_postcode
            )
            VALUES (
                var_property_uuid,
                var_principaladdresssiteoid,
                var_valid_address_street,
                var_valid_address_suburb,
                var_valid_address_postcode
            );

            INSERT INTO property_geometry (
                id,
                principaladdresssiteoid,
                address_point,
                way_point,
                property
            )
            VALUES (
                var_property_uuid,
                var_principaladdresssiteoid,
                (SELECT geom FROM project_addresspoints WHERE principaladdresssiteoid = var_principaladdresssiteoid),
                (SELECT geom FROM project_waypoints WHERE principaladdresssiteoid = var_principaladdresssiteoid),
                (SELECT geom FROM project_properties WHERE principaladdresssiteoid = var_principaladdresssiteoid)
            );
        ELSE
            SELECT id INTO var_property_uuid
            FROM property_profile
            WHERE principaladdresssiteoid = var_principaladdresssiteoid;
        END IF;

        INSERT INTO user_property_profile_join (
            user_id,
            property_id,
            search_address_street,
            search_address_suburb
        )
        VALUES (
            create_property_for_user.user_id,
            var_property_uuid,
            var_search_address_street,
            var_search_address_suburb
        );
    END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.create_property_for_user(uuid, bigint, text, text, text, text, text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.create_property_for_user(uuid, bigint, text, text, text, text, text) TO authenticated, service_role;
