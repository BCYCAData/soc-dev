-- KYNG boundary editor, Phase 1b — in-database fabric ingestion
-- (docs/design/kyng-boundary-editor.md, "Ingestion pipeline").
--
-- Modelled directly on extract_properties(): http_post to the same
-- NSW_Land_Parcel_Property_Theme_multiCRS FeatureServer through the http
-- extension, outSR=7844, resultOffset paging (batch 1000; MaxRecordCount 2000),
-- curl timeout + per-batch retry/backoff, temp table then swap. The fabric
-- primitives are the six coverage layers: Lot(8), Road(6), Rail(7), Water(3),
-- WaterCorridor(2), Unidentified(4) — NOT Property(12), which is the Valnet
-- aggregate extract_properties correctly uses for its own purpose.

-- Harvest one fabric layer into cadastre_fabric_src (per-layer delete + insert).
CREATE OR REPLACE FUNCTION public.extract_fabric_layer(
	p_src_layer text,
	p_layer_id int,
	rings_geometry text,
	max_retries integer DEFAULT 3,
	initial_backoff integer DEFAULT 2
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_total_count int := 0;
	v_batch_count int := 0;
	v_offset int := 0;
	v_batch_size int := 1000;
	v_retry_count int;
	v_backoff_seconds int;
BEGIN
	PERFORM http_reset_curlopt();
	PERFORM http_set_curlopt('CURLOPT_TIMEOUT_MS', '35000');

	DROP TABLE IF EXISTS tmp_fabric_src;
	CREATE TEMP TABLE tmp_fabric_src (
		src_objectid bigint,
		cadid bigint,
		lotidstring text,
		lastupdate timestamptz,
		geom geometry(MultiPolygon, 7844)
	);

	-- Pagination loop to handle API result limits
	LOOP
		v_retry_count := 0;
		v_backoff_seconds := initial_backoff;

		-- Retry loop for this batch
		LOOP
			BEGIN
				WITH fabric_query AS (
					SELECT json_array_elements(content::json -> 'features') AS feature
					FROM http_post(
						'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Land_Parcel_Property_Theme_multiCRS/FeatureServer/'
							|| p_layer_id || '/query',
						'geometry=' || urlencode('{"rings": ' || rings_geometry || '}') ||
						'&geometryType=esriGeometryPolygon&inSR=4326&spatialRel=esriSpatialRelIntersects&outSR=7844&outFields=*&f=geojson' ||
						'&resultOffset=' || v_offset ||
						'&resultRecordCount=' || v_batch_size,
						'application/x-www-form-urlencoded'
					)
					WHERE content IS NOT NULL
				),
				result_rows AS (
					SELECT
						NULLIF(COALESCE(
							feature -> 'properties' ->> 'objectid',
							feature -> 'properties' ->> 'OBJECTID',
							feature ->> 'id'
						), '')::bigint AS src_objectid,
						NULLIF(feature -> 'properties' ->> 'cadid', '')::bigint AS cadid,
						feature -> 'properties' ->> 'lotidstring' AS lotidstring,
						TO_TIMESTAMP(NULLIF(feature -> 'properties' ->> 'lastupdate', '')::numeric / 1000.0) AS lastupdate,
						ST_SetSRID(ST_Force2D(ST_Multi(ST_GeomFromGeoJSON(feature -> 'geometry'))), 7844) AS geom
					FROM fabric_query
					WHERE feature -> 'geometry' IS NOT NULL
						AND (feature ->> 'geometry') IS NOT NULL
				)
				INSERT INTO tmp_fabric_src (src_objectid, cadid, lotidstring, lastupdate, geom)
				SELECT src_objectid, cadid, lotidstring, lastupdate, geom
				FROM result_rows
				WHERE src_objectid IS NOT NULL;

				GET DIAGNOSTICS v_batch_count = ROW_COUNT;
				v_total_count := v_total_count + v_batch_count;

				RAISE NOTICE 'Fabric % batch at offset %: % records', p_src_layer, v_offset, v_batch_count;
				EXIT; -- success for this batch

			EXCEPTION WHEN OTHERS THEN
				v_retry_count := v_retry_count + 1;
				IF v_retry_count <= max_retries THEN
					RAISE NOTICE 'Fabric % retry % of % for offset % due to error: %, waiting % seconds',
						p_src_layer, v_retry_count, max_retries, v_offset, SQLERRM, v_backoff_seconds;
					PERFORM http_reset_curlopt();
					PERFORM http_set_curlopt('CURLOPT_TIMEOUT_MS', '35000');
					PERFORM pg_sleep(v_backoff_seconds);
					v_backoff_seconds := v_backoff_seconds * 2;
				ELSE
					PERFORM http_reset_curlopt();
					RAISE EXCEPTION 'Fabric % query failed after % retries at offset %: %',
						p_src_layer, max_retries, v_offset, SQLERRM;
				END IF;
			END;
		END LOOP;

		-- Exit pagination loop only when no records returned
		EXIT WHEN v_batch_count = 0;

		v_offset := v_offset + v_batch_count;
	END LOOP;

	PERFORM http_reset_curlopt();

	IF v_total_count > 0 THEN
		DELETE FROM cadastre_fabric_src WHERE src_layer = p_src_layer;
		INSERT INTO cadastre_fabric_src
			(src_layer, src_layer_id, src_objectid, cadid, lotidstring, lastupdate, geom, source_layer)
		SELECT DISTINCT ON (src_objectid)
			p_src_layer, p_layer_id, src_objectid, cadid, lotidstring, lastupdate, geom,
			'NSW_Land_Parcel_Property_Theme_multiCRS/FeatureServer/' || p_layer_id
		FROM tmp_fabric_src
		ORDER BY src_objectid, lastupdate DESC NULLS LAST;
		GET DIAGNOSTICS v_total_count = ROW_COUNT;
		RAISE NOTICE 'Inserted % % records into cadastre_fabric_src', v_total_count, p_src_layer;
	ELSE
		RAISE WARNING 'Fabric % completed successfully but no records were returned from NSW Spatial Services', p_src_layer;
	END IF;

	RETURN v_total_count;
END;
$function$;

-- Harvest all six fabric layers for the project AOI (project_area.rings_text —
-- the same AOI every other extract_* uses), logging to spatial_refresh_log.
CREATE OR REPLACE FUNCTION public.extract_cadastre_fabric(
	max_retries integer DEFAULT 3,
	initial_backoff integer DEFAULT 2
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
DECLARE
	v_rings_geometry text;
	v_start_time timestamptz;
	v_counts jsonb := '{}'::jsonb;
	v_layer record;
	v_count int;
BEGIN
	v_start_time := clock_timestamp();

	SELECT rings_text INTO v_rings_geometry FROM project_area LIMIT 1;
	IF v_rings_geometry IS NULL THEN
		RAISE EXCEPTION 'No project area found. Run refresh_spatial_data(true) first.';
	END IF;

	FOR v_layer IN
		SELECT * FROM (VALUES
			('lot', 8),
			('road', 6),
			('rail', 7),
			('water', 3),
			('water_corridor', 2),
			('unidentified', 4)
		) AS t(src_layer, layer_id)
	LOOP
		v_count := extract_fabric_layer(v_layer.src_layer, v_layer.layer_id, v_rings_geometry, max_retries, initial_backoff);
		v_counts := v_counts || jsonb_build_object(v_layer.src_layer, v_count);
	END LOOP;

	INSERT INTO spatial_refresh_log (
		started_at, completed_at, success, result, triggered_by, duration_seconds, record_counts
	)
	VALUES (
		v_start_time, clock_timestamp(), true,
		jsonb_build_object('job', 'cadastre_fabric_extract'),
		CASE WHEN current_setting('request.jwt.claims', true) IS NOT NULL THEN 'manual' ELSE 'cron' END,
		EXTRACT(EPOCH FROM (clock_timestamp() - v_start_time)),
		v_counts
	);

	RETURN jsonb_build_object('success', true, 'counts', v_counts);
EXCEPTION WHEN OTHERS THEN
	INSERT INTO spatial_refresh_log (
		started_at, completed_at, success, error_message, result, triggered_by, duration_seconds, record_counts
	)
	VALUES (
		v_start_time, clock_timestamp(), false, SQLERRM,
		jsonb_build_object('job', 'cadastre_fabric_extract'),
		CASE WHEN current_setting('request.jwt.claims', true) IS NOT NULL THEN 'manual' ELSE 'cron' END,
		EXTRACT(EPOCH FROM (clock_timestamp() - v_start_time)),
		v_counts
	);
	RAISE;
END;
$function$;

-- B4b EXECUTE hygiene: internal pipeline functions — invoked by pg_cron or
-- operators only, never by app roles.
REVOKE ALL ON FUNCTION public.extract_fabric_layer(text, int, text, integer, integer)
	FROM public, anon, authenticated;
REVOKE ALL ON FUNCTION public.extract_cadastre_fabric(integer, integer)
	FROM public, anon, authenticated;
