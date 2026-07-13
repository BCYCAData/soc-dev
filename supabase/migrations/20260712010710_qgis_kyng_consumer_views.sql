-- QGIS consumer views: generic, filterable replacements for the legacy per-area
-- kyng_<area>_*_view stack (dropped in 20260707221053_drop_legacy_kyng_views_and_bigint_psoid).
--
-- Six views, one per legacy view type, each carrying kyng/kyng_id columns so external
-- QGIS documents filter with e.g. "kyng" = 'Mondrook Lane' (or drive an Atlas) instead
-- of binding to ~170 name-generated per-area views. Column contracts mirror the legacy
-- views so QGIS field mappings carry over. Membership is computed live from kyng_areas
-- (the legacy property views had the area boundary baked in as a WKB literal, so they
-- silently ignored boundary edits).
--
-- Access model: the views are owned by postgres (no security_invoker), so they read the
-- underlying reference tables with owner rights by design; they exist for the external
-- read-only role qgis_reader only. anon/authenticated are revoked below, so PostgREST
-- does not serve them. Expect 6 "security definer view" advisor notices — accepted,
-- same category as the other documented remainders.
--
-- qgis_reader is created NOLOGIN; enable it manually before use (never in a migration):
--   alter role qgis_reader login password '<strong password>';

-- 1. Area boundaries (legacy: kyng_<area>_area_view). Filter column: kyng.
create or replace view public.kyng_area_view as
select
  (row_number() over (order by ka.kyng))::integer as rowid,
  ka.id,
  ka.kyng,
  ka.added_to_project,
  ka.last_updated,
  ka.geom,
  ka.community
from public.kyng_areas ka;

-- 2. Address points inside each area (legacy: kyng_<area>_addresspoint_view).
create or replace view public.kyng_addresspoint_view as
select
  (row_number() over ())::integer as rowid,
  ka.kyng,
  ka.id as kyng_id,
  ap.addresssitename,
  ap.address,
  ap.housenumber,
  ap.principaladdresstype,
  ap.addresspointtype,
  ap.addresstype,
  ap.addressstringtype,
  ap.roadside,
  ap.deliverypointid,
  ap.contributororigin,
  ap.contributoralignment,
  ap.gnafprimarysiteid,
  ap.addresspointoid,
  ap.principaladdresssiteoid,
  ap.geom
from public.project_addresspoints ap
join public.kyng_areas ka on st_within(ap.geom, ka.geom);

-- 3. Waypoints for each area's address points (legacy: kyng_<area>_waypoint_view).
create or replace view public.kyng_waypoint_view as
select
  (row_number() over ())::integer as rowid,
  addr.kyng,
  addr.kyng_id,
  wp.id,
  wp.waypointoid,
  addr.address,
  addr.housenumber,
  wp.gurasid,
  wp.principaladdresssiteoid,
  wp.addressstringoid,
  wp.addresspointoid,
  wp.roadnameextentoid,
  wp.principaladdresstype,
  wp.contributororigin,
  wp.contributorid,
  wp.derivedby,
  wp.startdate,
  wp.lastupdate,
  wp.enddate,
  wp.geom,
  wp.refresh_date
from public.project_waypoints wp
join public.kyng_addresspoint_view addr on wp.addresspointoid = addr.addresspointoid;

-- 4. Proway lines for each area's waypoints (legacy: kyng_<area>_proway_view).
create or replace view public.kyng_proway_view as
select
  (row_number() over ())::integer as rowid,
  addr.kyng,
  addr.kyng_id,
  prow.id,
  prow.prowayoid,
  prow.gurasid,
  prow.principaladdresssiteoid,
  prow.waypointoid,
  prow.addresspointoid,
  prow.roadside,
  prow.startdate,
  prow.lastupdate,
  prow.enddate,
  prow.geom,
  prow.refresh_date
from public.project_proways prow
join public.kyng_waypoint_view addr
  on prow.addresspointoid = addr.addresspointoid
 and prow.waypointoid = addr.waypointoid;

-- 5. Properties whose point-on-surface falls in each area (legacy: kyng_<area>_property_view).
-- crosses_boundary matches the legacy expression: >100 m2 of the property lies inside
-- OTHER kyng areas after removing this area.
create or replace view public.kyng_property_view as
with unique_gurasid as (
  select distinct on (pp.gurasid)
    pp.gurasid,
    pp.address,
    pp.valnetpropertystatus,
    pp.valnetpropertytype,
    pp.geom
  from public.project_properties pp
  where pp.principaladdresstype = 'Primary'
),
others as materialized (
  select ka.id, st_union(o.geom) as geom
  from public.kyng_areas ka
  join public.kyng_areas o on o.id <> ka.id
  group by ka.id
),
alternate_aggr as (
  select pp.gurasid,
         string_agg(distinct pp.address, E'\n' order by pp.address) as alternate_addresses
  from public.project_properties pp
  where pp.principaladdresstype = 'Alternate'
  group by pp.gurasid
),
secondary_aggr as (
  select pp.gurasid,
         string_agg(distinct pp.address, E'\n' order by pp.address) as secondary_addresses
  from public.project_properties pp
  where pp.principaladdresstype = 'Secondary'
  group by pp.gurasid
)
select
  (row_number() over ())::integer as rowid,
  ka.kyng,
  ka.id as kyng_id,
  ug.gurasid,
  ug.address,
  count(ug.address) over (partition by ka.id, ug.address) as address_count,
  ug.valnetpropertystatus,
  ug.valnetpropertytype,
  'Primary'::text as principaladdresstype,
  coalesce(aa.alternate_addresses, ''::text) as alternate_addresses,
  coalesce(sa.secondary_addresses, ''::text) as secondary_addresses,
  ug.geom,
  (st_area((st_intersection(st_difference(ug.geom, ka.geom), oth.geom))::geography)
     > (100)::double precision) as crosses_boundary
