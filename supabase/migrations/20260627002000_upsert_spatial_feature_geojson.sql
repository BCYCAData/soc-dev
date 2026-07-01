-- GeoJSON-accepting wrapper for upsert_spatial_feature (fixes G4).
--
-- The my-map save action passes a parsed GeoJSON geometry *object*, but
-- upsert_spatial_feature(p_geom geometry) expects a PostGIS geometry — that
-- binding never worked, so saving was broken. This wrapper takes the GeoJSON as
-- jsonb and converts it with ST_GeomFromGeoJSON.
--
-- SRID note: spatial_features.geom is SRID 0 and the read path
-- (get_property_geometry / get_spatial_features) emits ST_AsGeoJSON WITHOUT a
-- transform, i.e. the app round-trips degree coordinates directly (GDA2020/7844
-- and WGS84/4326 differ <2m at property scale). So we label the incoming
-- Leaflet geometry 4326 and store it as-is — a real ST_Transform here would
-- drift features off the (untransformed) property boundary. Proper 7844 storage
-- discipline (gis-mapping-strategy §4.5, G5) is deferred to a later phase.

CREATE OR REPLACE FUNCTION public.upsert_spatial_feature_geojson(
  p_feature_id uuid,
  p_user_id uuid,
  p_property_id uuid,
  p_template_id uuid,
  p_geom jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_geom geometry;
BEGIN
  IF p_geom IS NULL THEN
    RAISE EXCEPTION 'p_geom (GeoJSON geometry) is required';
  END IF;

  v_geom := ST_SetSRID(ST_GeomFromGeoJSON(p_geom::text), 4326);

  RETURN public.upsert_spatial_feature(
    p_feature_id, p_user_id, p_property_id, p_template_id, v_geom
  );
END;
$$;

REVOKE ALL ON FUNCTION public.upsert_spatial_feature_geojson(uuid, uuid, uuid, uuid, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.upsert_spatial_feature_geojson(uuid, uuid, uuid, uuid, jsonb) TO authenticated, service_role;
