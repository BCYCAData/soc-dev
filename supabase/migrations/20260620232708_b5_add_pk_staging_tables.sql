-- B5 (no_primary_key): add primary keys to the three real staging tables.
-- Verified `id` is non-null and fully distinct on each (151/151, 27/27, 27/27)
-- before applying. Idempotent guards so re-application is a no-op.
--
-- NOTE: this migration intentionally does NOT touch the six orphaned single-row
-- tables also flagged by no_primary_key (public.address_response, .coordinates_kyng,
-- .geojson, .property_result, .street_list, .user_role). Those are accidental
-- leftovers from `SELECT ... INTO <name>` run standalone in the SQL editor (column
-- names jsonb_agg/json_agg/content/role give them away) and are not referenced by
-- any function/view/app code — they should be dropped, handled separately.

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'private.load_users'::regclass and contype = 'p'
  ) then
    alter table private.load_users add constraint load_users_pkey primary key (id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.kyng_areas_candidate'::regclass and contype = 'p'
  ) then
    alter table public.kyng_areas_candidate add constraint kyng_areas_candidate_pkey primary key (id);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.kyng_areas_pre_snap_20260526'::regclass and contype = 'p'
  ) then
    alter table public.kyng_areas_pre_snap_20260526 add constraint kyng_areas_pre_snap_20260526_pkey primary key (id);
  end if;
end $$;
