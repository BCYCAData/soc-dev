-- KYNG boundary editor, Phase 3 — session workflow RPCs
-- (docs/design/kyng-boundary-editor.md, "RPCs & authorisation" and
-- "Control-line → boundary resolution").
--
-- All functions are SECURITY DEFINER with body-first authorisation via
-- jwt_can('admin.site.data.kyng-boundaries'); B4b grants at the bottom
-- (EXECUTE to authenticated only). Coordinator-scoped editing is out of scope
-- by design — control-line edits move a border shared by two areas.
--
-- Control-line resolution: the session territory (union of the session areas'
-- ASSIGNED FABRIC, not the stored legacy geometry — so every session face lands
-- in exactly one sub-region) is noded and polygonized with the drawn lines.
-- Each sub-region's owner defaults to the KYNG holding the majority of its
-- area; the UI can override per region (p_region_assignments) — that is what
-- makes "move this chunk across the border" a deterministic one-click choice.
-- Fabric faces are then classified by which sub-region contains their
-- ST_PointOnSurface. Faces are never split: 1:1 cadastre correspondence holds.

-- Current KYNG boundaries as a light FeatureCollection (EPSG:4326) for the
-- editor's boundary layer. get_kyngs_geojson stays untouched (heavy, per-area).
CREATE OR REPLACE FUNCTION public.get_kyng_boundaries_geojson()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
BEGIN
	IF NOT jwt_can('admin.site.data.kyng-boundaries') THEN
		RAISE EXCEPTION 'Not authorised to view KYNG boundary data' USING ERRCODE = '42501';
	END IF;

	RETURN jsonb_build_object(
		'type', 'FeatureCollection',
		'features', coalesce((
			SELECT jsonb_agg(jsonb_build_object(
				'type', 'Feature',
				'properties', jsonb_build_object(
					'kyng_id', ka.id,
					'kyng', ka.kyng,
					'last_updated', ka.last_updated
				),
				'geometry', ST_AsGeoJSON(ST_Transform(ka.geom, 4326))::jsonb
			))
			FROM kyng_areas ka
		), '[]'::jsonb)
	);
END;
$function$;

