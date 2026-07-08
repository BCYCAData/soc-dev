-- Admin "Kits Delivered" support + community_areas dedupe.
--
-- 1. get_new_users_confirmed_without_kits(): the imported legacy definition still
--    queried the old-prod monolithic `public.profile` table, which does not exist
--    in this database — the function failed at runtime. Rewritten for the
--    decomposed schema (user_profile / property_profile / property_agent via
--    user_property_profile_join) and extended to return the auth user id so the
--    admin UI can mark kits delivered. Return type changes → drop + recreate.
-- 2. set_users_kit_delivered(): records delivery by stamping the canonical
--    'kit_date' key into auth.users.raw_app_meta_data (see 20260626042302).
-- 3. community_areas: remove orphan duplicate rows (same name as a row that has
--    property references, but zero property/request references itself) and add a
--    unique index so duplicates cannot recur.

DROP FUNCTION IF EXISTS public.get_new_users_confirmed_without_kits();

CREATE FUNCTION public.get_new_users_confirmed_without_kits()
RETURNS TABLE(
    id uuid,
    email text,
    first_name text,
    family_name text,
    property_address_street text,
    property_address_suburb text,
    email_confirmed_at text,
    landline text,
    mobile text,
    unanswered text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- SECURITY DEFINER reads auth.users, so gate on the kits permission
    -- (jwt_can is exact-match: check the leaf and its parent grants).
    IF NOT (public.jwt_can('admin.users.kits') OR public.jwt_can('admin.users') OR public.jwt_can('admin')) THEN
        RAISE EXCEPTION 'Insufficient permissions' USING ERRCODE = '42501';
    END IF;

    RETURN QUERY
    WITH unkitted_users AS (
        SELECT u.id, u.email, u.email_confirmed_at
        FROM auth.users u
        WHERE u.email_confirmed_at IS NOT NULL
          AND (u.raw_app_meta_data->>'kit_date') IS NULL
          AND (u.raw_app_meta_data->>'tester') IS NULL
    )
    SELECT
        uku.id,
        uku.email::text,
        up.first_name,
        up.family_name,
        pp.property_address_street,
        pp.property_address_suburb,
        uku.email_confirmed_at::text,
        CASE WHEN pp.phone IS NULL OR btrim(pp.phone) = '' THEN 'Not Provided' ELSE pp.phone END AS landline,
        CASE WHEN up.mobile IS NULL OR btrim(up.mobile) = '' THEN 'Not Provided' ELSE up.mobile END AS mobile,
        rtrim((
            CASE WHEN up.rfs_survival_plan IS NULL THEN 'RFS Survival Plan, ' ELSE '' END ||
            CASE WHEN pp.mobile_reception IS NULL THEN 'Mobile Reception, ' ELSE '' END ||
            CASE WHEN up.fire_fighting_experience IS NULL THEN 'Fire Fighting Experience, ' ELSE '' END ||
            CASE WHEN up.fire_trauma IS NULL THEN 'Fire Trauma, ' ELSE '' END ||
            CASE WHEN up.plan_to_leave_before_fire IS NULL THEN 'Plan to Leave Before Fire, ' ELSE '' END ||
            CASE WHEN up.plan_to_leave_before_flood IS NULL THEN 'Plan to Leave Before Flood, ' ELSE '' END ||
            CASE WHEN up.residency_profile IS NULL THEN 'Residency Profile, ' ELSE '' END ||
            CASE
                WHEN pp.property_rented = true AND pa.agent_name IS NULL THEN 'Agent Name, '
                WHEN pp.property_rented = true AND (pa.agent_phone IS NULL AND pa.agent_mobile IS NULL) THEN 'Agent Phone/Mobile, '
                ELSE ''
            END ||
            CASE WHEN pp.sign_posted IS NULL THEN 'Sign Posted, ' ELSE '' END ||
            CASE WHEN pp.truck_access IS NULL THEN 'Truck Access, ' ELSE '' END ||
            CASE WHEN pp.truck_access = 4 AND pp.truck_access_other_information IS NULL THEN 'Truck Access Other Information, ' ELSE '' END ||
            CASE WHEN pp.residents0_18 = 0 AND pp.residents19_50 = 0 AND pp.residents51_70 = 0 AND pp.residents71_ = 0 THEN 'Resident Census, ' ELSE '' END ||
            CASE WHEN pp.vulnerable_residents IS NULL THEN 'Vulnerable Residents, ' ELSE '' END ||
            CASE WHEN pp.number_dogs = 0 AND pp.number_cats = 0 AND pp.number_birds = 0 AND pp.number_other_pets = 0 THEN 'Pet Census, ' ELSE '' END ||
            CASE WHEN pp.live_stock_present IS NULL THEN 'Live Stock Present, ' ELSE '' END ||
            CASE WHEN pp.live_stock_safe_area IS NULL THEN 'Live Stock Safe Area, ' ELSE '' END ||
            CASE WHEN pp.static_water_available IS NULL THEN 'Static Water, ' ELSE '' END ||
            CASE WHEN pp.have_stortz IS NULL THEN 'Have Stortz, ' ELSE '' END ||
            CASE WHEN pp.have_stortz = 'Y' AND (pp.stortz_size IS NULL OR pp.stortz_size = 0) THEN 'Stortz Size, ' ELSE '' END ||
            CASE WHEN pp.fire_hazard_reduction IS NULL THEN 'Fire Hazard Reduction, ' ELSE '' END ||
            CASE WHEN pp.fire_fighting_resources IS NULL THEN 'Fire Fighting Resources, ' ELSE '' END ||
            CASE WHEN pp.site_hazards IS NULL THEN 'Site Hazards, ' ELSE '' END
        ), ', ') AS unanswered
    FROM unkitted_users uku
    JOIN public.user_profile up ON up.id = uku.id
    LEFT JOIN public.user_property_profile_join uppj ON uppj.user_id = uku.id
    LEFT JOIN public.property_profile pp ON pp.id = uppj.property_id
    LEFT JOIN public.property_agent pa ON pa.property_id = pp.id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_new_users_confirmed_without_kits() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_new_users_confirmed_without_kits() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.set_users_kit_delivered(p_user_ids uuid[], p_kit_date date DEFAULT CURRENT_DATE)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    updated_count integer;
BEGIN
    IF NOT (public.jwt_can('admin.users.kits') OR public.jwt_can('admin.users') OR public.jwt_can('admin')) THEN
        RAISE EXCEPTION 'Insufficient permissions' USING ERRCODE = '42501';
    END IF;

    UPDATE auth.users
    SET raw_app_meta_data = jsonb_set(
            coalesce(raw_app_meta_data, '{}'::jsonb),
            '{kit_date}',
            to_jsonb(to_char(p_kit_date, 'YYYY-MM-DD'))
        )
    WHERE id = ANY(p_user_ids);

    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$;

REVOKE ALL ON FUNCTION public.set_users_kit_delivered(uuid[], date) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.set_users_kit_delivered(uuid[], date) TO authenticated, service_role;

DELETE FROM public.community_areas ca
USING public.community_areas keeper
WHERE lower(ca.community) = lower(keeper.community)
  AND ca.id <> keeper.id
  AND EXISTS (SELECT 1 FROM public.property_profile pk WHERE pk.community = keeper.id)
  AND NOT EXISTS (SELECT 1 FROM public.property_profile pp WHERE pp.community = ca.id)
  AND NOT EXISTS (SELECT 1 FROM public.community_access_requests r WHERE r.requested_community_id = ca.id);

CREATE UNIQUE INDEX IF NOT EXISTS community_areas_community_unique ON public.community_areas (lower(community));
