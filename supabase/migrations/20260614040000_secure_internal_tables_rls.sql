-- Security: close the RLS advisory on internal/server-only tables.
--
-- These 8 tables shipped with Row Level Security DISABLED *and* full CRUD granted to anon +
-- authenticated, so anyone holding the public anon key could read — or DELETE — them (including
-- the audit/log tables). They are never accessed by an app client directly; they are written by
-- the spatial-refresh routines / admin paths via SECURITY DEFINER functions (run as the owner) or
-- the service_role key — both of which BYPASS RLS — so enabling RLS with no policies safely
-- denies anon/authenticated while leaving server-side access intact. We also revoke the client
-- grants outright (defense in depth). If a client ever legitimately needs one of these, add a
-- targeted policy in a later migration.

do $$
declare t text;
begin
  foreach t in array array[
    'project_area',
    'project_area_log',
    'project_properties_singlepart',
    'spatial_data_audit',
    'spatial_refresh_log',
    'stg_kyng_areas_from_gpkg',
    'kyng_areas_candidate',
    'kyng_areas_pre_snap_20260526'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon, authenticated', t);
  end loop;
end
$$;
