-- get_addresspoints_geojson(): the /about map's data source.
-- Change: the "registered" feature set no longer joins community_areas / filters to
-- community = 'BCYCA', so the About map shows ALL registered address points across the
-- whole project (not just BCYCA). Also adds enddate = '3000-01-01' to the registered CTE
-- so it matches the allAddresspoints/bounds sets and never surfaces retired points, and
-- guards the user subquery with `raw_app_meta_data ? 'principaladdresssiteoid'`.
-- DDL only; no user data.

CREATE OR REPLACE FUNCTION public.get_addresspoints_geojson()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO '$user', 'public', 'auth', 'extensions'
AS $function$
DECLARE
    result json;
    bounds json;
    centre json;
BEGIN
    -- Calculate bounds and center for all addresspoints
    WITH extent AS (
        SELECT ST_Extent(geom) AS bbox
        FROM project_addresspoints
        WHERE enddate = '3000-01-01'
    )
    SELECT
        json_build_array(
            json_build_array(ST_YMin(bbox), ST_XMin(bbox)),
            json_build_array(ST_YMax(bbox), ST_XMax(bbox))
        ),
        json_build_array(
            ST_Y(ST_Centroid(bbox)),
            ST_X(ST_Centroid(bbox))
        )
    INTO bounds, centre
    FROM extent;

    WITH all_addresspoints AS (
        SELECT
            json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(
                    json_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(geom)::json,
                        'properties', json_build_object(
                            'id', id,
                            'addresspointoid', addresspointoid,
                            'enddate', enddate
                        )
                    )
                )
            ) AS all_addresspoints
        FROM project_addresspoints
        WHERE enddate = '3000-01-01'
    ),
    registered_addresspoints AS (
        -- All registered address points across the whole project (no community filter)
        SELECT
            json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(
                    json_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(a.geom)::json,
                        'properties', json_build_object(
                            'addresspointtype', a.addresspointtype::text
                        )
                    )
                )
            ) AS registered_addresspoints
        FROM project_addresspoints a
        WHERE a.enddate = '3000-01-01'
        AND a.principaladdresssiteoid IN (
            SELECT (raw_app_meta_data -> 'principaladdresssiteoid')::integer
            FROM auth.users
            WHERE raw_app_meta_data ? 'principaladdresssiteoid'
        )
    )
    SELECT json_build_object(
        'allAddresspoints', (SELECT all_addresspoints FROM all_addresspoints),
        'registeredAddresspoints', (SELECT registered_addresspoints FROM registered_addresspoints),
        'initialExtent', bounds,
        'centre', centre
    ) INTO result;

    RETURN result;
END;
$function$;
