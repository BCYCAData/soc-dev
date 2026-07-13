# Design Plan: Interactive KYNG Area Boundary Reconfiguration

> **Status:** Implemented (Phases 0–5) — see the "As built" section at the end ·
> **Date:** 2026-07-12 (design) / 2026-07-13 (implementation)
> **Verdict:** The core architecture — the **fabric parcel-assignment model** — is valid and
> should be adopted. The original draft was an external research pass with no repo access; its
> external facts (NSW service structure, PostGIS version ceiling, licensing) held up under live
> verification, but five implementation choices contradicted infrastructure and decisions this
> project already has, and have been refitted below.
> **Companion docs:** [gis-mapping.md](./gis-mapping.md) (map engine, source-data lifecycle,
> SRID contract), [database.md](./database.md) (data model, RLS, JWT claims).

## TL;DR

- **Architecture (unchanged): fabric parcel-assignment.** Harvest a noded, gap-free cadastral
  fabric (lots + road/rail/water corridors) from the NSW Land Parcel Property Theme into
  PostGIS; treat KYNG editing as assigning each fabric polygon to exactly one KYNG. User-drawn
  control lines are resolved server-side by classifying each fabric polygon's
  `ST_PointOnSurface` side; a KYNG boundary is `ST_Union` of its assigned polygons. No
  gaps/overlaps **by construction** — adjacent KYNGs share identical fabric edges. Needs only
  PostGIS 3.3.x functions (`ST_Node`, `ST_Polygonize`, `ST_Union`, `ST_PointOnSurface`).
- **Store assignments, not frozen geometries.** Persist the fabric→KYNG mapping; re-derive
  boundary MultiPolygons on demand. Boundaries survive cadastre refreshes.
- **Implementation (refit): build on what exists.** Harvest with the project's in-database
  `extract_*`/`http`-extension pattern (already pointed at the same NSW multiCRS service), render
  and edit through the v2 `MapView` engine with **leaflet-editable + leaflet-geometryutil** (the
  settled editing stack), serve fabric as viewport-bbox GeoJSON (the AOI fabric is only ~14k
  polygons — no tile server needed), guard everything with the existing
  **`admin.site.data.kyng-boundaries`** permission token, and work exclusively in **EPSG:7856**
  for metric ops (the whole AOI sits in MGA zone 56).

## Validation register (live checks, 2026-07-12)

