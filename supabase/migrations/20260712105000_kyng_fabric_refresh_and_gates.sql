-- KYNG boundary editor, Phase 5 — scheduled fabric refresh + gate hardening
-- (docs/design/kyng-boundary-editor.md, "Phased roadmap" Phase 5).
--
-- 1. build_cadastre_fabric gains an active-session guard: rebuilding the fabric
--    DELETEs cadastre_fabric, which would cascade-delete an active session's
--    candidate assignments out from under it.
-- 2. refresh_cadastre_fabric() orchestrates extract → build → backfill → QA and
--    is scheduled monthly via pg_cron, two hours after
--    refresh-spatial-data-monthly so the project AOI and address points are
--    fresh first. If an edit session is active, the refresh skips (logged) and
--    the next monthly run picks it up.
-- 3. validate_kyng_edit_session upgrades the "area left with zero fabric" case
--    from a propose-time warning to a BLOCKING issue: promoting it would leave
--    the area's stored geometry stale (a zombie boundary). Dissolving an area
--    is out of scope for this editor.
--
-- coordinates_kyng note (design §"Downstream updates"): the legacy
-- process_kyng_areas() population path is left untouched — it is keyed on area
-- NAMES and the editor never renames areas. Re-running it after a promote is a
-- manual operator decision until the legacy path is replaced.

-- 1. Rebuild guard --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.build_cadastre_fabric()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_start timestamptz := clock_timestamp();
	v_version int;
	v_src_count int;
	v_face_count int;
	v_unmatched int;
	v_old_assignments int := 0;
	v_inherited int := 0;
	v_counts jsonb;
