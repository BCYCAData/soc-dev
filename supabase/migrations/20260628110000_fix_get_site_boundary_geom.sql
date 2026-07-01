-- Fix get_site_boundary: project_area's geometry column is `geom` (SRID 7844), not the
-- legacy ogr2ogr name `wkb_geometry` (which doesn't exist in newprod) — the function 400'd
-- with "column project_area.wkb_geometry does not exist". Transform 7844 → 4326 for the client.
CREATE OR REPLACE FUNCTION public.get_site_boundary()
	RETURNS TABLE(project_geom geometry, project_boundary json)
	LANGUAGE plpgsql
	SECURITY DEFINER
	SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
BEGIN
	RETURN QUERY
		SELECT
			ST_Transform(ST_Union(geom), 4326) AS project_geom,
			ST_AsGeoJSON(ST_Transform(ST_Union(geom), 4326))::json AS project_boundary
		FROM project_area;
END
$function$;
