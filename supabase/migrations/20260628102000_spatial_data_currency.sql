-- Phase 5 follow-up — expose the currency ("as at" date) of cached NSW Spatial Services
-- geometry for the map attribution control. NSW SS is CC BY 4.0, which requires attributing
-- "© Department of Customer Service [date of extraction]" and surfacing data currency to users.
--
-- Currency = the most recent successful wholesale refresh. We take the last successful
-- spatial_refresh_log entry, falling back to the max fetched_at stamped on the cached rows.
-- greatest() ignores NULLs, so the result is NULL only before any refresh has run.
CREATE OR REPLACE FUNCTION public.get_spatial_data_currency()
	RETURNS timestamptz
	LANGUAGE sql
	STABLE
	SECURITY DEFINER
	SET search_path = public, pg_catalog
AS $$
	SELECT greatest(
		(SELECT max(completed_at) FROM spatial_refresh_log WHERE success),
		(SELECT max(fetched_at)   FROM project_addresspoints)
	);
$$;

REVOKE ALL ON FUNCTION public.get_spatial_data_currency() FROM public;
GRANT EXECUTE ON FUNCTION public.get_spatial_data_currency() TO authenticated;

COMMENT ON FUNCTION public.get_spatial_data_currency() IS 'Currency (as-at date) of cached NSW Spatial Services geometry, for map attribution. NULL until the first successful refresh.';