| #   | Original claim                                                                                                                                       | Verdict            | Verified reality (`newprod`)                                                                                                                                                                                                                                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| V1  | Supabase ships PostGIS 3.3.7; coverage functions unavailable                                                                                         | **Confirmed**      | `postgis_full_version()` → 3.3.7 on PG 17.6; no `st_coverage*` functions in the catalog. The assignment model's 3.3-only function set is the right floor.                                                                                                                                                                                                                                  |
| V2  | Bundled GEOS unknown but immaterial                                                                                                                  | **Updated**        | GEOS is **3.14.1** — already new enough for every coverage function. The limiter is purely the PostGIS extension SQL surface (3.3.7). If Supabase ever offers a PostGIS ≥ 3.4/3.6 upgrade, `ST_CoverageInvalidEdges`/`ST_CoverageClean` become available immediately as validators.                                                                                                        |
| V3  | Harvest via an external `ogr2ogr`/GDAL job                                                                                                           | **Refit**          | The project already harvests the **same** `NSW_Land_Parcel_Property_Theme_multiCRS` service **in-database**: `extract_properties()` et al. use the `http` extension with paged `resultOffset` (batch 1000), retry/backoff, `outSR=7844`, temp-table swap, `spatial_refresh_log`, monthly `pg_cron`. Extend that pattern; there is no infrastructure to run a GDAL job (Vercel + Supabase). |
| V4  | Leaflet-Geoman for drawing; MVT snapping UX                                                                                                          | **Refit**          | The repo settled the editing library (gis-mapping G3): **leaflet-editable + leaflet-geometryutil**, with a working snapping hook in [capture/snapping.ts](../../src/lib/map/capture/snapping.ts). A control line is a snapped polyline draw — no second editing library.                                                                                                                   |
| V5  | MVT tiles (Martin / pg_tileserv / VectorGrid) for "tens of thousands of parcels"                                                                     | **Refit**          | Measured against the live service for the full KYNG bounding box: Lot 10,595 + Road 3,351 + Rail 42 + Water 99 + WaterCorridor 133 + Unidentified 59 ≈ **14.3k fabric polygons total**. Viewport-bbox GeoJSON via the engine's existing live-layer pattern suffices; MVT/tile-server is a scale-triggered fallback only.                                                                   |
| V6  | Pick MGA zone 55 or 56 per AOI centroid                                                                                                              | **Simplified**     | `ST_Extent(kyng_areas.geom)` = 152.15–152.48 °E → the entire AOI is in **zone 56**. Use **EPSG:7856** everywhere; no zone-selection machinery.                                                                                                                                                                                                                                             |
| V7  | Authorise via a "coordinator/editor role" in `kyng_area_users_join`                                                                                  | **Refit**          | That table has no role column — a row _is_ a coordinatorship (`start_date`/`end_date`). Boundary reconfiguration is an **admin** task: the permission token `admin.site.data.kyng-boundaries` already exists (in the `app_data` role bundle) and the admin route `admin/site/data/kyng-boundaries` already exists (currently a read-only site-boundary map).                               |
| V8  | Reuse `kyng_areas_candidate` as the draft surface ("existing pattern")                                                                               | **Part-confirmed** | It exists (empty) but is a bare mirror of `kyng_areas` — a leftover of the 2026-05-26 snap exercise (`kyng_areas_pre_snap_20260526`, `_kyng_snap_review_cases`). Reusable for candidate _geometry_; the session + assignment tables are net-new.                                                                                                                                           |
| V9  | `kyng_areas` is SRID 7844 MultiPolygon; `get_kyngs_geojson` reads base tables                                                                        | **Confirmed**      | 27 areas, `MULTIPOLYGON`, SRID 7844; RPC present. ~915 cached properties / ~852 address points in the AOI.                                                                                                                                                                                                                                                                                 |
| V10 | NSW service facts: 13 layers, fabric = Lot(8)+Road(6)+Rail(7)+Water(3)/Corridor(2)+Unidentified(4); MaxRecordCount 2000; `extractChanges`; CC BY 4.0 | **Confirmed/kept** | Layer counts above were obtained from the live service through the DB's own `http` extension. Property (12) remains the wrong fabric primitive (it's the Valnet aggregate the existing `extract_properties` correctly uses for _its_ purpose).                                                                                                                                             |

Original architecture analysis retained: **Option A (assignment)** over PostGIS Topology
(unavailable/awkward on Supabase), pure linework/polygonize (unstable face identity across
refreshes), and freehand snap (structurally cannot guarantee a coverage). Option C's
node/polygonize routine survives as the offline fabric-_build_ step and an optional
"cut through a lot" path.

## Refined design

### Data model (migrations → `newprod`, per current practice)

- **`cadastre_fabric`** — the assembled coverage. `fabric_id bigint PK`, `src_layer text`
  (lot/road/rail/water/water_corridor/unidentified), `src_objectid bigint`, `lotidstring text`,
  `cadid int`, `geom geometry(Polygon,7844)`, `geom_mga geometry(Polygon,7856)` (populated in the
  build step — `ST_Transform` is not immutable, so not a generated column), plus the project's
  standard provenance columns (`source` default `'NSW Spatial Services'`, `source_layer`,
  `fetched_at`) per the G11 convention, and `fabric_version int`. GiST indexes on both geometry
  columns.
- **`kyng_fabric_assignment`** — the heart of the model: `fabric_id bigint FK` (**UNIQUE** —
  one KYNG per polygon → structural no-overlap), `kyng_id uuid FK → kyng_areas`, `assigned_by`,
  `assigned_at`, `edit_session_id uuid`.
- **`kyng_edit_session`** — `session_id uuid PK`, `kyng_ids uuid[]`, `status`
  (draft/validated/promoted/rejected), `created_by`, timestamps. Candidate assignments live in a
  session-scoped table (or a `session_id` column on a `kyng_fabric_assignment_candidate` twin);
  derived candidate geometry goes to the existing `kyng_areas_candidate`.

