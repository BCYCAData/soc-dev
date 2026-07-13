-- KYNG boundary editor, Phase 2 — assignment backfill + review surface
-- (docs/design/kyng-boundary-editor.md, "Phased roadmap" Phase 2).
--
-- Populates kyng_fabric_assignment from the current kyng_areas boundaries by
-- point-on-surface containment. Border-straddling faces (meaningful overlap
-- with ≥2 areas, or no containing area at all) are surfaced in
-- kyng_fabric_border_review — echoing the _kyng_snap_review_cases pattern from
-- the May 2026 snap exercise. qa_kyng_boundary_reproduction() confirms that
-- ST_Union of the assignments reproduces the current boundaries within
-- tolerance before the editor goes anywhere near promote.

-- Assign every currently-unassigned face to the KYNG area containing its
-- point-on-surface (largest-overlap tie-break for any overlapping areas).
-- Idempotent: only touches unassigned faces, so re-runs after a fabric refresh
-- fill inheritance gaps without disturbing reviewed assignments.
CREATE OR REPLACE FUNCTION public.backfill_kyng_fabric_assignments()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_start timestamptz := clock_timestamp();
	v_assigned int;
	v_unassigned int;
BEGIN
	INSERT INTO kyng_fabric_assignment (fabric_id, kyng_id)
	SELECT f.fabric_id, k.id
	FROM cadastre_fabric f
	LEFT JOIN kyng_fabric_assignment a ON a.fabric_id = f.fabric_id
	JOIN LATERAL (
		SELECT ka.id
		FROM kyng_areas ka
		WHERE ST_Covers(ka.geom, ST_PointOnSurface(f.geom))
		ORDER BY ST_Area(ST_Intersection(f.geom_mga, ST_Transform(ka.geom, 7856))) DESC
		LIMIT 1
	) k ON true
	WHERE a.fabric_id IS NULL;
	GET DIAGNOSTICS v_assigned = ROW_COUNT;

	SELECT count(*) INTO v_unassigned
	FROM cadastre_fabric f
	LEFT JOIN kyng_fabric_assignment a ON a.fabric_id = f.fabric_id
	WHERE a.fabric_id IS NULL;

	INSERT INTO spatial_refresh_log (
		started_at, completed_at, success, result, triggered_by, duration_seconds, record_counts
	)
	VALUES (
		v_start, clock_timestamp(), true,
		jsonb_build_object('job', 'kyng_fabric_backfill'),
		CASE WHEN current_setting('request.jwt.claims', true) IS NOT NULL THEN 'manual' ELSE 'cron' END,
		EXTRACT(EPOCH FROM (clock_timestamp() - v_start)),
		jsonb_build_object('assigned', v_assigned, 'still_unassigned', v_unassigned)
	);

	RETURN jsonb_build_object('success', true, 'assigned', v_assigned, 'still_unassigned', v_unassigned);
END;
$function$;

-- Review surface: border-straddling faces (≥2 areas each overlapping >5% of the
-- face and >25 m²) and faces with no assignment. One row per face × touching
-- area, ordered by how contested the face is. security_invoker so the fabric
-- RLS (admin.site.data.kyng-boundaries) applies to readers.
CREATE OR REPLACE VIEW public.kyng_fabric_border_review
WITH (security_invoker = true) AS
WITH face_overlaps AS (
	SELECT
		f.fabric_id, f.src_layer, f.lotidstring, f.area_m2,
		a.kyng_id AS assigned_kyng_id,
		ka.id AS kyng_id, ka.kyng,
		ST_Area(ST_Intersection(f.geom_mga, ST_Transform(ka.geom, 7856))) AS overlap_m2
	FROM public.cadastre_fabric f
	LEFT JOIN public.kyng_fabric_assignment a ON a.fabric_id = f.fabric_id
	JOIN public.kyng_areas ka ON ST_Intersects(f.geom, ka.geom)
),
flagged AS (
	SELECT fabric_id
	FROM face_overlaps
	WHERE overlap_m2 > 25 AND overlap_m2 > 0.05 * area_m2
	GROUP BY fabric_id
	HAVING count(*) >= 2
)
SELECT
	o.fabric_id,
	o.src_layer,
	o.lotidstring,
	round(o.area_m2::numeric, 1) AS area_m2,
	o.assigned_kyng_id,
	(o.kyng_id = o.assigned_kyng_id) AS is_assigned_area,
	o.kyng_id,
	o.kyng,
	round(o.overlap_m2::numeric, 1) AS overlap_m2,
	round((100 * o.overlap_m2 / nullif(o.area_m2, 0))::numeric, 1) AS overlap_pct
FROM face_overlaps o
WHERE o.fabric_id IN (SELECT fabric_id FROM flagged)
	OR o.assigned_kyng_id IS NULL
ORDER BY o.fabric_id, o.overlap_m2 DESC;

COMMENT ON VIEW public.kyng_fabric_border_review IS
	'Fabric faces straddling KYNG borders (or unassigned) under the current assignment — the review queue for boundary-edit sessions and cadastre refreshes.';

-- Reproduction check: per area, how far the union of assigned faces diverges
-- from the stored kyng_areas boundary (areas in 7856 m²).
CREATE OR REPLACE FUNCTION public.qa_kyng_boundary_reproduction()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_areas jsonb;
	v_unassigned int;
BEGIN
	SELECT jsonb_agg(
		jsonb_build_object(
			'kyng', t.kyng,
			'kyng_id', t.id,
			'faces', t.faces,
			'stored_area_m2', round(t.stored_area::numeric, 1),
			'derived_area_m2', round(t.derived_area::numeric, 1),
			'sym_diff_m2', round(t.sym_diff::numeric, 1),
			'sym_diff_pct', round((100 * t.sym_diff / nullif(t.stored_area, 0))::numeric, 2)
		)
		ORDER BY t.sym_diff DESC
	)
	INTO v_areas
	FROM (
		SELECT
			ka.kyng, ka.id,
			count(f.fabric_id) AS faces,
			ST_Area(ST_Transform(ka.geom, 7856)) AS stored_area,
			coalesce(ST_Area(ST_Union(f.geom_mga)), 0) AS derived_area,
			CASE WHEN count(f.fabric_id) = 0
				THEN ST_Area(ST_Transform(ka.geom, 7856))
				ELSE ST_Area(ST_SymDifference(ST_Transform(ka.geom, 7856), ST_Union(f.geom_mga)))
			END AS sym_diff
		FROM kyng_areas ka
		LEFT JOIN kyng_fabric_assignment a ON a.kyng_id = ka.id
		LEFT JOIN cadastre_fabric f ON f.fabric_id = a.fabric_id
		GROUP BY ka.id, ka.kyng, ka.geom
	) t;

	SELECT count(*) INTO v_unassigned
	FROM cadastre_fabric f
	LEFT JOIN kyng_fabric_assignment a ON a.fabric_id = f.fabric_id
	WHERE a.fabric_id IS NULL;

	RETURN jsonb_build_object('unassigned_faces', v_unassigned, 'areas', v_areas);
END;
$function$;

-- B4b EXECUTE hygiene: internal pipeline functions.
REVOKE ALL ON FUNCTION public.backfill_kyng_fabric_assignments() FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.qa_kyng_boundary_reproduction() FROM public, anon, authenticated;
