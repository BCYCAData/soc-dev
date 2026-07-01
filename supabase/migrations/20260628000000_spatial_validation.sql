-- Phase 4 — server-side spatial integrity for property data-capture.
--
-- Adds validation metadata + indexes, and three RPCs:
--   • validate_spatial_feature  — geometry validity/type/boundary/quality checks,
--     auto-fix (ST_MakeValid) + snap-to-boundary; returns issues/warnings.
--   • merge_spatial_features    — ST_Union of same-template polygon/line features.
--   • upsert_spatial_feature_geojson (hardened) — validates before insert; blocks
--     only on real errors (wrong type / invalid GeoJSON), stores validation
--     metadata, returns a structured jsonb result for UI feedback.
--
-- Strictness: "block real errors only" — wrong geometry type and unparseable
-- GeoJSON are blocking issues; out-of-boundary, too-small/short, self-intersection
-- and overlaps are non-blocking warnings (geometry is auto-corrected/snapped).
--
-- SRID note: spatial_features.geom is SRID 0 and the app round-trips degree
-- coordinates without transforms (7844≈4326 at property scale; see
-- 20260627002000_upsert_spatial_feature_geojson.sql). Stored geoms are therefore
-- relabelled 4326 (ST_SetSRID, no coordinate shift) before spatial comparison.

-- ── 1. Validation metadata + indexes ──
ALTER TABLE public.spatial_features
	ADD COLUMN IF NOT EXISTS is_valid boolean DEFAULT true,
	ADD COLUMN IF NOT EXISTS validation_notes text[] DEFAULT '{}',
	ADD COLUMN IF NOT EXISTS snapped_to_boundary boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_spatial_features_geom ON public.spatial_features USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_spatial_features_property ON public.spatial_features (property_id);
CREATE INDEX IF NOT EXISTS idx_spatial_features_validation ON public.spatial_features (property_id, is_valid);