RLS on all new tables using the claim helpers per repo convention
(`jwt_can('admin.site.data.kyng-boundaries')` — see [[soc-rls-json-claim-helpers]] /
database.md), policies `TO public`.

### Ingestion pipeline (extend the `extract_*` pattern — not ogr2ogr)

1. **`extract_fabric_layer(layer_id, rings_geometry)`** modelled directly on
   `extract_properties()`: `http_post` to
   `.../NSW_Land_Parcel_Property_Theme_multiCRS/FeatureServer/{8|6|7|3|2|4}/query` with
   `outSR=7844`, `f=geojson`, `resultOffset` paging (batch ≤ 1000; service MaxRecordCount is
   2000), curl timeout + retry/backoff, temp-table then swap. AOI = buffered union of
   `kyng_areas` (or the project boundary from `get_site_boundary`).
2. **Fabric build** (in 7856): snap near-coincident vertices between lot and corridor sources
   (small tolerance), `ST_Node(ST_Collect(boundaries))`, `ST_Polygonize`, dump faces, populate
   `cadastre_fabric`. Unnoded linework is the classic silent polygonize failure — node first.
   At ~14k source polygons this is tractable in one pass with GEOS 3.14; if runtime bites,
   chunk the noding by grid cell and `SET LOCAL statement_timeout` generously inside the job.
3. **QA gate:** union-of-faces area vs AOI hull area; polygonize the difference to surface
   holes; resolve stacked strata/part-lots to the ground-level parcel.
4. **Refresh:** a monthly `pg_cron` job alongside `refresh-spatial-data-monthly`, logged to
   `spatial_refresh_log`. Incremental via `WHERE lastupdate > :since` on Lot (captures
   inserts/updates), deletes reconciled by periodic `objectid` set comparison;
   `extractChanges` only if the service exposes ChangeTracking. On refresh, child polygons of a
   subdivided lot inherit the parent's assignment (containment of the parent's
   point-on-surface, or `lotidstring` lineage), then boundaries re-union — no re-drawing.

### Control-line → boundary resolution (algorithm unchanged)

1. Client posts the drawn control line(s) (GeoJSON 4326) + the session to the propose RPC.
2. Server transforms to 7856; forms closed sub-regions by noding + polygonizing the edited
   KYNGs' outer rings with the control line; classifies each fabric polygon by which sub-region
   contains its `ST_PointOnSurface` (guaranteed interior, unlike centroid).
3. Polygons the line crosses are assigned by point-on-surface side by default; physically
   splitting a face along the line is supported but exceptional (it breaks 1:1 correspondence
   with the cadastre).
4. Candidate boundary = `ST_Multi(ST_Union(geom))` per KYNG → `kyng_areas_candidate`; the RPC
   returns proposed boundaries plus a diff (fabric polygons moved, properties reassigned,
   warnings).

### RPCs & authorisation

Repo naming convention (no `rpc_` prefix): **`start_kyng_edit_session`**,
**`propose_kyng_boundary`**, **`validate_kyng_edit_session`**, **`promote_kyng_edit_session`**,
**`discard_kyng_edit_session`**, plus a read RPC **`get_fabric_geojson(bbox, tolerance)`**
returning 4326 GeoJSON (`ST_AsGeoJSON(ST_Transform(...))`, `ST_SimplifyPreserveTopology` at low
zooms).

- `SECURITY DEFINER`, `SET search_path = public, extensions, pg_catalog` (matching the existing
  definer functions), body-first authorisation via
  `jwt_can('admin.site.data.kyng-boundaries')`.
- Follow the B4b EXECUTE-hygiene rules: `REVOKE ... FROM public`, `GRANT EXECUTE TO
authenticated`; keep helpers referenced by RLS grantable per the safe-revoke rules.
- Coordinator (`kyng_area_users_join`)-scoped editing is **out of scope**: the table carries no
  edit role, and any control-line edit necessarily touches _two_ areas' shared border, which a
  single-area coordinator shouldn't unilaterally move. If per-coordinator proposals are ever
  wanted, add them as draft sessions an admin promotes.

