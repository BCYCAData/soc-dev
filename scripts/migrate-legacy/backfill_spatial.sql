-- Phase 3 spatial backfill (run AFTER the reference/spatial copy + the user transform).
-- Fills property_profile.community / .kyng and builds property_geometry from the new spatial
-- reference tables (project_addresspoints/waypoints/properties, community_areas, kyng_areas),
-- keyed by principaladdresssiteoid — the same lookup private.handle_new_user uses for new signups
-- (same SRID in the new schema, so no ST_Transform). Re-runnable. No PII.

begin;

-- property_profile.community (most-specific area, consistent with user_communities) + .kyng
update public.property_profile pp set
  community = (
    select c.id from public.community_areas c
    where extensions.ST_Intersects(
      (select extensions.ST_Collect(a.geom) from public.project_addresspoints a
        where a.principaladdresssiteoid = pp.principaladdresssiteoid),
      c.geom)
    order by extensions.ST_Area(c.geom) asc limit 1),
  kyng = (
    select k.id from public.kyng_areas k
    where extensions.ST_Intersects(
      (select extensions.ST_Collect(a.geom) from public.project_addresspoints a
        where a.principaladdresssiteoid = pp.principaladdresssiteoid),
      k.geom)
    limit 1)
where pp.principaladdresssiteoid > 0
  and exists (select 1 from public.project_addresspoints a where a.principaladdresssiteoid = pp.principaladdresssiteoid);

-- property_geometry: only where all three geometries exist (all NOT NULL in the target).
delete from public.property_geometry;
insert into public.property_geometry (id, principaladdresssiteoid, address_point, way_point, property)
select pp.id, pp.principaladdresssiteoid::integer,
  (select a.geom  from public.project_addresspoints a where a.principaladdresssiteoid = pp.principaladdresssiteoid limit 1),
  (select w.geom  from public.project_waypoints   w where w.principaladdresssiteoid = pp.principaladdresssiteoid limit 1),
  (select pr.geom from public.project_properties  pr where pr.principaladdresssiteoid = pp.principaladdresssiteoid limit 1)
from public.property_profile pp
where pp.principaladdresssiteoid > 0
  and exists (select 1 from public.project_addresspoints a where a.principaladdresssiteoid = pp.principaladdresssiteoid)
  and exists (select 1 from public.project_waypoints   w where w.principaladdresssiteoid = pp.principaladdresssiteoid)
  and exists (select 1 from public.project_properties  pr where pr.principaladdresssiteoid = pp.principaladdresssiteoid);

commit;
