-- Standardize the kit-date claim key written by the new-user trigger: 'kitdate' -> 'kit_date'.
-- 'kit_date' is canonical (matches the 107 historical users and get_new_users_confirmed_without_kits()).
-- Only change vs the previous definition is that one json key. Pure DDL.
CREATE OR REPLACE FUNCTION private.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    var_community_uuid uuid;
    var_community text;
    var_kyng_uuid uuid;
    var_kyng text;
    var_principaladdresssiteoid integer := (new.raw_user_meta_data->'principaladdresssiteoid')::integer;
    var_community_profile_uuid uuid := gen_random_uuid();
    var_property_uuid uuid := gen_random_uuid();
    var_valid_address_street text := new.raw_user_meta_data->>'validaddressstreet';
    var_valid_address_suburb text := new.raw_user_meta_data->>'validaddresssuburb';
    var_valid_address_postcode text := new.raw_user_meta_data->>'validaddresspostcode';
    var_search_address_street text := new.raw_user_meta_data->>'searchaddressstreet';
    var_search_address_suburb text := new.raw_user_meta_data->>'searchaddresssuburb';
BEGIN
    SELECT id, community INTO var_community_uuid, var_community
    FROM public.community_areas
    WHERE extensions.ST_Intersects((SELECT extensions.ST_Collect(geom) FROM public.project_addresspoints WHERE principaladdresssiteoid = var_principaladdresssiteoid), geom);
    SELECT id, kyng INTO var_kyng_uuid, var_kyng
    FROM public.kyng_areas
    WHERE extensions.ST_Intersects((SELECT extensions.ST_Collect(geom) FROM public.project_addresspoints WHERE principaladdresssiteoid = var_principaladdresssiteoid), geom);
    CASE var_community
        WHEN 'BCYCA' THEN
            INSERT INTO public.user_profile (id, bcyca_profile_id)
            VALUES (new.id, var_community_profile_uuid);
            INSERT INTO public.community_bcyca_profile (bcyca_profile_id)
            VALUES (var_community_profile_uuid);
        WHEN 'Mondrook' THEN
            INSERT INTO public.user_profile (id, mondrook_profile_id)
            VALUES (new.id, var_community_profile_uuid);
            INSERT INTO public.community_mondrook_profile (mondrook_profile_id)
            VALUES (var_community_profile_uuid);
        WHEN 'Tinonee' THEN
            INSERT INTO public.user_profile (id, tinonee_profile_id)
            VALUES (new.id, var_community_profile_uuid);
            INSERT INTO public.community_tinonee_profile (tinonee_profile_id)
            VALUES (var_community_profile_uuid);
        WHEN 'External' THEN
            INSERT INTO public.user_profile (id, external_profile_id)
            VALUES (new.id, var_community_profile_uuid);
            INSERT INTO public.community_external_profile (external_profile_id)
            VALUES (var_community_profile_uuid);
    END CASE;
    IF NOT EXISTS (SELECT 1 FROM public.property_profile WHERE principaladdresssiteoid = var_principaladdresssiteoid) THEN
        INSERT INTO property_profile (id,
            principaladdresssiteoid, property_address_street, property_address_suburb, property_address_postcode,
            community, kyng
        )
        VALUES (
            var_property_uuid, var_principaladdresssiteoid, var_valid_address_street, var_valid_address_suburb,
            var_valid_address_postcode, var_community_uuid, var_kyng_uuid
        );
        INSERT INTO public.property_geometry (id, principaladdresssiteoid, address_point, way_point, property)
        VALUES (
            var_property_uuid, var_principaladdresssiteoid,
                (SELECT geom from public.project_addresspoints where principaladdresssiteoid = var_principaladdresssiteoid),
                (SELECT geom from public.project_waypoints where principaladdresssiteoid = var_principaladdresssiteoid),
                (SELECT geom from public.project_properties where principaladdresssiteoid = var_principaladdresssiteoid)
            );
    ELSE
        SELECT id from property_profile WHERE principaladdresssiteoid = var_principaladdresssiteoid into var_property_uuid;
    END IF;
    INSERT INTO user_property_profile_join (user_id, property_id, search_address_street, search_address_suburb)
    VALUES (new.id, var_property_uuid, var_search_address_street, var_search_address_suburb);
    UPDATE auth.users SET raw_app_meta_data =
    raw_app_meta_data ||
    json_build_object('principaladdresssiteoid', var_principaladdresssiteoid)::jsonb ||
    json_build_object('kit_date', null)::jsonb
    WHERE id = new.id;
    UPDATE auth.users SET raw_user_meta_data = null  WHERE id = new.id;

    RETURN NEW;
END;
$function$;