### Validation gates (in `validate_kyng_edit_session`)

- **Coverage integrity** — every fabric polygon in the affected extent has exactly one
  assignment (overlap is structurally impossible; this is the gap check).
- **Neighbour consistency** — no `ST_Overlaps` between candidate and adjacent canonical KYNGs;
  shared borders resolve to `ST_Touches` via shared fabric edges.
- **Address/property completeness** — every cached address point / property in the extent
  resolves to exactly one KYNG under the new assignment.
- **Sliver guard** — flag candidate components < ~1 m² (7856) as data-quality warnings
  (should be zero under the assignment model). Post-upgrade nice-to-have:
  `ST_CoverageInvalidEdges` as an automated assertion (GEOS already qualifies, see V2).

### Frontend (v2 MapView engine — no new map stack)

Extend the existing admin route
[admin/site/data/kyng-boundaries](<../../src/routes/(protected)/admin/site/data/kyng-boundaries/+page.svelte>)
(today a read-only site-boundary map; its permission token already exists).

1. **Layers:** current KYNG boundaries as a declarative `LayerConfig` (GeoJSON from
   `get_kyngs_geojson`/a light boundaries RPC); the fabric as a **live viewport layer** (the
   [layers/live/](../../src/lib/map/layers/live/) child-component pattern): zoom-gated
   (≈ z14+), refetch on `moveend` via `get_fabric_geojson(bbox)`, canvas renderer. ~14k polygons
   AOI-wide means an editing viewport holds hundreds to low thousands — comfortably GeoJSON.
   Escalation path if ever needed: `ST_AsMVT` behind a SvelteKit endpoint (not a standalone
   Martin service — no infra for it).
2. **Drawing:** `map.editTools.startPolyline()` (leaflet-editable) with the existing
   [capture/snapping.ts](../../src/lib/map/capture/snapping.ts) hook (leaflet-geometryutil)
   snapping to rendered fabric edges/vertices.
3. **Flow:** draw control line(s) → `propose_kyng_boundary` → render returned candidate
   boundaries + moved-parcel/reassigned-property diff as a preview layer → adjust & re-propose
   or confirm → `promote_kyng_edit_session`.
4. **Attribution/currency:** reuse [profiles/attribution.ts](../../src/lib/map/profiles/attribution.ts)
   NSW SS constants and `showDataCurrency` — required by CC BY 4.0 (see Licensing).

### Downstream updates on promote (single transaction)

- Replace `kyng_areas.geom` (+ `last_updated`) for affected areas from the candidate union.
- **Recompute `property_profile.kyng` for affected properties** by joining each property's
  address point → containing fabric polygon → its assignment (deterministic, consistent with
  the boundary). Note: **no existing function does this** — `property_in_kyng_area()` is an
  auth check, and assignment currently happens only at signup. This is net-new work.
- **`coordinates_kyng` refresh:** the current population path is legacy
  (`process_kyng_areas()` dynamically creates per-area `addresspoint_<kyng>` tables via live
  NSW calls, keyed on the area _name_). Decide in Phase 5 whether to re-run it or replace it
  with a fabric/`project_addresspoints`-based rebuild; also note this legacy dynamic SQL makes
  area _renames_ hazardous — the editor changes geometry only, never `kyng_areas.kyng`.
- `get_kyngs_geojson` needs no change (reads base tables); verify its derived
  FeatureCollections recompute.
- Bump a version marker (new `kyng_version` or reuse `last_updated`) for client cache
  invalidation.
- **External QGIS maps need no action** — the `kyng_*_view` consumer views (below) derive
  area membership live from `kyng_areas`, so promoted boundary changes flow through
  automatically.

### CRS & tolerances

Canonical storage **7844**; wire format to Leaflet **4326**; all metric ops (noding, snapping,
side classification, sliver areas) in **7856** — this is the established SRID contract
(gis-mapping §4.5) plus one metric CRS. Tolerances at cadastral scale: vertex snap 0.05–0.2 m
(NSW upgraded urban cadastre < 0.2 m, rural < 5 m), noding grid ~0.001 m, sliver warning ~1 m².