-- ── 2. validate_spatial_feature ──
CREATE OR REPLACE FUNCTION public.validate_spatial_feature(
	p_geojson text,
	p_template_id uuid,
	p_property_id uuid,
	p_snap_tolerance double precision DEFAULT 0.5  -- metres
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
	v_geom geometry;
	v_orig geometry;
	v_property_geom geometry;
	v_issues text[] := '{}';
	v_warnings text[] := '{}';
	v_type text;
	v_category text;
	v_name text;
	v_snapped boolean := false;
	v_area double precision;
	v_length double precision;
	v_overlaps integer;
BEGIN
	SELECT geometry_type::text, category::text, name
	INTO v_type, v_category, v_name
	FROM public.feature_templates WHERE id = p_template_id;

	IF NOT FOUND THEN
		RETURN jsonb_build_object('valid', false, 'issues', ARRAY['Template not found'],
			'warnings', v_warnings, 'geometry', NULL);
	END IF;

	-- Parse GeoJSON (WGS84 from Leaflet)
	BEGIN
		v_geom := ST_SetSRID(ST_GeomFromGeoJSON(p_geojson), 4326);
	EXCEPTION WHEN OTHERS THEN
		RETURN jsonb_build_object('valid', false,
			'issues', ARRAY['Invalid GeoJSON: ' || SQLERRM], 'warnings', v_warnings, 'geometry', NULL);
	END;

	v_orig := v_geom;

	-- Auto-correct validity (warning, not blocking)
	IF NOT ST_IsValid(v_geom) THEN
		v_geom := ST_MakeValid(v_geom);
		v_warnings := array_append(v_warnings, 'Geometry was auto-corrected for validity');
	END IF;

	-- Geometry type must match template (blocking issue)
	IF (ST_GeometryType(v_geom) = 'ST_Point' AND v_type <> 'point')
		OR (ST_GeometryType(v_geom) IN ('ST_LineString', 'ST_MultiLineString') AND v_type <> 'line')
		OR (ST_GeometryType(v_geom) IN ('ST_Polygon', 'ST_MultiPolygon') AND v_type <> 'polygon') THEN
		v_issues := array_append(v_issues,
			format('Expected %s geometry for %s, got %s', v_type, v_name, ST_GeometryType(v_geom)));
	END IF;

	-- Property boundary (stored 7844 → 4326)
	SELECT ST_Transform(pg.property, 4326) INTO v_property_geom
	FROM public.property_geometry pg WHERE pg.id = p_property_id;

	IF v_property_geom IS NULL THEN
		v_warnings := array_append(v_warnings, 'Property boundary not found — skipping boundary checks');
	ELSE
		IF NOT ST_Within(v_geom, ST_Buffer(v_property_geom::geography, 10)::geometry) THEN
			v_warnings := array_append(v_warnings, 'Feature extends beyond property boundary (10m tolerance)');
		END IF;

		-- Snap to boundary (metres → approx degrees)
		v_geom := ST_Snap(v_geom, v_property_geom, p_snap_tolerance / 111320.0);
		IF NOT ST_Equals(v_geom, v_orig) THEN
			v_snapped := true;
			v_warnings := array_append(v_warnings,
				format('Geometry snapped to property boundary (%.1fm tolerance)', p_snap_tolerance));
		END IF;
	END IF;

	-- Quality checks (warnings under block-real-errors-only)
	IF v_type = 'polygon' THEN
		IF NOT ST_IsSimple(v_geom) THEN
			v_warnings := array_append(v_warnings, 'Polygon has self-intersections');
		END IF;
		v_area := ST_Area(v_geom::geography);
		IF v_area < 1 THEN
			v_warnings := array_append(v_warnings, format('Very small polygon (%.2f m²)', v_area));
		ELSIF v_area > 1000000 THEN
			v_warnings := array_append(v_warnings, format('Very large polygon (%.0f m²)', v_area));
		END IF;
	ELSIF v_type = 'line' THEN
		v_length := ST_Length(v_geom::geography);
		IF v_length < 1 THEN
			v_warnings := array_append(v_warnings, format('Very short line (%.2f m)', v_length));
		END IF;
	END IF;

	-- Overlap warning for hazard polygons/lines
	IF v_type IN ('polygon', 'line') AND v_category = 'hazard' THEN
		SELECT count(*) INTO v_overlaps
		FROM public.spatial_features sf
		WHERE sf.template_id = p_template_id
			AND sf.property_id = p_property_id
			AND ST_Overlaps(ST_SetSRID(sf.geom, 4326), v_geom);
		IF v_overlaps > 0 THEN
			v_warnings := array_append(v_warnings,
				format('Overlaps %s existing %s feature(s)', v_overlaps, v_name));
		END IF;
	END IF;

	RETURN jsonb_build_object(
		'valid', array_length(v_issues, 1) IS NULL,
		'issues', COALESCE(v_issues, '{}'),
		'warnings', COALESCE(v_warnings, '{}'),
		'geometry', ST_AsGeoJSON(v_geom)::jsonb,
		'metadata', jsonb_build_object(
			'snapped', v_snapped,
			'area_m2', v_area,
			'length_m', v_length
		)
	);
END;
$$;

-- ── 3. merge_spatial_features ──
CREATE OR REPLACE FUNCTION public.merge_spatial_features(
	p_feature_ids uuid[],
	p_user_id uuid,
	p_property_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
	v_count integer;
	v_template_count integer;
	v_template_id uuid;
	v_type text;
	v_merged geometry;
	v_new_id uuid;
	v_attrs jsonb;
BEGIN
	IF array_length(p_feature_ids, 1) IS NULL OR array_length(p_feature_ids, 1) < 2 THEN
		RETURN jsonb_build_object('success', false, 'error', 'Select at least 2 features to merge');
	END IF;

	SELECT count(*), count(DISTINCT template_id), max(template_id)
	INTO v_count, v_template_count, v_template_id
	FROM public.spatial_features
	WHERE id = ANY(p_feature_ids) AND user_id = p_user_id AND property_id = p_property_id;

	IF v_count <> array_length(p_feature_ids, 1) THEN
		RETURN jsonb_build_object('success', false, 'error', 'One or more features not found or access denied');
	END IF;
	IF v_template_count <> 1 THEN
		RETURN jsonb_build_object('success', false, 'error', 'Cannot merge features from different templates');
	END IF;

	SELECT geometry_type::text INTO v_type FROM public.feature_templates WHERE id = v_template_id;
	IF v_type NOT IN ('polygon', 'line') THEN
		RETURN jsonb_build_object('success', false, 'error', 'Can only merge polygon or line features');
	END IF;

	SELECT ST_Union(ST_SetSRID(geom, 4326)) INTO v_merged
	FROM public.spatial_features WHERE id = ANY(p_feature_ids);
	IF NOT ST_IsValid(v_merged) THEN
		v_merged := ST_MakeValid(v_merged);
	END IF;

	-- last-edited-wins attribute set
	SELECT jsonb_object_agg(field_id, value) INTO v_attrs
	FROM (
		SELECT DISTINCT ON (fa.field_id) fa.field_id, fa.value
		FROM public.feature_attributes fa
		WHERE fa.feature_id = ANY(p_feature_ids)
		ORDER BY fa.field_id, fa.last_edited DESC NULLS LAST
	) a;

	INSERT INTO public.spatial_features (id, user_id, property_id, template_id, geom, validation_notes, snapped_to_boundary)
	VALUES (uuid_generate_v4(), p_user_id, p_property_id, v_template_id, v_merged,
		ARRAY[format('Merged from %s features', array_length(p_feature_ids, 1))], false)
	RETURNING id INTO v_new_id;

	IF v_attrs IS NOT NULL THEN
		INSERT INTO public.feature_attributes (feature_id, field_id, value)
		SELECT v_new_id, key::uuid, value
		FROM jsonb_each_text(v_attrs);
	END IF;

	DELETE FROM public.spatial_features WHERE id = ANY(p_feature_ids);

	RETURN jsonb_build_object('success', true, 'feature_id', v_new_id,
		'merged_count', array_length(p_feature_ids, 1),
		'geometry', ST_AsGeoJSON(v_merged)::jsonb);
END;
$$;

-- ── 4. Hardened GeoJSON upsert (validates; structured result) ──
DROP FUNCTION IF EXISTS public.upsert_spatial_feature_geojson(uuid, uuid, uuid, uuid, jsonb);

CREATE FUNCTION public.upsert_spatial_feature_geojson(
	p_feature_id uuid,
	p_user_id uuid,
	p_property_id uuid,
	p_template_id uuid,
	p_geom jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
	v jsonb;
	v_geom geometry;
	v_fid uuid;
BEGIN
	v := public.validate_spatial_feature(p_geom::text, p_template_id, p_property_id, 0.5);

	IF NOT (v->>'valid')::boolean THEN
		RETURN jsonb_build_object('valid', false, 'issues', v->'issues', 'warnings', v->'warnings');
	END IF;

	-- Use the validated / snapped geometry returned by validation.
	v_geom := ST_SetSRID(ST_GeomFromGeoJSON((v->'geometry')::text), 4326);
	v_fid := public.upsert_spatial_feature(p_feature_id, p_user_id, p_property_id, p_template_id, v_geom);

	UPDATE public.spatial_features
	SET is_valid = true,
		validation_notes = ARRAY(SELECT jsonb_array_elements_text(v->'warnings')),
		snapped_to_boundary = COALESCE((v->'metadata'->>'snapped')::boolean, false)
	WHERE id = v_fid;

	RETURN jsonb_build_object('valid', true, 'feature_id', v_fid,
		'warnings', v->'warnings', 'metadata', v->'metadata');
END;
$$;

REVOKE ALL ON FUNCTION public.validate_spatial_feature(text, uuid, uuid, double precision) FROM public;
REVOKE ALL ON FUNCTION public.merge_spatial_features(uuid[], uuid, uuid) FROM public;
REVOKE ALL ON FUNCTION public.upsert_spatial_feature_geojson(uuid, uuid, uuid, uuid, jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.validate_spatial_feature(text, uuid, uuid, double precision) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.merge_spatial_features(uuid[], uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.upsert_spatial_feature_geojson(uuid, uuid, uuid, uuid, jsonb) TO authenticated, service_role;
