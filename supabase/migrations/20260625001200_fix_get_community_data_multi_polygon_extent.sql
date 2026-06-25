-- get_community_data built community_geom as one row per community_areas
-- polygon. Communities with more than one polygon (e.g. BCYCA has 2) caused the
-- scalar mapExtent subquery to throw 21000 "more than one row returned by a
-- subquery used as an expression".
--
-- Fix at the source: aggregate the community's polygons into a single
-- MultiPolygon (ST_Union dissolves boundaries, ST_Multi forces the MultiPolygon
-- type). community_geom is then exactly one row, so the ST_Contains
-- address-point joins test against the true dissolved geometry (no bounding-box
-- false positives) and community_bounds / mapExtent are single-row.
-- (Pre-existing bug, unrelated to the JWT hook / RLS work.)
CREATE OR REPLACE FUNCTION public.get_community_data(community_name text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    result jsonb;
BEGIN
    WITH community_geom AS (
        SELECT
            ST_Multi(ST_Union(ST_Transform(geom, 4326))) AS geom
        FROM community_areas
        WHERE community = community_name
    ),
    address_points AS (
        SELECT
            json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(
                    json_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(ST_Transform(pa.geom, 4326))::json,
                        'properties', json_build_object(
                            'id', pa.id,
                            'address', pa.address,
                            'suburbname', pa.suburbname
                        )
                    )
                )
            ) as address_points_geojson
        FROM project_addresspoints pa
        JOIN community_geom cg ON ST_Contains(cg.geom, ST_Transform(pa.geom, 4326))
    ),
    registered_addresspoints AS (
        SELECT
            json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(
                    json_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(ST_Transform(a.geom, 4326))::json,
                        'properties', json_build_object(
                            'addresspointtype', a.addresspointtype::text
                        )
                    )
                )
            ) AS registered_points_geojson
        FROM project_addresspoints a
        JOIN community_geom cg ON ST_Contains(cg.geom, ST_Transform(a.geom, 4326))
        WHERE a.principaladdresssiteoid IN (
            SELECT (raw_app_meta_data -> 'principaladdresssiteoid')::integer
            FROM auth.users
        )
    ),
    community_bounds AS (
        SELECT
            json_build_array(
                json_build_array(
                    ST_YMin(geom),
                    ST_XMin(geom)
                ),
                json_build_array(
                    ST_YMax(geom),
                    ST_XMax(geom)
                )
            ) as extent_bounds
        FROM community_geom
    )
    SELECT
        jsonb_build_object(
            'community', json_build_object(
                'type', 'FeatureCollection',
                'features', json_agg(
                    json_build_object(
                        'type', 'Feature',
                        'geometry', ST_AsGeoJSON(ST_Transform(ca.geom, 4326))::json,
                        'properties', json_build_object(
                            'community', ca.community,
                            'coordinator', ca.coordinator
                        )
                    )
                )
            ),
            'addressPoints', (SELECT address_points_geojson FROM address_points),
            'registeredPoints', (SELECT registered_points_geojson FROM registered_addresspoints),
            'mapExtent', (SELECT extent_bounds FROM community_bounds)
        )
    INTO result
    FROM community_areas ca
    WHERE ca.community = community_name
    GROUP BY ca.community;

    RETURN result;
END;
$function$;