### Licensing (confirmed, aligned with the repo's licensing appendix)

The Land Parcel Property Theme is DCS Spatial Services, **CC BY 4.0** — persistent caching of
an AOI extract and derived products are permitted with attribution:
_"© State of New South Wales (Spatial Services, a business unit of the Department of Customer
Service NSW). For current information go to spatial.nsw.gov.au."_ This matches the project's
existing NSW SS usage (gis-mapping, source-data licensing appendix); attribution + currency
display are already wired into the map engine.

### External consumers (QGIS) — _as built, 2026-07-12_

External QGIS documents (map layouts per KYNG area) historically consumed a stack of ~170
auto-generated per-area views in the old dev database — six per area
(`kyng_<area>_{area,addresspoint,property,property_fragment,proway,waypoint}_view`). That
stack was deliberately dropped from `newprod`
(`20260707221053_drop_legacy_kyng_views_and_bigint_psoid`), and it had structural problems:
Postgres's 63-char identifier limit truncated long area names, hyphen/underscore sanitisation
was inconsistent between view types, and the per-area `property_view`s had the area boundary
**hard-coded as a WKB literal** — they would have silently ignored every edit made by this
boundary editor.

**Replacement (migration `20260712010710_qgis_kyng_consumer_views`):** six generic views in
`newprod`, mirroring the legacy column contracts and adding `kyng` / `kyng_id` filter columns,
with membership computed live from `kyng_areas`:

| View                          | Legacy equivalent                    | Notes                                                        |
| ----------------------------- | ------------------------------------ | ------------------------------------------------------------ |
| `kyng_area_view`              | `kyng_<area>_area_view`              | all boundaries; `kyng` column already present                |
| `kyng_addresspoint_view`      | `kyng_<area>_addresspoint_view`      | `ST_Within` against each area                                |
| `kyng_waypoint_view`          | `kyng_<area>_waypoint_view`          | joins the addresspoint view on `addresspointoid`             |
| `kyng_proway_view`            | `kyng_<area>_proway_view`            | joins the waypoint view on `addresspointoid`+`waypointoid`   |
| `kyng_property_view`          | `kyng_<area>_property_view`          | live boundary (was hard-coded WKB); keeps `crosses_boundary` |
| `kyng_property_fragment_view` | `kyng_<area>_property_fragment_view` | fragments in a different area than their parent property     |

Parity was verified against the dev originals (e.g. Mondrook Lane: 25/25/25/25/0 across
addresspoints/waypoints/proways/properties/fragments on both sides; all 27 areas return
plausible counts summing to the cached totals).

**Access model.** The views are owned by `postgres` without `security_invoker`, so they read
the reference tables with owner rights — that is deliberate, for the external read-only role
**`qgis_reader`** (SELECT on the six views only). `anon`/`authenticated` are revoked, so
PostgREST does not serve them. This adds six "security definer view" advisor notices to the
accepted-remainder list. `qgis_reader` is created `NOLOGIN`; before first use, set
`ALTER ROLE qgis_reader LOGIN PASSWORD '<strong password>'` by hand (never in a migration).

**QGIS-side migration (one-time, before the old dev project is decommissioned):**

1. Define the `newprod` connection once in `pg_service.conf` and reference it by service name
   in QGIS, so future moves/rotations are a one-line change. Use the session pooler endpoint
   if the network needs IPv4 (pooler username form: `qgis_reader.<project-ref>`).
2. Repoint each layer from its per-area view to the generic view with a provider filter
   (`"kyng" = 'Mondrook Lane'`); field mappings carry over since column contracts match. Use
   `rowid` as the layer key (note: not stable across refreshes — same as the legacy views).
3. Where per-area documents share a layout, prefer converting them to a single project with
   **Atlas generation** driven by `kyng_area_view` — new/renamed areas then appear with no
   document edits.
4. Verify one pilot document side-by-side against the dev original, then migrate the rest.
   Tracked on `docs/testing/cutover-checklist.md`.

## Phased roadmap