-- Fabric faces intersecting a lon/lat bbox, as GeoJSON (EPSG:4326) with their
-- current assignment. p_simplify_m > 0 applies ST_SimplifyPreserveTopology in
-- metres (7856) for low zooms; capped at 50 m.
CREATE OR REPLACE FUNCTION public.get_fabric_geojson(
	p_min_lng double precision,
	p_min_lat double precision,
	p_max_lng double precision,
	p_max_lat double precision,
	p_simplify_m double precision DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_bbox geometry;
BEGIN
	IF NOT jwt_can('admin.site.data.kyng-boundaries') THEN
		RAISE EXCEPTION 'Not authorised to view KYNG boundary data' USING ERRCODE = '42501';
	END IF;

	v_bbox := ST_Transform(ST_MakeEnvelope(p_min_lng, p_min_lat, p_max_lng, p_max_lat, 4326), 7844);

	RETURN jsonb_build_object(
		'type', 'FeatureCollection',
		'features', coalesce((
			SELECT jsonb_agg(jsonb_build_object(
				'type', 'Feature',
				'properties', jsonb_build_object(
					'fabric_id', f.fabric_id,
					'src_layer', f.src_layer,
					'lotidstring', f.lotidstring,
					'area_m2', round(f.area_m2::numeric, 1),
					'kyng_id', a.kyng_id,
					'kyng', ka.kyng
				),
				'geometry', ST_AsGeoJSON(
					CASE WHEN p_simplify_m > 0
						THEN ST_Transform(
							ST_SimplifyPreserveTopology(f.geom_mga, least(p_simplify_m, 50.0)), 4326)
						ELSE ST_Transform(f.geom, 4326)
					END
				)::jsonb
			))
			FROM cadastre_fabric f
			LEFT JOIN kyng_fabric_assignment a ON a.fabric_id = f.fabric_id
			LEFT JOIN kyng_areas ka ON ka.id = a.kyng_id
			WHERE f.geom && v_bbox AND ST_Intersects(f.geom, v_bbox)
		), '[]'::jsonb)
	);
END;
$function$;

-- Start a new edit session over one or more KYNG areas. One active session at
-- a time (draft/validated) — kyng_areas_candidate holds one candidate geometry
-- per area, so concurrent sessions would fight over it.
CREATE OR REPLACE FUNCTION public.start_kyng_edit_session(p_kyng_ids uuid[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_active uuid;
	v_known int;
	v_session_id uuid;
BEGIN
	IF NOT jwt_can('admin.site.data.kyng-boundaries') THEN
		RAISE EXCEPTION 'Not authorised to reconfigure KYNG boundaries' USING ERRCODE = '42501';
	END IF;

	IF p_kyng_ids IS NULL OR array_length(p_kyng_ids, 1) IS NULL THEN
		RAISE EXCEPTION 'At least one KYNG area is required';
	END IF;

	SELECT count(*) INTO v_known FROM kyng_areas WHERE id = ANY (p_kyng_ids);
	IF v_known <> array_length(p_kyng_ids, 1) THEN
		RAISE EXCEPTION 'Unknown KYNG area id in %', p_kyng_ids;
	END IF;

	SELECT session_id INTO v_active
	FROM kyng_edit_session WHERE status IN ('draft', 'validated') LIMIT 1;
	IF v_active IS NOT NULL THEN
		RAISE EXCEPTION 'An edit session is already active (%). Promote or discard it first.', v_active;
	END IF;

	INSERT INTO kyng_edit_session (kyng_ids) VALUES (p_kyng_ids)
	RETURNING session_id INTO v_session_id;

	RETURN jsonb_build_object('session_id', v_session_id, 'kyng_ids', to_jsonb(p_kyng_ids), 'status', 'draft');
END;
$function$;

-- The active session (draft/validated), if any, so the editor can resume.
CREATE OR REPLACE FUNCTION public.get_active_kyng_edit_session()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_session kyng_edit_session%ROWTYPE;
BEGIN
	IF NOT jwt_can('admin.site.data.kyng-boundaries') THEN
		RAISE EXCEPTION 'Not authorised to view KYNG boundary data' USING ERRCODE = '42501';
	END IF;

	SELECT * INTO v_session
	FROM kyng_edit_session WHERE status IN ('draft', 'validated')
	ORDER BY created_at DESC LIMIT 1;
	IF NOT FOUND THEN
		RETURN NULL;
	END IF;

	RETURN jsonb_build_object(
		'session_id', v_session.session_id,
		'kyng_ids', to_jsonb(v_session.kyng_ids),
		'status', v_session.status,
		'control_lines', v_session.control_lines,
		'region_assignments', v_session.region_assignments,
		'validation', v_session.validation,
		'created_at', v_session.created_at,
		'updated_at', v_session.updated_at
	);
END;
$function$;

-- Resolve drawn control line(s) into candidate assignments + boundaries.
-- p_control_lines: GeoJSON FeatureCollection (or bare geometry / array of
-- geometries) of LineStrings in EPSG:4326.
-- p_region_assignments: optional [{"region": n, "kyng_id": uuid}] overrides.
CREATE OR REPLACE FUNCTION public.propose_kyng_boundary(
	p_session_id uuid,
	p_control_lines jsonb,
	p_region_assignments jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_session kyng_edit_session%ROWTYPE;
	v_lines geometry;
	v_territory geometry;
	v_noded geometry;
	v_bad_override int;
	v_regions jsonb;
	v_boundaries jsonb;
	v_moved jsonb;
	v_properties jsonb;
	v_warnings jsonb := '[]'::jsonb;
	v_unregioned int;
BEGIN
	IF NOT jwt_can('admin.site.data.kyng-boundaries') THEN
		RAISE EXCEPTION 'Not authorised to reconfigure KYNG boundaries' USING ERRCODE = '42501';
	END IF;

	SELECT * INTO v_session FROM kyng_edit_session WHERE session_id = p_session_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Unknown edit session %', p_session_id;
	END IF;
	IF v_session.status NOT IN ('draft', 'validated') THEN
		RAISE EXCEPTION 'Session % is % — start a new session', p_session_id, v_session.status;
	END IF;

	-- Parse control lines (FeatureCollection | geometry | array of geometries).
	SELECT ST_UnaryUnion(ST_Collect(g)) INTO v_lines
	FROM (
		SELECT ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON(gj::text), 4326), 7856) AS g
		FROM (
			SELECT feat -> 'geometry' AS gj
			FROM jsonb_array_elements(
				CASE WHEN jsonb_typeof(p_control_lines -> 'features') = 'array'
					THEN p_control_lines -> 'features' END) feat
			UNION ALL
			SELECT CASE WHEN p_control_lines ->> 'type' IN ('LineString', 'MultiLineString')
				THEN p_control_lines END
			UNION ALL
			SELECT elem
			FROM jsonb_array_elements(
				CASE WHEN jsonb_typeof(p_control_lines) = 'array' THEN p_control_lines END) elem
		) raw
		WHERE gj IS NOT NULL
	) parsed;

	IF v_lines IS NULL OR ST_IsEmpty(v_lines) THEN
		RAISE EXCEPTION 'No control lines supplied';
	END IF;

	-- Session territory: the union of the session areas' ASSIGNED fabric.
	SELECT ST_UnaryUnion(ST_Collect(f.geom_mga)) INTO v_territory
	FROM kyng_fabric_assignment a
	JOIN cadastre_fabric f USING (fabric_id)
	WHERE a.kyng_id = ANY (v_session.kyng_ids);
	IF v_territory IS NULL THEN
		RAISE EXCEPTION 'Session areas have no assigned fabric — run the assignment backfill first';
	END IF;

	-- Sub-regions: node the territory's rings with the lines, polygonize, keep
	-- faces inside the territory. Overdrawn line ends dangle harmlessly.
	v_noded := ST_UnaryUnion(ST_Collect(ST_Boundary(v_territory), v_lines));

	DROP TABLE IF EXISTS tmp_regions;
	CREATE TEMP TABLE tmp_regions ON COMMIT DROP AS
	SELECT
		row_number() OVER (ORDER BY ST_Area(geom) DESC, ST_X(ST_PointOnSurface(geom))) AS region,
		geom,
		NULL::uuid AS default_kyng,
		NULL::uuid AS owner_kyng
	FROM (
		SELECT (ST_Dump(ST_Polygonize(v_noded))).geom AS geom
	) faces
	WHERE ST_Covers(v_territory, ST_PointOnSurface(geom));

	IF (SELECT count(*) FROM tmp_regions) < 2 THEN
		v_warnings := v_warnings || to_jsonb(
			'The control line does not cut the session territory into multiple regions — '
			|| 'draw it across the area, past the outer boundary on both ends.');
	END IF;

	-- Default owner: majority of the region''s area under the CURRENT assignment.
	UPDATE tmp_regions r
	SET default_kyng = (
		SELECT a.kyng_id
		FROM kyng_fabric_assignment a
		JOIN cadastre_fabric f USING (fabric_id)
		WHERE a.kyng_id = ANY (v_session.kyng_ids)
			AND f.geom_mga && r.geom
			AND ST_Intersects(f.geom_mga, r.geom)
		GROUP BY a.kyng_id
		ORDER BY sum(ST_Area(ST_Intersection(f.geom_mga, r.geom))) DESC
		LIMIT 1
	);

	-- Apply overrides (must reference session areas).
	SELECT count(*) INTO v_bad_override
	FROM jsonb_array_elements(coalesce(p_region_assignments, '[]'::jsonb)) o
	WHERE NOT ((o ->> 'kyng_id')::uuid = ANY (v_session.kyng_ids));
	IF v_bad_override > 0 THEN
		RAISE EXCEPTION 'Region overrides must assign to a session KYNG area';
	END IF;

	UPDATE tmp_regions r
	SET owner_kyng = coalesce((
		SELECT (o ->> 'kyng_id')::uuid
		FROM jsonb_array_elements(coalesce(p_region_assignments, '[]'::jsonb)) o
		WHERE (o ->> 'region')::bigint = r.region
		LIMIT 1
	), r.default_kyng);

	-- Candidate assignments: classify each session face by the sub-region
	-- containing its point-on-surface; faces missing a region keep their owner.
	DELETE FROM kyng_fabric_assignment_candidate WHERE session_id = p_session_id;
	INSERT INTO kyng_fabric_assignment_candidate (session_id, fabric_id, kyng_id)
	SELECT p_session_id, f.fabric_id, coalesce(r.owner_kyng, a.kyng_id)
	FROM kyng_fabric_assignment a
	JOIN cadastre_fabric f USING (fabric_id)
	LEFT JOIN tmp_regions r
		ON r.geom && f.geom_mga AND ST_Covers(r.geom, ST_PointOnSurface(f.geom_mga))
	WHERE a.kyng_id = ANY (v_session.kyng_ids);

	SELECT count(*) INTO v_unregioned
	FROM kyng_fabric_assignment a
	JOIN cadastre_fabric f USING (fabric_id)
	LEFT JOIN tmp_regions r
		ON r.geom && f.geom_mga AND ST_Covers(r.geom, ST_PointOnSurface(f.geom_mga))
	WHERE a.kyng_id = ANY (v_session.kyng_ids) AND r.region IS NULL;
	IF v_unregioned > 0 THEN
		v_warnings := v_warnings || to_jsonb(
			v_unregioned || ' fabric polygon(s) fell outside every sub-region and keep their current area.');
	END IF;

	-- Candidate boundaries → kyng_areas_candidate (existing draft surface).
	DELETE FROM kyng_areas_candidate WHERE id = ANY (v_session.kyng_ids);
	INSERT INTO kyng_areas_candidate (id, kyng, added_to_project, last_updated, geom)
	SELECT ka.id, ka.kyng, ka.added_to_project, CURRENT_DATE, d.geom
	FROM kyng_areas ka
	JOIN (
		SELECT c.kyng_id, ST_Multi(ST_Union(f.geom)) AS geom
		FROM kyng_fabric_assignment_candidate c
		JOIN cadastre_fabric f USING (fabric_id)
		WHERE c.session_id = p_session_id
		GROUP BY c.kyng_id
	) d ON d.kyng_id = ka.id;

	-- Areas left with no fabric at all would silently vanish — warn.
	IF EXISTS (
		SELECT 1 FROM unnest(v_session.kyng_ids) k(id)
		WHERE NOT EXISTS (
			SELECT 1 FROM kyng_fabric_assignment_candidate c
			WHERE c.session_id = p_session_id AND c.kyng_id = k.id)
	) THEN
		v_warnings := v_warnings || to_jsonb(
			'At least one session area would end up with NO fabric polygons — it would disappear.'::text);
	END IF;

	-- Persist the proposal inputs on the session.
	UPDATE kyng_edit_session
	SET control_lines = p_control_lines,
		region_assignments = p_region_assignments,
		status = 'draft',
		validation = NULL,
		updated_at = now()
	WHERE session_id = p_session_id;

	-- Response payloads -----------------------------------------------------
	SELECT jsonb_build_object('type', 'FeatureCollection', 'features', coalesce(jsonb_agg(
		jsonb_build_object(
			'type', 'Feature',
			'properties', jsonb_build_object(
				'region', r.region,
				'kyng_id', r.owner_kyng,
				'default_kyng_id', r.default_kyng,
				'kyng', ka.kyng,
				'area_m2', round(ST_Area(r.geom)::numeric, 1)
			),
			'geometry', ST_AsGeoJSON(ST_Transform(ST_SetSRID(r.geom, 7856), 4326))::jsonb
		) ORDER BY r.region), '[]'::jsonb))
	INTO v_regions
	FROM tmp_regions r
	LEFT JOIN kyng_areas ka ON ka.id = r.owner_kyng;

	SELECT jsonb_build_object('type', 'FeatureCollection', 'features', coalesce(jsonb_agg(
		jsonb_build_object(
			'type', 'Feature',
			'properties', jsonb_build_object('kyng_id', kc.id, 'kyng', kc.kyng, 'candidate', true),
			'geometry', ST_AsGeoJSON(ST_Transform(kc.geom, 4326))::jsonb
		)), '[]'::jsonb))
	INTO v_boundaries
	FROM kyng_areas_candidate kc
	WHERE kc.id = ANY (v_session.kyng_ids);

	SELECT coalesce(jsonb_agg(jsonb_build_object(
		'from_kyng_id', m.from_id, 'from_kyng', kf.kyng,
		'to_kyng_id', m.to_id, 'to_kyng', kt.kyng,
		'faces', m.n, 'area_m2', round(m.area::numeric, 1))), '[]'::jsonb)
	INTO v_moved
	FROM (
		SELECT a.kyng_id AS from_id, c.kyng_id AS to_id, count(*) AS n, sum(f.area_m2) AS area
		FROM kyng_fabric_assignment_candidate c
		JOIN kyng_fabric_assignment a USING (fabric_id)
		JOIN cadastre_fabric f USING (fabric_id)
		WHERE c.session_id = p_session_id AND c.kyng_id <> a.kyng_id
		GROUP BY a.kyng_id, c.kyng_id
	) m
	JOIN kyng_areas kf ON kf.id = m.from_id
	JOIN kyng_areas kt ON kt.id = m.to_id;

	-- Properties whose containing fabric face moves area.
	SELECT coalesce(jsonb_agg(jsonb_build_object(
		'property_id', p.id,
		'address', trim(coalesce(p.property_address_street, '') || ' ' || coalesce(p.property_address_suburb, '')),
		'from_kyng', kf.kyng,
		'to_kyng', kt.kyng)), '[]'::jsonb)
	INTO v_properties
	FROM (
		SELECT DISTINCT ON (pp.id) pp.id, pp.property_address_street, pp.property_address_suburb,
			a.kyng_id AS from_id, c.kyng_id AS to_id
		FROM property_profile pp
		JOIN project_addresspoints ap ON ap.principaladdresssiteoid = pp.principaladdresssiteoid
		JOIN cadastre_fabric f ON f.geom && ap.geom AND ST_Covers(f.geom, ap.geom)
		JOIN kyng_fabric_assignment_candidate c
			ON c.session_id = p_session_id AND c.fabric_id = f.fabric_id
		JOIN kyng_fabric_assignment a ON a.fabric_id = f.fabric_id
		WHERE c.kyng_id <> a.kyng_id
		ORDER BY pp.id
	) p
	JOIN kyng_areas kf ON kf.id = p.from_id
	JOIN kyng_areas kt ON kt.id = p.to_id;

	DROP TABLE IF EXISTS tmp_regions;

	RETURN jsonb_build_object(
		'session_id', p_session_id,
		'regions', v_regions,
		'boundaries', v_boundaries,
		'moved', v_moved,
		'properties_moved', v_properties,
		'warnings', v_warnings
	);
END;
$function$;

-- Validation gates. Sets status = 'validated' when no blocking issues.
CREATE OR REPLACE FUNCTION public.validate_kyng_edit_session(p_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_session kyng_edit_session%ROWTYPE;
	v_issues jsonb := '[]'::jsonb;
	v_warnings jsonb := '[]'::jsonb;
	v_missing int;
	v_addr_uncovered int;
	v_prop_uncovered int;
	v_slivers int;
	v_neighbour record;
	v_result jsonb;
	v_candidate_union geometry;
	v_candidate_union_7844 geometry;
BEGIN
	IF NOT jwt_can('admin.site.data.kyng-boundaries') THEN
		RAISE EXCEPTION 'Not authorised to reconfigure KYNG boundaries' USING ERRCODE = '42501';
	END IF;

	SELECT * INTO v_session FROM kyng_edit_session WHERE session_id = p_session_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Unknown edit session %', p_session_id;
	END IF;
	IF v_session.status NOT IN ('draft', 'validated') THEN
		RAISE EXCEPTION 'Session % is %', p_session_id, v_session.status;
	END IF;

	IF NOT EXISTS (SELECT 1 FROM kyng_fabric_assignment_candidate WHERE session_id = p_session_id) THEN
		v_issues := v_issues || to_jsonb('No candidate assignments — propose a boundary first.'::text);
	ELSE
		-- Gate 1: coverage integrity — every face currently in a session area
		-- keeps exactly one candidate assignment (PK enforces "at most one";
		-- this is the "none lost" half — the gap check).
		SELECT count(*) INTO v_missing
		FROM kyng_fabric_assignment a
		WHERE a.kyng_id = ANY (v_session.kyng_ids)
			AND NOT EXISTS (
				SELECT 1 FROM kyng_fabric_assignment_candidate c
				WHERE c.session_id = p_session_id AND c.fabric_id = a.fabric_id);
		IF v_missing > 0 THEN
			v_issues := v_issues || to_jsonb(
				v_missing || ' fabric polygon(s) lost their assignment — coverage gap.');
		END IF;

		-- Gate 2: neighbour consistency. Structurally the candidate shares only
		-- fabric edges with other areas'' faces; report overlap against the
		-- STORED neighbour geometries (legacy until their own first promote) as
		-- a warning when material.
		SELECT ST_Union(f.geom_mga) INTO v_candidate_union
		FROM kyng_fabric_assignment_candidate c
		JOIN cadastre_fabric f USING (fabric_id)
		WHERE c.session_id = p_session_id;
		v_candidate_union_7844 := ST_Transform(v_candidate_union, 7844);

		FOR v_neighbour IN
			SELECT ka.kyng,
				ST_Area(ST_Intersection(v_candidate_union, ST_Transform(ka.geom, 7856))) AS ovl
			FROM kyng_areas ka
			WHERE NOT (ka.id = ANY (v_session.kyng_ids))
				AND ST_Intersects(ka.geom, v_candidate_union_7844)
		LOOP
			IF v_neighbour.ovl > 1000 THEN
				v_warnings := v_warnings || to_jsonb(
					'Candidate overlaps stored (legacy) boundary of ' || v_neighbour.kyng
					|| ' by ' || round(v_neighbour.ovl::numeric, 0)
					|| ' m² — expected until that area is itself re-derived from fabric.');
			END IF;
		END LOOP;

		-- Gate 3: address / property completeness within the session territory.
		SELECT count(*) INTO v_addr_uncovered
		FROM project_addresspoints ap
		WHERE ST_Intersects(ap.geom, v_candidate_union_7844)
			AND NOT EXISTS (
				SELECT 1
				FROM cadastre_fabric f
				JOIN kyng_fabric_assignment_candidate c
					ON c.session_id = p_session_id AND c.fabric_id = f.fabric_id
				WHERE f.geom && ap.geom AND ST_Covers(f.geom, ap.geom));
		IF v_addr_uncovered > 0 THEN
			v_warnings := v_warnings || to_jsonb(
				v_addr_uncovered || ' cached address point(s) in the territory sit on faces without a candidate assignment (border-edge points).');
		END IF;

		SELECT count(*) INTO v_prop_uncovered
		FROM property_profile pp
		WHERE pp.kyng = ANY (v_session.kyng_ids)
			AND NOT EXISTS (
				SELECT 1
				FROM project_addresspoints ap
				JOIN cadastre_fabric f ON f.geom && ap.geom AND ST_Covers(f.geom, ap.geom)
				JOIN kyng_fabric_assignment_candidate c
					ON c.session_id = p_session_id AND c.fabric_id = f.fabric_id
				WHERE ap.principaladdresssiteoid = pp.principaladdresssiteoid);
		IF v_prop_uncovered > 0 THEN
			v_warnings := v_warnings || to_jsonb(
				v_prop_uncovered || ' registered property profile(s) in the session areas do not resolve to a candidate face (missing/edge address point) — their kyng will be unchanged on promote.');
		END IF;

		-- Gate 4: sliver guard — candidate components under 1 m².
		SELECT count(*) INTO v_slivers
		FROM (
			SELECT (ST_Dump(ST_Multi(kc.geom))).geom AS g
			FROM kyng_areas_candidate kc
			WHERE kc.id = ANY (v_session.kyng_ids)
		) parts
		WHERE ST_Area(ST_Transform(parts.g, 7856)) < 1.0;
		IF v_slivers > 0 THEN
			v_warnings := v_warnings || to_jsonb(
				v_slivers || ' candidate boundary component(s) under 1 m² — data-quality slivers.');
		END IF;
	END IF;

	v_result := jsonb_build_object(
		'valid', jsonb_array_length(v_issues) = 0,
		'issues', v_issues,
		'warnings', v_warnings,
		'checked_at', now()
	);

	UPDATE kyng_edit_session
	SET status = CASE WHEN jsonb_array_length(v_issues) = 0 THEN 'validated' ELSE 'draft' END,
		validation = v_result,
		updated_at = now()
	WHERE session_id = p_session_id;

	RETURN v_result;
END;
$function$;

-- Promote: single transaction — assignments, kyng_areas geometry, and
-- property_profile.kyng recompute for affected properties.
CREATE OR REPLACE FUNCTION public.promote_kyng_edit_session(p_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_session kyng_edit_session%ROWTYPE;
	v_start timestamptz := clock_timestamp();
	v_assignments int;
	v_areas int;
	v_properties int;
BEGIN
	IF NOT jwt_can('admin.site.data.kyng-boundaries') THEN
		RAISE EXCEPTION 'Not authorised to reconfigure KYNG boundaries' USING ERRCODE = '42501';
	END IF;

	SELECT * INTO v_session FROM kyng_edit_session WHERE session_id = p_session_id FOR UPDATE;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Unknown edit session %', p_session_id;
	END IF;
	IF v_session.status <> 'validated' THEN
		RAISE EXCEPTION 'Session % must be validated before promote (currently %)',
			p_session_id, v_session.status;
	END IF;

	-- 1. Assignments become canonical.
	INSERT INTO kyng_fabric_assignment (fabric_id, kyng_id, assigned_by, edit_session_id)
	SELECT c.fabric_id, c.kyng_id, auth.uid(), p_session_id
	FROM kyng_fabric_assignment_candidate c
	WHERE c.session_id = p_session_id
	ON CONFLICT (fabric_id) DO UPDATE
	SET kyng_id = EXCLUDED.kyng_id,
		assigned_at = now(),
		assigned_by = EXCLUDED.assigned_by,
		edit_session_id = EXCLUDED.edit_session_id
	WHERE kyng_fabric_assignment.kyng_id IS DISTINCT FROM EXCLUDED.kyng_id;
	GET DIAGNOSTICS v_assignments = ROW_COUNT;

	-- 2. Re-derive the session areas'' boundaries from their assigned fabric.
	UPDATE kyng_areas ka
	SET geom = d.geom, last_updated = CURRENT_DATE
	FROM (
		SELECT a.kyng_id, ST_Multi(ST_Union(f.geom)) AS geom
		FROM kyng_fabric_assignment a
		JOIN cadastre_fabric f USING (fabric_id)
		WHERE a.kyng_id = ANY (v_session.kyng_ids)
		GROUP BY a.kyng_id
	) d
	WHERE ka.id = d.kyng_id;
	GET DIAGNOSTICS v_areas = ROW_COUNT;

	-- 3. Recompute property_profile.kyng for properties whose containing face
	--    is (now or previously) in a session area: address point → face →
	--    assignment. (No pre-existing function does this — assignment used to
	--    happen only at signup.)
	UPDATE property_profile pp
	SET kyng = sub.new_kyng
	FROM (
		SELECT DISTINCT ON (pp2.id) pp2.id, a.kyng_id AS new_kyng
		FROM property_profile pp2
		JOIN project_addresspoints ap ON ap.principaladdresssiteoid = pp2.principaladdresssiteoid
		JOIN cadastre_fabric f ON f.geom && ap.geom AND ST_Covers(f.geom, ap.geom)
		JOIN kyng_fabric_assignment a ON a.fabric_id = f.fabric_id
		WHERE pp2.kyng = ANY (v_session.kyng_ids) OR a.kyng_id = ANY (v_session.kyng_ids)
		ORDER BY pp2.id
	) sub
	WHERE pp.id = sub.id AND pp.kyng IS DISTINCT FROM sub.new_kyng;
	GET DIAGNOSTICS v_properties = ROW_COUNT;

	-- 4. Close out the session; candidate geometry is now canonical.
	DELETE FROM kyng_areas_candidate WHERE id = ANY (v_session.kyng_ids);
	UPDATE kyng_edit_session
	SET status = 'promoted', updated_at = now()
	WHERE session_id = p_session_id;

	INSERT INTO spatial_refresh_log (
		started_at, completed_at, success, result, triggered_by, duration_seconds, record_counts
	)
	VALUES (
		v_start, clock_timestamp(), true,
		jsonb_build_object('job', 'kyng_boundary_promote', 'session_id', p_session_id),
		'manual',
		EXTRACT(EPOCH FROM (clock_timestamp() - v_start)),
		jsonb_build_object(
			'assignments_changed', v_assignments,
			'areas_updated', v_areas,
			'properties_reassigned', v_properties
		)
	);

	RETURN jsonb_build_object(
		'success', true,
		'session_id', p_session_id,
		'assignments_changed', v_assignments,
		'areas_updated', v_areas,
		'properties_reassigned', v_properties
	);
END;
$function$;

-- Discard: reject the session and clear its candidates.
CREATE OR REPLACE FUNCTION public.discard_kyng_edit_session(p_session_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_session kyng_edit_session%ROWTYPE;
BEGIN
	IF NOT jwt_can('admin.site.data.kyng-boundaries') THEN
		RAISE EXCEPTION 'Not authorised to reconfigure KYNG boundaries' USING ERRCODE = '42501';
	END IF;

	SELECT * INTO v_session FROM kyng_edit_session WHERE session_id = p_session_id FOR UPDATE;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Unknown edit session %', p_session_id;
	END IF;
	IF v_session.status NOT IN ('draft', 'validated') THEN
		RAISE EXCEPTION 'Session % is already %', p_session_id, v_session.status;
	END IF;

	DELETE FROM kyng_fabric_assignment_candidate WHERE session_id = p_session_id;
	DELETE FROM kyng_areas_candidate WHERE id = ANY (v_session.kyng_ids);
	UPDATE kyng_edit_session SET status = 'rejected', updated_at = now()
	WHERE session_id = p_session_id;

	RETURN jsonb_build_object('success', true, 'session_id', p_session_id, 'status', 'rejected');
END;
$function$;

-- B4b EXECUTE hygiene: app-called RPCs — authenticated only (the jwt_can gate
-- in each body does the real authorisation).
REVOKE ALL ON FUNCTION public.get_kyng_boundaries_geojson() FROM public, anon;
REVOKE ALL ON FUNCTION public.get_fabric_geojson(double precision, double precision, double precision, double precision, double precision) FROM public, anon;
REVOKE ALL ON FUNCTION public.start_kyng_edit_session(uuid[]) FROM public, anon;
REVOKE ALL ON FUNCTION public.get_active_kyng_edit_session() FROM public, anon;
REVOKE ALL ON FUNCTION public.propose_kyng_boundary(uuid, jsonb, jsonb) FROM public, anon;
REVOKE ALL ON FUNCTION public.validate_kyng_edit_session(uuid) FROM public, anon;
REVOKE ALL ON FUNCTION public.promote_kyng_edit_session(uuid) FROM public, anon;
REVOKE ALL ON FUNCTION public.discard_kyng_edit_session(uuid) FROM public, anon;

GRANT EXECUTE ON FUNCTION public.get_kyng_boundaries_geojson() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_fabric_geojson(double precision, double precision, double precision, double precision, double precision) TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_kyng_edit_session(uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_active_kyng_edit_session() TO authenticated;
GRANT EXECUTE ON FUNCTION public.propose_kyng_boundary(uuid, jsonb, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_kyng_edit_session(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.promote_kyng_edit_session(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.discard_kyng_edit_session(uuid) TO authenticated;