BEGIN
	IF EXISTS (SELECT 1 FROM kyng_edit_session WHERE status IN ('draft', 'validated')) THEN
		RAISE EXCEPTION 'An active KYNG edit session exists — promote or discard it before rebuilding the fabric (a rebuild would invalidate its candidate assignments).';
	END IF;

	SELECT count(*) INTO v_src_count FROM cadastre_fabric_src;
	IF v_src_count = 0 THEN
		RAISE EXCEPTION 'cadastre_fabric_src is empty. Run extract_cadastre_fabric() first.';
	END IF;

	SELECT coalesce(max(fabric_version), 0) + 1 INTO v_version FROM cadastre_fabric;

	-- 1. Stash current assignments (geometry snapshot) so the rebuild can
	--    re-inherit them: new face → KYNG of the old face containing its
	--    point-on-surface.
	CREATE TEMP TABLE tmp_old_assignment ON COMMIT DROP AS
	SELECT a.kyng_id, f.geom_mga
	FROM kyng_fabric_assignment a
	JOIN cadastre_fabric f USING (fabric_id);
	GET DIAGNOSTICS v_old_assignments = ROW_COUNT;
	CREATE INDEX ON tmp_old_assignment USING gist (geom_mga);

	-- 2. Linework in 7856: lot boundaries verbatim (grid-snapped to 1 mm);
	--    corridor/water/unidentified boundaries additionally snapped to nearby
	--    lot linework so near-coincident shared edges fuse instead of leaving
	--    sliver faces.
	CREATE TEMP TABLE tmp_lines ON COMMIT DROP AS
	WITH src_mga AS (
		SELECT id, src_layer,
			ST_SnapToGrid(ST_Boundary(ST_Transform(ST_MakeValid(geom), 7856)), 0.001) AS line
		FROM cadastre_fabric_src
	),
	lot_lines AS (
		SELECT id, line FROM src_mga WHERE src_layer = 'lot'
	),
	snapped_others AS (
		SELECT o.id,
			CASE WHEN ref.lines IS NULL THEN o.line
			     ELSE ST_Snap(o.line, ref.lines, 0.1)
			END AS line
		FROM src_mga o
		LEFT JOIN LATERAL (
			SELECT ST_Collect(l.line) AS lines
			FROM lot_lines l
			WHERE l.line && ST_Expand(o.line, 1.0)
		) ref ON true
		WHERE o.src_layer <> 'lot'
	)
	SELECT line FROM lot_lines
	UNION ALL
	SELECT line FROM snapped_others;

	-- 3. Node + polygonize into candidate faces.
	CREATE TEMP TABLE tmp_faces ON COMMIT DROP AS
	SELECT (ST_Dump(ST_Polygonize(noded.g))).geom AS geom_mga
	FROM (
		SELECT ST_UnaryUnion(ST_Collect(line)) AS g FROM tmp_lines
	) noded;

	-- 4. Attribute each face to its best source polygon (7844 containment test
	--    against the GiST-indexed source geometry).
	CREATE TEMP TABLE tmp_attributed ON COMMIT DROP AS
	SELECT
		f.geom_mga,
		ST_Transform(f.geom_mga, 7844) AS geom,
		ST_Area(f.geom_mga) AS area_m2,
		s.src_layer,
		s.src_objectid,
		s.lotidstring,
		s.cadid
	FROM (
		SELECT geom_mga, ST_Transform(ST_PointOnSurface(geom_mga), 7844) AS pos_7844
		FROM tmp_faces
	) f
	LEFT JOIN LATERAL (
		SELECT s.src_layer, s.src_objectid, s.lotidstring, s.cadid
		FROM cadastre_fabric_src s
		WHERE ST_Covers(s.geom, f.pos_7844)
		ORDER BY
			CASE s.src_layer
				WHEN 'lot' THEN 1
				WHEN 'road' THEN 2
				WHEN 'rail' THEN 3
				WHEN 'water_corridor' THEN 4
				WHEN 'water' THEN 5
				ELSE 6
			END,
			ST_Area(s.geom) ASC
		LIMIT 1
	) s ON true;

	-- 5. Swap the fabric wholesale (assignments cascade-delete; stashed in step 1).
	DELETE FROM cadastre_fabric;
	INSERT INTO cadastre_fabric
		(src_layer, src_objectid, lotidstring, cadid, geom, geom_mga, area_m2, fabric_version)
	SELECT
		coalesce(a.src_layer, 'unmatched'),
		a.src_objectid, a.lotidstring, a.cadid,
		a.geom, a.geom_mga, a.area_m2, v_version
	FROM tmp_attributed a;
	GET DIAGNOSTICS v_face_count = ROW_COUNT;

	-- 6. Re-inherit assignments from the stashed snapshot.
	INSERT INTO kyng_fabric_assignment (fabric_id, kyng_id)
	SELECT f.fabric_id, o.kyng_id
	FROM cadastre_fabric f
	JOIN LATERAL (
		SELECT o.kyng_id
		FROM tmp_old_assignment o
		WHERE ST_Covers(o.geom_mga, ST_PointOnSurface(f.geom_mga))
		LIMIT 1
	) o ON true;
	GET DIAGNOSTICS v_inherited = ROW_COUNT;

	SELECT count(*) INTO v_unmatched FROM cadastre_fabric WHERE src_layer = 'unmatched';

	SELECT jsonb_object_agg(src_layer, n) INTO v_counts
	FROM (SELECT src_layer, count(*) AS n FROM cadastre_fabric GROUP BY src_layer) t;

	INSERT INTO spatial_refresh_log (
		started_at, completed_at, success, result, triggered_by, duration_seconds, record_counts
	)
	VALUES (
		v_start, clock_timestamp(), true,
		jsonb_build_object(
			'job', 'cadastre_fabric_build',
			'fabric_version', v_version,
			'src_count', v_src_count,
			'faces', v_face_count,
			'unmatched_faces', v_unmatched,
			'assignments_before', v_old_assignments,
			'assignments_inherited', v_inherited
		),
		CASE WHEN current_setting('request.jwt.claims', true) IS NOT NULL THEN 'manual' ELSE 'cron' END,
		EXTRACT(EPOCH FROM (clock_timestamp() - v_start)),
		v_counts
	);

	RETURN jsonb_build_object(
		'success', true,
		'fabric_version', v_version,
		'faces', v_face_count,
		'faces_by_layer', v_counts,
		'unmatched_faces', v_unmatched,
		'assignments_before', v_old_assignments,
		'assignments_inherited', v_inherited
	);
END;
$function$;

