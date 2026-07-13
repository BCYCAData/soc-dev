-- KYNG boundary editor, Phase 1c — fabric build (snap/node/polygonize) + QA gate
-- (docs/design/kyng-boundary-editor.md, "Ingestion pipeline" steps 2–3).
--
-- All metric work happens in EPSG:7856 (MGA zone 56 — the whole AOI sits in
-- zone 56). Unnoded linework is the classic silent polygonize failure, so the
-- routine grid-snaps (1 mm), snaps corridor linework to nearby lot linework
-- (0.1 m — the NSW fabric is not a guaranteed coverage at source), then
-- ST_UnaryUnion (nodes + dissolves duplicates) and ST_Polygonize. Faces are
-- attributed to their best source polygon by point-on-surface containment
-- (priority lot > road > rail > water_corridor > water > unidentified, then
-- smallest source — resolves stacked strata/part-lots to the most specific lot).
--
-- Rebuild-safe: existing fabric assignments are stashed and re-inherited by
-- point-on-surface containment in the old assigned faces, so a cadastre refresh
-- never requires re-drawing boundaries (subdivided children inherit the parent's
-- KYNG). Faces with no inheritable owner stay unassigned for the Phase 2
-- backfill (from kyng_areas) or admin review.

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

-- QA gate (Phase 1 step 3): coverage integrity of the built fabric.
--   • overlap_m2   — Σ face areas minus area of their union (0 ⇔ no overlaps)
--   • gap_m2       — source-union area not covered by the face union (0 ⇔ no holes)
--   • extra_m2     — face-union area outside the source union (gap faces between
--                    parcels surface here AND as unmatched faces)
--   • sliver_faces — faces under 1 m² (data-quality warning at cadastral scale)
CREATE OR REPLACE FUNCTION public.qa_cadastre_fabric()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_src_union geometry;
	v_face_union geometry;
	v_faces int;
	v_area_sum double precision;
	v_union_area double precision;
	v_src_area double precision;
	v_gap double precision;
	v_extra double precision;
	v_slivers int;
	v_unmatched int;
	v_unmatched_area double precision;
BEGIN
	SELECT ST_Union(ST_Transform(ST_MakeValid(geom), 7856)) INTO v_src_union FROM cadastre_fabric_src;
	SELECT ST_Union(geom_mga), count(*), sum(area_m2)
	INTO v_face_union, v_faces, v_area_sum
	FROM cadastre_fabric;

	v_union_area := coalesce(ST_Area(v_face_union), 0);
	v_src_area := coalesce(ST_Area(v_src_union), 0);
	v_gap := ST_Area(ST_Difference(v_src_union, v_face_union));
	v_extra := ST_Area(ST_Difference(v_face_union, v_src_union));

	SELECT count(*) INTO v_slivers FROM cadastre_fabric WHERE area_m2 < 1.0;
	SELECT count(*), coalesce(sum(area_m2), 0) INTO v_unmatched, v_unmatched_area
	FROM cadastre_fabric WHERE src_layer = 'unmatched';

	RETURN jsonb_build_object(
		'faces', v_faces,
		'face_area_sum_m2', round(v_area_sum::numeric, 1),
		'face_union_area_m2', round(v_union_area::numeric, 1),
		'src_union_area_m2', round(v_src_area::numeric, 1),
		'overlap_m2', round((v_area_sum - v_union_area)::numeric, 3),
		'gap_m2', round(v_gap::numeric, 3),
		'extra_m2', round(v_extra::numeric, 3),
		'sliver_faces_lt_1m2', v_slivers,
		'unmatched_faces', v_unmatched,
		'unmatched_area_m2', round(v_unmatched_area::numeric, 1)
	);
END;
$function$;

-- B4b EXECUTE hygiene: internal pipeline functions.
REVOKE ALL ON FUNCTION public.build_cadastre_fabric() FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.qa_cadastre_fabric() FROM public, anon, authenticated;