- **Phase 0 — platform floor.** ✅ Done 2026-07-12 (this validation): PostGIS 3.3.7 / GEOS
  3.14.1 / PG 17.6 confirmed on `newprod`; no coverage functions; commit to the assignment
  model.
- **Phase 1 — ingestion + fabric build.** `extract_fabric_layer` functions + build routine +
  QA gate; prove zero-gap tessellation over one KYNG cluster, then the full AOI (~14.3k
  polygons). Provenance columns + `spatial_refresh_log` integration from day one.
- **Phase 2 — assignment backfill.** Populate `kyng_fabric_assignment` from current
  `kyng_areas` by point-on-surface containment; surface border-straddling polygons in a review
  view (echo the `_kyng_snap_review_cases` pattern from the May 2026 snap exercise); confirm
  `ST_Union` of assignments reproduces current boundaries within tolerance.
- **Phase 3 — RPCs + validation.** Session workflow, propose/validate/promote/discard, gates,
  RLS, B4b-compliant grants.
- **Phase 4 — editor UI.** Extend the admin kyng-boundaries route on the v2 engine: fabric
  live layer, control-line drawing + snapping, preview–confirm loop.
- **Phase 5 — downstream + refresh.** Property reassignment on promote, `coordinates_kyng`
  strategy decision, cache-busting, scheduled fabric refresh, docs cross-references
  (database.md, gis-mapping.md, docs/README.md).

**Thresholds that change the plan:** fabric growth beyond ~50k polygons in an editing viewport
→ move `get_fabric_geojson` to `ST_AsMVT`; a Supabase PostGIS upgrade to ≥ 3.4/3.6 → add
coverage-function validators (GEOS already qualifies); routine need to cut _through_ lots →
promote the polygonize split path into the live edit flow.

## Caveats

- The NSW fabric is not a guaranteed topological coverage at source — lot and corridor layers
  may not share identical vertices along shared edges. The snap/node/polygonize build step and
  its QA gate are essential, including strata/part-lot handling.
- Splitting fabric polygons along control lines breaks 1:1 cadastre correspondence — keep it
  the exception.
- `extractChanges` requires server-side ChangeTracking; the fallback (`lastupdate` filter +
  periodic `objectid` reconciliation for deletes) is assumed.
- The fabric build runs inside the database; watch statement timeouts on large rebuilds
  (chunk by grid cell, `SET LOCAL statement_timeout` in the job function).
- `kyng_areas.kyng` (the text name) is interpolated into dynamic SQL by legacy machinery
  (`process_kyng_areas`); the editor must never rename areas as a side effect.

## As built (2026-07-13)

All phases implemented on `newprod` and in this repo. Deviations from the plan above are
deliberate and noted.

**Migrations** (`supabase/migrations/`, applied to `newprod`):

| Migration                                      | Contents                                                                                                                                                                                                                                                |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `20260712100000_kyng_fabric_data_model`        | `cadastre_fabric_src`, `cadastre_fabric`, `kyng_edit_session`, `kyng_fabric_assignment` (PK fabric_id = structural no-overlap), `_candidate`; RLS on all (`jwt_can('admin.site.data.kyng-boundaries')`, TO public, read-only — writes via definer RPCs) |
| `20260712101000_kyng_fabric_ingestion`         | `extract_fabric_layer()` + `extract_cadastre_fabric()` on the `extract_properties()` pattern (http extension, paged, retry/backoff, `spatial_refresh_log`)                                                                                              |
| `20260712102000_kyng_fabric_build`             | `build_cadastre_fabric()` (grid-snap 1 mm → corridor→lot `ST_Snap` 0.1 m → `ST_UnaryUnion` → `ST_Polygonize`; face attribution by point-on-surface, lot-first priority; assignment re-inheritance across rebuilds) + `qa_cadastre_fabric()`             |
| `20260712103000_kyng_fabric_backfill`          | `backfill_kyng_fabric_assignments()`, `kyng_fabric_border_review` view (security_invoker), `qa_kyng_boundary_reproduction()`                                                                                                                            |
| `20260712104000_kyng_edit_session_rpcs`        | `get_kyng_boundaries_geojson`, `get_fabric_geojson(bbox, simplify)`, `start/propose/validate/promote/discard_kyng_edit_session`, `get_active_kyng_edit_session`; B4b grants (authenticated only, jwt_can in body)                                       |
| `20260712105000_kyng_fabric_refresh_and_gates` | `refresh_cadastre_fabric()` + monthly `pg_cron` (`refresh-cadastre-fabric-monthly`, 19:00 UTC on the 1st — after the spatial refresh); active-session guard on rebuilds; empty-area blocking gate in validate                                           |

