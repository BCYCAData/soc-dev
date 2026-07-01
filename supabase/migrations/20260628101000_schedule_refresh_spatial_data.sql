-- Phase 5 (caching hardening) — G11: formalise the refresh cadence for cached
-- NSW Spatial Services geometry.
--
-- refresh_spatial_data() already retries/backs off, logs to spatial_refresh_log, and
-- stamps triggered_by = 'cron' when there is no JWT (i.e. when pg_cron runs it). Cadastre,
-- address points and proways change slowly, so a monthly full refresh is ample; it runs in
-- a low-traffic window (17:00 UTC on the 1st ≈ 03:00–04:00 AEST). Adjust or remove with:
--   SELECT cron.unschedule('refresh-spatial-data-monthly');

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Idempotent (re)schedule.
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'refresh-spatial-data-monthly') THEN
		PERFORM cron.unschedule('refresh-spatial-data-monthly');
	END IF;
END$$;

SELECT cron.schedule(
	'refresh-spatial-data-monthly',
	'0 17 1 * *',
	$$SELECT public.refresh_spatial_data(true);$$
);
