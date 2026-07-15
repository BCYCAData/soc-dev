-- Seed the 8 legacy custom_address rows into public.custom_address.
--
-- Provenance: migrated 2026-07-15 from old prod (== legacy.custom_address, ids 2-9).
-- The enrichment columns (suburb, postcode, kyng, addresspoint_geom) were resolved
-- by keying each row's principaladdresssiteoid through the authoritative NSW SIX Maps
-- cadastral service (public.get_addresspoint_from_principaladdresssiteoid), then
-- captured here as static literals so this migration replays deterministically
-- without re-hitting the external service.
--
-- Data-owner decisions preserved verbatim (do not "correct"):
--   * community keeps the legacy labels, incl. non-canonical "Extended" (canonical
--     community_areas set is BCYCA/External/Mondrook/Tinonee) and NULL for id 9.
--   * address keeps the entered strings; ids 4 & 5 (183/185 SUNSHINE RD) both carry
--     OID 4570028, which actually resolves to 190 SUNSHINE RD (pre-existing snap).
--   * kyng is NULL for rows whose point falls outside the KYNG boundary polygons.
--
-- Idempotent: ON CONFLICT does nothing, so this is a no-op where the rows already
-- exist (e.g. newprod, where the data was applied directly, not via this migration).

set search_path = public, extensions;

insert into public.custom_address
    (id, address, community, principaladdresssiteoid, startdate, enddate,
     last_updated, createdby, suburb, postcode, kyng, addresspoint_geom)
values
  (2, '5348 THE BUCKETTS WAY BURRELL CREEK', 'BCYCA', 3078129, '2023-08-27 22:53:29.663991', NULL, '2023-08-27 22:53:29.663991', NULL, 'BURRELL CREEK', '2429', 'Bucketts Way South', 'SRID=7844;POINT(152.295012455 -31.952315787)'::geometry),
  (3, '449 NOWENDOC ROAD KILLAWARRA', 'Extended', 699586, '2023-08-27 23:03:22.273948', NULL, '2023-08-27 23:03:22.273948', NULL, 'KILLAWARRA', '2429', NULL, 'SRID=7844;POINT(152.273112412 -31.895134103)'::geometry),
  (4, '183 SUNSHINE ROAD HILLVILLE', 'BCYCA', 4570028, '2024-11-05 22:48:10.506598', NULL, '2024-11-05 22:48:10.506598', NULL, 'HILLVILLE', '2430', 'Hillville Road - Sunshine Road', 'SRID=7844;POINT(152.333396064 -31.962575627)'::geometry),
  (5, '185 SUNSHINE ROAD HILLVILLE', 'BCYCA', 4570028, '2024-11-05 22:49:04.669081', NULL, '2024-11-05 22:49:04.669081', NULL, 'HILLVILLE', '2430', 'Hillville Road - Sunshine Road', 'SRID=7844;POINT(152.333396064 -31.962575627)'::geometry),
  (6, '7061 THE BUCKETTS WAY TAREE SOUTH', 'Extended', 511525, '2024-11-15 21:23:17.169101', NULL, '2024-11-15 21:23:17.169101', NULL, 'TAREE SOUTH', '2430', 'Urray Road', 'SRID=7844;POINT(152.455634799 -31.936171596)'::geometry),
  (7, '43 DENVA ROAD TAREE SOUTH', 'Tinonee', 1078693, '2024-11-15 21:24:44.21819', NULL, '2024-11-15 21:24:44.21819', NULL, 'TAREE SOUTH', '2430', NULL, 'SRID=7844;POINT(152.442948894 -31.947676049)'::geometry),
  (8, '423 NOWENDOC ROAD KILLAWARRA', 'Extended', 321635, '2025-02-20 21:15:40.652395', NULL, '2025-02-20 21:15:40.652395', NULL, 'KILLAWARRA', '2429', NULL, 'SRID=7844;POINT(152.274885406 -31.896050535)'::geometry),
  (9, '5 FOTHERINGHAM STREET WINGHAM', NULL, 511935, '2025-02-20 21:38:34.681736', NULL, '2025-02-20 21:38:34.681736', NULL, 'WINGHAM', '2429', NULL, 'SRID=7844;POINT(152.367527564 -31.873106583)'::geometry)
on conflict (id) do nothing;

-- keep the identity sequence ahead of the restored ids
select setval('public.custom_address_id_seq',
              (select greatest(max(id), 1) from public.custom_address), true);