**Live data (first build):** the plan's ~14.3k-polygon estimate was for the KYNG _bounding box_;
against the actual project-area polygon the service returns **2,071 source polygons** (lot 1,137
— matches the service's own `returnCountOnly` 1,103 ±paging; road 799; water 43; corridor 61;
unidentified 31; **rail 0** — the corridor misses the AOI polygon). Build: **2,325 faces, zero
overlap, 20.6 m² total gap** over 386 km²; 21 unmatched faces (6.87 km² — river/estuary surface
covered by no source layer, still assignable); 72 sub-1 m² slivers. Backfill assigned 2,127
faces; **198 unassigned** (point-on-surface outside the KYNG union — edge/river faces, queued in
`kyng_fabric_border_review`). Boundary reproduction: worst area 1.17% symmetric difference,
most ≤ 0.5% (legacy hand-snap vs true cadastre — converges to 0 as areas are promoted).

**Frontend** (v2 MapView engine): profile + boundary LayerConfig in
[profiles/kyng-boundary-editor.ts](../../src/lib/map/profiles/kyng-boundary-editor.ts); the
editor controller (fabric live viewport layer ≥ z13 via `./fabric` endpoint, canvas renderer,
leaflet-editable polyline drawing with the capture snapping hook, region preview with
click-to-reassign, session panel) in
[kyng-editor/KyngBoundaryEditorController.svelte](../../src/lib/map/kyng-editor/KyngBoundaryEditorController.svelte),
mounted by
[admin/site/data/kyng-boundaries](<../../src/routes/(protected)/admin/site/data/kyng-boundaries/+page.svelte>)
(load + form actions in `+page.server.ts`, viewport endpoint in `fabric/+server.ts`).

**Design refinements made during implementation:**

- Sub-regions are cut against the **derived** session territory (union of assigned fabric), not
  the stored legacy geometry — every session face then lands in exactly one region.
- Region → KYNG mapping: **majority-area default + explicit per-region overrides**
  (`p_region_assignments`) — "move this chunk" is one click on the preview, fully deterministic.
- One active session at a time (`kyng_areas_candidate` holds one candidate geometry per area).
- Fabric rebuilds refuse to run while a session is active (rebuild would cascade-delete its
  candidates); the monthly refresh logs a skip instead.
- An area left with **zero** fabric is a blocking validation issue (promote would strand its
  stored geometry); dissolving an area is out of scope.
- Neighbour-consistency is structural (disjoint face sets); overlap vs _stored_ neighbour
  geometry is reported as a warning until that neighbour's own first promote re-derives it.
- The scheduled refresh does **not** auto-update `kyng_areas.geom`; boundaries change only on
  promote. After a cadastre refresh, review `kyng_fabric_border_review`.
- `coordinates_kyng` (Phase 5 decision): left on the legacy `process_kyng_areas()` path —
  re-running it after a promote is a manual operator step until that path is replaced.

**Verified:** end-to-end session workflow (start → propose → override → validate → promote)
smoke-tested in a rolled-back transaction on `newprod` (49 faces / 2 properties moved between
View Place and Beaully Road; boundary areas re-derived correctly); empty-area gate blocks;
grants checked (app RPCs: authenticated only; pipeline functions: operator/cron only);
`npm run check` + lint green. The eight new app-facing RPCs add eight
`authenticated_security_definer_function_executable` advisor notices — the same accepted
category as the other in-body-gated app RPCs (each starts with a `jwt_can` check). Not yet
exercised: the editor UI in a browser against a real admin login — first manual pass tracked
on the user-testing checklist.
