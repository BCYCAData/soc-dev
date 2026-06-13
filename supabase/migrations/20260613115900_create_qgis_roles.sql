-- QGIS access group roles referenced by GRANTs throughout the baseline schema
-- dump (qgis_reader ~159 grants, qgis_admin a few). Roles are cluster-level and
-- are NOT included in a `supabase db dump --schema` export, so they must exist
-- before 20260613120001_remote_schema.sql or its GRANTs fail with
-- "role qgis_reader does not exist".
--
-- These are NOLOGIN group roles only. The actual QGIS *login* users that belong
-- to these groups (e.g. the per-person accounts in dev) carry passwords and are
-- provisioned out-of-band per environment — deliberately not committed here.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'qgis_reader') then
    create role qgis_reader nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'qgis_admin') then
    create role qgis_admin nologin;
  end if;
end
$$;
