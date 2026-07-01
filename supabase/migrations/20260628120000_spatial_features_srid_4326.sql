-- G5 — enforce an explicit SRID on user-authored spatial features.
--
-- `spatial_features.geom` was an unconstrained geometry (SRID 0 typmod) even though every
-- write path stores EPSG:4326 (features are drawn in Leaflet/4326 and served back as 4326;
-- validation transforms the 7844 property boundary *to* 4326 to compare). Declaring the
-- column 4326 makes that contract explicit and enforced, and lets the `ST_SetSRID(geom,4326)`
-- relabels in the spatial RPCs become harmless no-ops.
--
-- SRID discipline (see docs/source-data-lifecycle.md): cached NSW SS *reference* geometry is
-- stored 7844 (GDA2020); *user-authored editable* features are stored 4326 (their native
-- capture CRS); cross-CRS comparisons transform at the boundary. The table is currently empty,
-- so this is a metadata/relabel change with no coordinate movement.
-- The `categorized_features` and `feature_details` views read spatial_features.geom, so they
-- must be dropped for the column type change and recreated identically (with grants restored).
DROP VIEW IF EXISTS public.categorized_features;
DROP VIEW IF EXISTS public.feature_details;

ALTER TABLE public.spatial_features
	ALTER COLUMN geom TYPE geometry(Geometry, 4326) USING ST_SetSRID(geom, 4326);

CREATE VIEW public.categorized_features AS
	SELECT sf.id,
		sf.property_id,
		sf.user_id,
		ft.category,
		ft.name AS feature_type,
		ft.geometry_type,
		sf.geom,
		sf.created_at,
		sf.last_edited
	FROM public.spatial_features sf
	JOIN public.feature_templates ft ON sf.template_id = ft.id;

CREATE VIEW public.feature_details AS
	SELECT sf.id AS feature_id,
		sf.property_id,
		sf.user_id,
		ft.category,
		ft.name AS feature_type,
		ft.geometry_type,
		jsonb_object_agg(COALESCE(tf.field_name, 'unnamed'::text), fa.value) AS attributes,
		sf.geom,
		sf.created_at,
		sf.last_edited
	FROM public.spatial_features sf
	JOIN public.feature_templates ft ON sf.template_id = ft.id
	LEFT JOIN public.feature_attributes fa ON sf.id = fa.feature_id
	LEFT JOIN public.template_fields tf ON fa.field_id = tf.id
	GROUP BY sf.id, sf.property_id, sf.user_id, ft.category, ft.name, ft.geometry_type,
		sf.geom, sf.created_at, sf.last_edited;

GRANT ALL ON public.categorized_features TO anon, authenticated, service_role;
GRANT ALL ON public.feature_details TO anon, authenticated, service_role;