-- 2. Refresh orchestrator + schedule --------------------------------------
CREATE OR REPLACE FUNCTION public.refresh_cadastre_fabric()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_start timestamptz := clock_timestamp();
	v_extract jsonb;
	v_build jsonb;
	v_backfill jsonb;
	v_qa jsonb;
BEGIN
	IF EXISTS (SELECT 1 FROM kyng_edit_session WHERE status IN ('draft', 'validated')) THEN
		INSERT INTO spatial_refresh_log (
			started_at, completed_at, success, result, triggered_by, duration_seconds
		)
		VALUES (
			v_start, clock_timestamp(), true,
			jsonb_build_object('job', 'cadastre_fabric_refresh', 'skipped', true,
				'reason', 'active edit session'),
			CASE WHEN current_setting('request.jwt.claims', true) IS NOT NULL THEN 'manual' ELSE 'cron' END,
			EXTRACT(EPOCH FROM (clock_timestamp() - v_start))
		);
		RETURN jsonb_build_object('success', true, 'skipped', true, 'reason', 'active edit session');
	END IF;

	v_extract := extract_cadastre_fabric();
	v_build := build_cadastre_fabric();
	v_backfill := backfill_kyng_fabric_assignments();
	v_qa := qa_cadastre_fabric();

	INSERT INTO spatial_refresh_log (
		started_at, completed_at, success, result, triggered_by, duration_seconds, record_counts
	)
	VALUES (
		v_start, clock_timestamp(), true,
		jsonb_build_object('job', 'cadastre_fabric_refresh', 'qa', v_qa),
		CASE WHEN current_setting('request.jwt.claims', true) IS NOT NULL THEN 'manual' ELSE 'cron' END,
		EXTRACT(EPOCH FROM (clock_timestamp() - v_start)),
		jsonb_build_object(
			'extracted', v_extract -> 'counts',
			'faces', v_build -> 'faces',
			'assignments_inherited', v_build -> 'assignments_inherited',
			'backfilled', v_backfill -> 'assigned',
			'still_unassigned', v_backfill -> 'still_unassigned'
		)
	);

	RETURN jsonb_build_object(
		'success', true,
		'extract', v_extract,
		'build', v_build,
		'backfill', v_backfill,
		'qa', v_qa
	);
EXCEPTION WHEN OTHERS THEN
	INSERT INTO spatial_refresh_log (
		started_at, completed_at, success, error_message, result, triggered_by, duration_seconds
	)
	VALUES (
		v_start, clock_timestamp(), false, SQLERRM,
		jsonb_build_object('job', 'cadastre_fabric_refresh'),
		CASE WHEN current_setting('request.jwt.claims', true) IS NOT NULL THEN 'manual' ELSE 'cron' END,
		EXTRACT(EPOCH FROM (clock_timestamp() - v_start))
	);
	RAISE;
END;
$function$;

REVOKE ALL ON FUNCTION public.refresh_cadastre_fabric() FROM public, anon, authenticated;

-- Monthly, two hours after refresh-spatial-data-monthly (17:00 UTC on the 1st)
-- so the project AOI and cached address points are refreshed first. Adjust or
-- remove with: SELECT cron.unschedule('refresh-cadastre-fabric-monthly');
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'refresh-cadastre-fabric-monthly') THEN
		PERFORM cron.unschedule('refresh-cadastre-fabric-monthly');
	END IF;
END$$;

SELECT cron.schedule(
	'refresh-cadastre-fabric-monthly',
	'0 19 1 * *',
	$$SELECT public.refresh_cadastre_fabric();$$
);

-- 3. Empty-area blocking gate ---------------------------------------------
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
	v_empty int;
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

		-- Gate 1b: no session area may end up with zero fabric — promote would
		-- leave its stored geometry stale (a zombie boundary). Dissolving an
		-- area is out of scope for this editor.
		SELECT count(*) INTO v_empty
		FROM unnest(v_session.kyng_ids) k(id)
		WHERE NOT EXISTS (
			SELECT 1 FROM kyng_fabric_assignment_candidate c
			WHERE c.session_id = p_session_id AND c.kyng_id = k.id);
		IF v_empty > 0 THEN
			v_issues := v_issues || to_jsonb(
				v_empty || ' session area(s) would end up with no fabric polygons — reassign at least one region back.');
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