from unique_gurasid ug
join public.kyng_areas ka on st_covers(ka.geom, st_pointonsurface(ug.geom))
left join others oth on oth.id = ka.id
left join alternate_aggr aa using (gurasid)
left join secondary_aggr sa using (gurasid);

-- 6. Fragments of multipart properties lying in an area whose parent property belongs
-- to a different area (legacy: kyng_<area>_property_fragment_view).
create or replace view public.kyng_property_fragment_view as
with primary_props as (
  select distinct on (pp.gurasid)
    pp.gurasid,
    pp.address as primary_address,
    pp.valnetpropertystatus,
    pp.valnetpropertytype,
    pp.geom
  from public.project_properties pp
  where pp.principaladdresstype = 'Primary'
),
parts as (
  select
    pp.gurasid,
    pp.primary_address,
    pp.valnetpropertystatus,
    pp.valnetpropertytype,
    (st_dump(pp.geom)).geom as part_geom
  from primary_props pp
),
parent_kyng_for_property as (
  select pp.gurasid, ka.kyng as parent_kyng
  from primary_props pp
  left join public.kyng_areas ka on st_covers(ka.geom, st_pointonsurface(pp.geom))
),
secondary_aggr as (
  select pp.gurasid,
         string_agg(distinct pp.address, E'\n' order by pp.address) as secondary_addresses
  from public.project_properties pp
  where pp.principaladdresstype = 'Secondary'
  group by pp.gurasid
),
alternate_aggr as (
  select pp.gurasid,
         string_agg(distinct pp.address, E'\n' order by pp.address) as alternate_addresses
  from public.project_properties pp
  where pp.principaladdresstype = 'Alternate'
  group by pp.gurasid
),
collected as (
  select
    ka.id as kyng_id,
    ka.kyng,
    pt.gurasid,
    pt.primary_address,
    pt.valnetpropertystatus,
    pt.valnetpropertytype,
    st_multi(st_collect(pt.part_geom)) as geom,
    (sum(st_area(st_transform(pt.part_geom, 3577))))::integer as fragments_area_m2,
    (count(*))::integer as part_count
  from parts pt
  join public.kyng_areas ka on st_covers(ka.geom, st_pointonsurface(pt.part_geom))
  group by ka.id, ka.kyng, pt.gurasid, pt.primary_address,
           pt.valnetpropertystatus, pt.valnetpropertytype
)
select
  (row_number() over (order by c.kyng, c.gurasid))::integer as rowid,
  c.kyng,
  c.kyng_id,
  c.gurasid,
  c.part_count,
  c.primary_address as parent_primary_address,
  pk.parent_kyng,
  coalesce(sa.secondary_addresses, ''::text) as secondary_addresses,
  coalesce(aa.alternate_addresses, ''::text) as alternate_addresses,
  c.valnetpropertystatus,
  c.valnetpropertytype,
  c.fragments_area_m2,
  c.geom
from collected c
join parent_kyng_for_property pk using (gurasid)
left join secondary_aggr sa using (gurasid)
left join alternate_aggr aa using (gurasid)
where pk.parent_kyng is distinct from c.kyng;

-- Read-only role for external QGIS connections. NOLOGIN until a password is set by hand.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'qgis_reader') then
    create role qgis_reader nologin;
  end if;
end
$$;

grant usage on schema public to qgis_reader;
grant usage on schema extensions to qgis_reader;

-- Keep the views out of the API surface: Supabase default privileges grant new public
-- objects to the API roles, and these owner-rights views must not bypass RLS via PostgREST.
revoke all on public.kyng_area_view,
              public.kyng_addresspoint_view,
              public.kyng_waypoint_view,
              public.kyng_proway_view,
              public.kyng_property_view,
              public.kyng_property_fragment_view
from anon, authenticated;

grant select on public.kyng_area_view,
                public.kyng_addresspoint_view,
                public.kyng_waypoint_view,
                public.kyng_proway_view,
                public.kyng_property_view,
                public.kyng_property_fragment_view
to qgis_reader;

comment on view public.kyng_area_view is
  'QGIS consumer view (external maps). All KYNG boundaries; filter on kyng. Not exposed via API.';
comment on view public.kyng_addresspoint_view is
  'QGIS consumer view (external maps). Address points per KYNG area; filter on kyng. Not exposed via API.';
comment on view public.kyng_waypoint_view is
  'QGIS consumer view (external maps). Waypoints per KYNG area; filter on kyng. Not exposed via API.';
comment on view public.kyng_proway_view is
  'QGIS consumer view (external maps). Proway lines per KYNG area; filter on kyng. Not exposed via API.';
comment on view public.kyng_property_view is
  'QGIS consumer view (external maps). Primary properties per KYNG area with crosses_boundary flag; filter on kyng. Not exposed via API.';
comment on view public.kyng_property_fragment_view is
  'QGIS consumer view (external maps). Property fragments lying in a different KYNG than their parent property; filter on kyng. Not exposed via API.';
