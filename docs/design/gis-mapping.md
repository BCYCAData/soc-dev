# GIS / Mapping — Design & Implementation Strategy

> **Status:** Draft for review · **Author:** audit + strategy pass · **Date:** 2026-06-26
> **Scope:** All map-bearing features in `soc-dev` — property data capture, community
> visualization, KYNG coordination, admin oversight, and source-data caching.
> **Companion docs:** [database.md](./database.md) (data model, spatial schema, address
> resolution). This doc also folds in the map-authoring guide, the source-data lifecycle, the
> data-capture design intent, and the licensing appendix (see sections below).

---

## 1. Executive summary

The mapping subsystem is functionally capable but **architecturally split**. Two complete
Leaflet stacks coexist: a working component-based stack (**v1**) that powers every live route,
and a newer, better-designed config-driven stack (**v2**) that is fully built but **wired to no
route**. They use incompatible context/registration models, so code cannot be shared between
them. Type definitions, GeoJSON-transform logic, and SRID handling are duplicated and drift.

The recommended strategy is to **converge on the v2 declarative `LayerConfig` architecture as
the single canonical map system**, express each map purpose as a small "map profile" + a set of
RPC-sourced layer configs, migrate the v1 routes onto it, and then delete v1. In parallel,
formalise the source-data caching pipeline (which is the right decision, with caveats) and stand
up the still-unbuilt server-side PostGIS validation/snapping/merge RPCs that the data-capture UX
depends on.

This document is the audit + target design + phased roadmap to get there.

---

## 2. Current-state audit

### 2.1 Backend topology — three databases

Per [[soc-migration-projects]] there are three Supabase projects, and the mapping code spans them:

| Project                             | Role                           | Map-relevant contents (verified via MCP)                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supabase-prod` (old prod)          | Legacy source-data + geocoding | `get_addresspoint_from_address`, `process_geoscape_geocoder_response`, `saveextractedaddresspoints`, `get_registered_addresspoints`; tables `address_point_extract_wgs84`, `custom_address`, `kyng_areas`. **No `spatial_features` schema.**                                                                                                                                                                               |
| `supabase-dev` (active app backend) | Current application DB         | Full spatial stack: `get_spatial_features`, `get_spatial_feature_templates`, `get_spatial_feature_attributes`, `upsert_spatial_feature`, `upsert_feature_attributes`, `delete_spatial_feature`, `get_property_geometry`/`get_property_geometries`, `get_property_features_by_category`, `get_kyngs_geojson`, `get_site_roads(_in_suburb)`, `generate_custom_geojson_features`, `refresh_spatial_data`, KYNG view builders. |
| `supabase-newprod`                  | Cutover target                 | Destination for the dev schema at go-live.                                                                                                                                                                                                                                                                                                                                                                                 |

**Implication (as originally written):** the validation/merge RPCs
(`validate_spatial_feature`, `merge_spatial_features`, enhanced `upsert_spatial_feature`) were a
design, not deployed code, and had to be built as net-new work targeting dev → newprod via
migrations. **Update:** `validate_spatial_feature` and `merge_spatial_features` subsequently
shipped in `20260628000000_spatial_validation.sql`; `snap_to_property_boundary` is still unbuilt.
See [the data-capture design intent](#property-data-capture-design-intent) below.

### 2.2 Two parallel frontend map architectures

> **Historical (pre-refactor snapshot).** As of Phase 6 the v1 stack described here has been
> **deleted**; the v2 engine (§4) is the only map system. Kept for rationale/context.

**v1 — component stack (in production use):**

- Map shell: [Leafletmap.svelte](../../src/components/map/leaflet/Leafletmap.svelte) — `onMount` dynamic-imports `leaflet`, `esri-leaflet`, `leaflet-draw`, **and** `leaflet-editable`; publishes string context key `'leafletContext'` exposing getters (`getLeaflet`, `getLeafletMap`, `getLeafletLayers`, …).
- Layers: [layers/geojson/](../../src/components/map/leaflet/layers/geojson/) (Point/Line/Polygon), [LeafletArcGISFeatureServerLayer.svelte](../../src/components/map/leaflet/layers/LeafletArcGISFeatureServerLayer.svelte), and live-tile layers [layers/pbf-data/](../../src/components/map/leaflet/layers/pbf-data/) (Cadastre/GNAF/Roads).
- Controls: attribute editor, delete editor, legend, scale, select-edit-layer.
- State + helpers: [spatialutilities.svelte.ts](../../src/lib/leaflet/spatialutilities.svelte.ts) (module-level `$state`), `mapconfig.ts`, `symbol/*` generators, `geometryUtilities.ts`, `leafleteditutilities.ts`.
- **Consumers:** property data-capture `my-map`, community maps, KYNG, admin maps.

**v2 — config-driven stack (built, wired to nothing):**

- [createLeafletMap.ts](../../src/lib/map/createLeafletMap.ts) — **Symbol** context key `LEAFLET_CONTEXT_KEY`, typed `registerLayer/unregisterLayer/updateLayer` API over a `$state` registry.
- [layer-factory.ts](../../src/lib/map/layer-factory.ts) — factory helpers (`tileLayer`, `wmsLayer`, `geoJSON`, `marker`, ESRI base/feature/dynamic/image, `customLayer`).
- [layers/schemas/layer-config.types.ts](../../src/lib/map/layers/schemas/layer-config.types.ts) — rich declarative `LayerConfig`: `source.rpcFunction` + cache hints, `styling` (static/dynamic/categorized/choropleth + hover/selection), `interaction` (popup/tooltip/sidePanel/click/hover), `query` (filters), `editing` (create/update/delete, snapping, snapLayers, per-property validation, CRUD RPC names), and a `PropertySchema` for forms.
- Config instances: [layers/configs/](../../src/lib/map/layers/configs/) (`parcels`, `poi`, `roads`), `styles/*`, `templates/*`, `symbology-presets.ts`, `map-types.ts`.

**The fork is the central problem.** The two context systems are incompatible — a layer written
for one cannot mount in the other — so every improvement currently has to be built twice or is
stranded in the unused half. The v2 `LayerConfig` is the stronger abstraction and already
anticipates the exact features the refactor needs (RPC-sourced layers, declarative styling,
editing + snapping, filters, property schemas).

### 2.3 Map use-cases inventory (different requirements)

| #   | Route(s)                                                              | Purpose                                                                     | Access                        | Data source                                                                                                                                                                                                  | R/W |
| --- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| 1   | `personal-profile/my-property/[propertyid]/my-map`                    | Property **data capture** — draw/edit hazards, assets, operational features | Owner (RLS by `property_ids`) | `get_property_geometry`, `get_spatial_feature_templates`, `get_spatial_features`, `get_spatial_feature_attributes`; writes via `upsert_spatial_feature`/`upsert_feature_attributes`/`delete_spatial_feature` | RW  |
| 2   | `personal-profile/my-community/{bcyca,tinonee,mondrook,external}/map` | Community visualization — extent, address points, registered points         | Member                        | `get_community_data`                                                                                                                                                                                         | R   |
| 3   | `kyng-coordinator/[kyng_area]/map`                                    | Coordinator view — registered/unregistered properties per KYNG area         | Coordinator                   | `get_registered_properties_by_kyng_area`, `get_kyngs_geojson`                                                                                                                                                | R   |
| 4   | `admin/community/*/map`, `admin/emergency/service-map`                | Admin oversight                                                             | Admin                         | community/service RPCs                                                                                                                                                                                       | R   |
| 5   | `api/reports/rfs/properties`, `api/spatial/*`                         | RFS export / suburb roads                                                   | Service/role                  | `get_rfs_property_data_for_street`, `get_site_roads_in_suburb`                                                                                                                                               | R   |

These have genuinely different needs — capture needs editing + validation + per-feature attribute
forms; community/KYNG/admin need fast read-only rendering of potentially dense point sets;
reports need server-side extraction. A single map _engine_ with per-purpose _profiles_ serves all
five without one-size-fits-all compromises.

### 2.4 Source data & the caching pipeline

Two external geometry providers feed the system:

1. **NSW Spatial Services (SS)** — `maps.six.nsw.gov.au/arcgis/rest/...` (cadastre lot/DP,
   `PropertyAddress`, `principaladdresssiteoid`). Resolved during the address-lookup decision
   tree ([database.md](./database.md#address-resolution-source-precedence)) and **cached server-side** into
   `property_profile.geom`, `address_point_extract_wgs84`, `project_addresspoints`, and KYNG views
   (`saveextractedaddresspoints`, `get_registered_addresspoints`, `refresh_spatial_data`). Stored
   in **SRID 7844 (GDA2020)**.
2. **Geoscape / PSMA** — `api.psma.com.au/v1/maps/{layer}/{z}/{x}/{y}.pbf` (cadastre/roads/address
   vector tiles). Served through [geoscape.service.ts](../../src/lib/server/services/geoscape.service.ts)
   and [api/geoscape/[layerId]/tiles/...](../../src/routes/api/geoscape/) as a **live passthrough
   proxy** — each map move re-fetches tiles, converts MVT→GeoJSON, and returns them. **No caching.**

So "caching the project source geometry" accurately describes path (1) but **not** path (2).

---

## 3. The caching decision — validation

**Verdict: the decision to cache source geometry is correct. Keep it. Make it uniform and add
provenance + a refresh policy.**

### 3.1 Why caching NSW SS geometry is the right call

- **Availability & latency.** NSW SS ArcGIS REST endpoints are rate-limited, have variable
  response times, and carry no uptime guarantee suitable for synchronous, user-facing requests
  (e.g. drawing the property boundary on page load). A remote dependency in the hot path is a
  reliability and UX liability.
- **It's slowly-changing reference data.** A cadastral parcel boundary is stable for months/years.
  Re-fetching it on every view is pure waste; resolve once, store, reuse.
- **It's the authoritative anchor.** The property boundary cached at signup is the immutable basis
  for the `spatial_features` FK chain, the `ST_Within`/snapping checks, and property-level RLS.
  Pinning it removes a class of "the boundary moved under me" bugs.
- **PostGIS capability.** Once geometry lives in Postgres you get spatial joins, RLS, and the
  full `ST_*` toolset (validation, snapping, union, area/length) — none of which is possible
  against a remote REST/tile API.
- **Cost.** Geoscape/SS calls are metered; caching collapses N user views into 1 fetch.

### 3.2 Caveats to address (don't skip these)

1. **Staleness / reconciliation.** Cadastre changes (subdivision, re-survey, address
   re-allocation) will not propagate. You already have `refresh_spatial_data` — formalise it: a
   scheduled refresh cadence (e.g. via `pg_cron`), and **provenance columns** on cached tables
   (`source`, `source_id`, `source_version`, `fetched_at`) so staleness is queryable and refresh
   is incremental rather than wholesale.
2. **The Geoscape inconsistency.** The tile proxy contradicts the caching principle and leaves a
   live external dependency (and API-key surface — `PUBLIC_GEOSCAPE_GNAF_TILES_API_KEY` flows
   through the server endpoint). Decide **per layer**: cache-to-PostGIS (for stable reference
   layers like parcels in your AOI) vs. proxy-with-edge-cache (for incidental basemap context).
   At minimum add an HTTP cache layer (Vercel Runtime Cache / CDN `Cache-Control`) in front of
   `api/geoscape/.../tiles`.
3. **Licensing.** Confirm NSW SS and Geoscape/PSMA terms permit **persistent storage of derived
   geometry** and the intended redistribution to end users. This is a go-live gate, not a detail.
4. **SRID discipline.** Storage is 7844 (correct, GDA2020); Leaflet consumes 4326 (WGS84). Today
   this transform is implicit/mixed (the proposed validation RPC even assumes 4326 input). Make
   the rule explicit and enforced at the RPC boundary (§4.5).

---

## 4. Target architecture

### 4.1 Principle: one engine, many profiles

Adopt the v2 declarative stack as the **single** map system. Express each use-case (§2.3) as:

```text
MapProfile  =  base/overlay layer set  +  default view/extent  +  interaction policy  +  edit policy
Layer       =  LayerConfig (declarative; sourced by RPC name)
```

```text
┌──────────────────────────────────────────────────────────────┐
│ Route (+page.svelte)                                           │
│   <MapView profile={propertyCaptureProfile} data={…}/>        │
└──────────────────────────────────────────────────────────────┘
                     │ profile + LayerConfig[]
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ MapView.svelte  (single shell; createLeafletMap context)      │
│   • registers each LayerConfig via the typed registry         │
│   • mounts controls per profile (legend, scale, edit, filter) │
│   • SSR-safe dynamic import; one editing library              │
└──────────────────────────────────────────────────────────────┘
                     │ source.rpcFunction
                     ▼
┌──────────────────────────────────────────────────────────────┐
│ SvelteKit load / form actions  →  Supabase RPC (PostGIS)      │
│   reads: get_* (GeoJSON, 4326 at the boundary)                │
│   writes: upsert/validate/merge/delete (geometry, 7844)       │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Canonical context & component model

- **Keep** the v2 Symbol-keyed context (`LEAFLET_CONTEXT_KEY`) + typed `registerLayer` registry
  from [createLeafletMap.ts](../../src/lib/map/createLeafletMap.ts). Retire the string-keyed
  `'leafletContext'` getter context.
- **One `MapView.svelte`** shell replaces `Leafletmap.svelte`. It owns the dynamic Leaflet import
  (SSR-safe), creates the map, and renders profile-driven layers/controls.
- **Modernise the lifecycle wiring with Svelte 5 `{@attach}`** instead of `onMount`/`onDestroy`
  imperative blocks for binding Leaflet to a DOM node and for per-layer setup/teardown — it gives
  automatic cleanup and re-runs on dependency change (confirmed against the Svelte MCP
  `svelte/@attach` and `svelte/lifecycle-hooks` guidance). Context sharing stays via
  `setContext`/`getContext` (`svelte/context`).
- **Consolidate state.** Replace module-level `$state` singletons in `spatialutilities.svelte.ts`
  with per-map state owned by the shell (module singletons break with >1 map on a page and blur
  ownership). Keep a single shared `transformFeaturesToGeoJSON` (it is currently **duplicated** in
  both `spatialutilities.svelte.ts` and the `my-map` `+page.svelte`).

### 4.3 Layer configuration & data sourcing

- Every layer is a `LayerConfig`. `source.rpcFunction` names the read RPC; the loader calls it and
  the factory builds the Leaflet layer with the declared styling/interaction.
- Author one config per real layer and group them into profile bundles, e.g.
  `profiles/property-capture.ts`, `profiles/community.ts`, `profiles/kyng.ts`, `profiles/admin.ts`.
- Collapse the scattered type defs (`lib/leaflet/spatial.d.ts`, `lib/leaflet/types.d.ts`,
  `lib/data/spatial/types.d.ts`, `lib/map/map-types.ts`, `layer-config.types.ts`) into a single
  `lib/map/types/` surface to stop drift.

### 4.4 Data-capture (editing) model

- **Pick one editing library.** Today both `leaflet-draw` and `leaflet-editable` load — redundant
  weight and two event models. The Leaflet MCP confirms the viable options are **Leaflet.Editable**,
  **Leaflet.draw**, and **Leaflet.GeometryUtil** (snapping math). Recommendation:
  **standardise on Leaflet.Editable** (already integrated via `map.editTools`, lighter, good
  vertex editing) + **Leaflet.GeometryUtil** for snapping; drop `leaflet-draw`. (If richer
  built-in snapping/UX is wanted later, Leaflet-Geoman is the modern all-in-one alternative —
  evaluate licensing.)
- **Server-authoritative validation.** Build the proposed (currently non-existent) RPCs as
  migrations: `validate_spatial_feature` (type match, `ST_MakeValid`, within-boundary, snap,
  area/length sanity, overlap warnings), `merge_spatial_features` (`ST_Union`), and a hardened
  `upsert_spatial_feature` that validates before insert. PostGIS is the source of truth for
  geometry quality; the client preview is UX only.
- **Fix the save flow.** Use `invalidateAll()` (not `location.reload()`) after writes; surface
  `issues`/`warnings` from the validation RPC in the existing toast system.
- **Verify the `upsert_spatial_feature` contract.** Its signature is `p_geom geometry`, but the
  `my-map` action passes a parsed GeoJSON **object**. Confirm coercion works end-to-end (or switch
  the param to `jsonb`/`text` and `ST_GeomFromGeoJSON` inside) — this is a latent bug to validate
  before building on top of it.

### 4.5 SRID & the client/DB data contract _(implemented, G5 done)_

- **Client / Leaflet / GeoJSON over the wire = EPSG:4326 (WGS84).**
- **Cached NSW SS _reference_ geometry = EPSG:7844 (GDA2020)** — `property_geometry`, `project_*`,
  `project_area`. Read RPCs return `ST_AsGeoJSON(ST_Transform(geom,4326))`.
- **User-authored _editable_ features (`spatial_features.geom`) = EPSG:4326** — their native
  capture CRS (drawn in Leaflet, served back as 4326). The column is declared `geometry(Geometry,
4326)` (was an unconstrained SRID 0). Storing these in 7844 would add read+write transforms for
  no benefit at property scale (7844↔4326 differ <2 m).
- **Transform at the comparison boundary:** where the two CRSs meet, transform once — e.g.
  `validate_spatial_feature` transforms the 7844 property boundary _to_ 4326 to check/snap 4326
  features. No transforms in the browser; no 7844 GeoJSON leaves the DB.

### 4.6 Caching & provenance model

- Treat cached source geometry as a first-class, versioned dataset: provenance columns + scheduled
  `refresh_spatial_data` (§3.2). Cache **stable, in-AOI** reference layers (parcels, roads,
  address points) to PostGIS; **proxy + edge-cache** incidental basemap tiles.
- Add an HTTP cache in front of `api/geoscape/.../tiles` and keep the Geoscape key strictly
  server-side.
- For dense read-only point layers (community/KYNG/admin), add **Leaflet.markercluster**
  (recommended by the Leaflet MCP) to keep rendering performant.

---

## 5. Gap & issue register

| #   | Issue                                                 | Where                                     | Severity            | Action                                                                                                                                                            |
| --- | ----------------------------------------------------- | ----------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | Two incompatible map stacks; v2 unwired               | `components/map/leaflet/*` vs `lib/map/*` | High                | **Done** — all routes on v2; v1 deleted                                                                                                                           |
| G2  | Validation/snapping/merge RPCs don't exist            | dev/newprod                               | High                | **Done** — `spatial_validation` migration (validate/merge/hardened upsert), live in newprod                                                                       |
| G3  | Two editing libs loaded at once                       | `Leafletmap.svelte`                       | Med                 | **Done** — Leaflet.Editable only (v1 deleted)                                                                                                                     |
| G4  | `upsert_spatial_feature` geometry-vs-GeoJSON contract | `my-map/+page.server.ts` + RPC            | High                | **Done** — `upsert_spatial_feature_geojson` wrapper; action calls it                                                                                              |
| G5  | SRID handling implicit/mixed (7844 vs 4326)           | RPCs + docs                               | High                | **Done** — `spatial_features.geom` declared 4326; reference caches 7844; transform at boundary (§4.5)                                                             |
| G6  | `transformFeaturesToGeoJSON` duplicated               | utils + page                              | Low                 | **Done** — single util in `lib/map/render/transform-features.ts`                                                                                                  |
| G7  | Type defs scattered                                   | `lib/data`, `lib/map`                     | Med                 | **Done** — v1 dup type files removed; engine types via barrel [`lib/map/types.ts`](../../src/lib/map/types.ts); data-shapes stay in `lib/data/spatial`            |
| G8  | Geoscape tiles uncached; live dependency              | geoscape proxy                            | Med                 | Done — edge-cached; no PostGIS cache (cadastre commercial)                                                                                                        |
| G9  | Module-level `$state` singletons                      | `spatialutilities.svelte.ts`              | Med                 | **Done** — per-map state in `MapView`; v1 deleted                                                                                                                 |
| G10 | `location.reload()` in save UX                        | proposed `my-map` flow                    | Low                 | **Done** — save flow uses `invalidateAll()`                                                                                                                       |
| G11 | No provenance/refresh policy on cached geometry       | cached tables                             | Med                 | **Done** — provenance columns + monthly `pg_cron` refresh                                                                                                         |
| G12 | Licensing of persistent source caching                | SS + Geoscape                             | High (go-live gate) | Clear: all live sources CC BY 4.0 (NSW SS + G-NAF geocoder/tiles); no commercial Geoscape data used. Open: confirm G-NAF tier + Geocoding API ToU (account owner) |

---

## 6. Phased implementation roadmap

Phases are ordered so each lands shippable value and de-risks the next. Each phase = one or more
PRs; DB changes go to **dev first**, then ride the dev→newprod cutover.

**Phase 0 — Decisions & guardrails (no code).**
Confirm: (a) v2 as canonical, (b) editing library, (c) licensing (G12), (d) SRID contract (G5).
Resolve via §8 open decisions. Verify G4 contract with a probe query against dev.

**Phase 1 — Foundation: one engine.**
Stand up `MapView.svelte` over the v2 context; consolidate types (G7) and the shared transform
(G6); per-map state (G9). Re-platform **one read-only route first** (community `bcyca` map) onto
profiles as the reference implementation. No behaviour change for users.

**Phase 2 — Migrate read-only maps.**
Port remaining community, KYNG, and admin maps to profiles + `LayerConfig`. Add markercluster for
dense point layers (G8 perf). Delete the v1 layers/controls they no longer use.

**Phase 3 — Data-capture on the new engine.**
Re-platform the property `my-map` route. Standardise on one editing library (G3); wire attribute
forms from `PropertySchema`; switch save UX to `invalidateAll()` (G10). Behaviour parity with today.

**Phase 4 — Server-side spatial integrity.**
Build `validate_spatial_feature`, `merge_spatial_features`, hardened `upsert_spatial_feature`
(G2) as dev migrations with the SRID contract baked in (G5); repair G4. Surface validation
issues/warnings in the UI. Add snapping (Leaflet.GeometryUtil) and the merge control.

**Phase 5 — Caching hardening.** _Done._
Provenance columns (`source`/`source_layer`/`fetched_at`) + scheduled monthly `refresh_spatial_data`
via `pg_cron` (G11); HTTP edge-cache on the Geoscape GNAF tile/metadata proxy (G8). Licensing (G12)
assessed against actual usage: all live sources are CC BY 4.0 — NSW SS (property/address geometry)
and Geoscape **G-NAF** (geocoder + tiles); no commercial Geoscape data is consumed, so there is no
redistribution blocker. Lifecycle + licensing documented in
[the source-data lifecycle](#source-data-lifecycle) below.

**Phase 6 — Decommission v1 & document.** _Done._
The last three v1 holdouts were re-platformed onto the engine — the public About project map and
the admin KYNG-boundaries map (GeoJSON, on `siteStreetsProfile`), and the admin address-data map
(live ArcGIS + Geoscape GNAF layers, via the new MapView-child pattern in `lib/map/layers/live/`).
With no route importing them, `components/map/leaflet/*` (16 files) and `lib/leaflet/*` (19 files)
were deleted. Authoring guide: [Authoring a map](#authoring-a-map-profiles-layerconfigs-and-live-layers)
below. The v2 stack is now the only map system.

---

## 7. Risks

- **Migration regressions** on live maps — mitigate by porting read-only routes first and keeping
  v1 in place until each route is verified.
- **PostGIS perf at scale** — validation/merge on complex geometries; budget <500ms, add the
  composite GIST indexes noted in [the data-capture design intent](#property-data-capture-design-intent).
- **Cutover coupling** — new RPCs must exist in `newprod` at go-live; track them in the migration
  set, not just dev.
- **Licensing** (G12) can block persistent caching entirely — resolve in Phase 0.

---

## 8. Open decisions (need your call)

1. **Canonical stack** — confirm adopting v2 declarative and retiring v1 (this doc assumes yes).
2. **Editing library** — Leaflet.Editable + GeometryUtil (recommended) vs. migrate to Leaflet-Geoman.
3. **Geoscape strategy** — cache-to-PostGIS for in-AOI reference layers vs. proxy + edge-cache only.
4. **Validation strictness** — block save on issues (hard) vs. warn-and-allow (soft) for which
   feature categories.
5. **Cutover target** — build new spatial RPCs straight into the newprod migration line, or
   stabilise in dev first?

---

## 9. Appendix

### 9.1 Spatial RPCs verified present (dev)

`get_property_geometry`, `get_property_geometries`, `get_property_geometry_for_user`,
`get_spatial_features`, `get_spatial_feature_templates`, `get_spatial_feature_attributes`,
`get_property_features_by_category`, `upsert_spatial_feature`, `upsert_feature_attributes`,
`delete_spatial_feature`, `cleanup_orphaned_spatial_features`, `find_orphaned_spatial_features`,
`get_kyngs_geojson`, `get_registered_properties_by_kyng_area`, `get_site_roads`,
`get_site_roads_in_suburb`, `generate_custom_geojson_features`, `refresh_spatial_data`,
KYNG view/area builders.

### 9.2 Spatial RPCs — capture/validation

`validate_spatial_feature` and `merge_spatial_features` shipped in
`20260628000000_spatial_validation.sql`. Still to build: `snap_to_property_boundary` and any
further `upsert_spatial_feature` hardening. See
[the data-capture design intent](#property-data-capture-design-intent); enforce the
4326-in / 7844-store SRID contract on anything new.

### 9.3 Key files

> v1 (`components/map/leaflet/*`, `lib/leaflet/*`) was deleted in Phase 6 — the engine below is the
> only map system. Authoring guide: [Authoring a map](#authoring-a-map-profiles-layerconfigs-and-live-layers) below.

- Engine shell: [MapView.svelte](../../src/lib/map/MapView.svelte) (context in [createLeafletMap.ts](../../src/lib/map/createLeafletMap.ts))
- Layer builder + renderer: [render/build-layer.ts](../../src/lib/map/render/build-layer.ts), [render/](../../src/lib/map/render/)
- Profiles: [profiles/](../../src/lib/map/profiles/) (community, kyng, property-capture, site)
- Live/viewport layers: [layers/live/](../../src/lib/map/layers/live/) (ArcGIS FeatureServer, Geoscape GNAF)
- Schema: [layer-config.types.ts](../../src/lib/map/layers/schemas/layer-config.types.ts)
- Source caching: [geoscape.service.ts](../../src/lib/server/services/geoscape.service.ts), [api/geoscape/](../../src/routes/api/geoscape/); lifecycle in [Source-data lifecycle](#source-data-lifecycle) below
- Data capture: [capture/](../../src/lib/map/capture/) + [my-map/+page.server.ts](<../../src/routes/(protected)/personal-profile/my-property/[propertyid]/my-map/+page.server.ts>)

---

## Authoring a map: profiles, LayerConfigs and live layers

The SOC map stack is a single declarative engine ("v2"): one `MapView` shell driven by a
**profile** (the map's purpose: basemaps, controls, view, attribution) plus a list of
**LayerConfig + data** pairs (`ResolvedLayer[]`). This guide shows how to add a new map or
layer. Background/rationale: the strategy sections (§1–§9) above.

Key files:

- Engine shell — [MapView.svelte](../../src/lib/map/MapView.svelte)
- Layer builder — [render/build-layer.ts](../../src/lib/map/render/build-layer.ts)
- Profile types — [profiles/types.ts](../../src/lib/map/profiles/types.ts)
- LayerConfig schema — [layers/schemas/layer-config.types.ts](../../src/lib/map/layers/schemas/layer-config.types.ts)
- Example profiles — [profiles/community.ts](../../src/lib/map/profiles/community.ts), [profiles/kyng.ts](../../src/lib/map/profiles/kyng.ts), [profiles/site.ts](../../src/lib/map/profiles/site.ts)

### 1. The shape of a map

```svelte
<script lang="ts">
 import MapView from '$lib/map/MapView.svelte';
 import { communityMapProfile, communityLayers } from '$lib/map/profiles/community';
 import type { ResolvedLayer } from '$lib/map/profiles/types';

 let { data } = $props(); // GeoJSON FeatureCollections from the server load (EPSG:4326)

 let layers = $derived<ResolvedLayer[]>([
  { config: communityLayers[0], data: data.community },
  { config: communityLayers[1], data: data.addressPoints }
 ]);
</script>

<MapView profile={communityMapProfile} view={{ extent: data.mapExtent }} {layers} class="h-full" />
```

- **Data is fetched in the route's `+page.server.ts`** (an RPC returning GeoJSON) and passed in as
  `ResolvedLayer.data`. `LayerConfig.source.rpcFunction` is documentation only — the engine never
  fetches; the page owns data loading.
- **All geometry over the wire is EPSG:4326.** Storage is 7844; the transform happens at the RPC
  boundary (see strategy §4.5).
- `view` is `{ extent: [[S,W],[N,E]] }` (preferred) or `{ center: [lat,lng], zoom }`.

### 2. Writing a profile

A `MapProfile` (see `profiles/types.ts`) declares basemaps + controls + view + attribution:

```ts
export const myProfile: MapProfile = {
 id: 'my-map',
 baseLayers: [
  {
   id: 'nsw-streets',
   name: 'NSW Streets',
   url: NSW_STREETS_URL,
   attribution: NSW_SS_BASEMAP_ATTRIBUTION,
   visible: true
  }
 ],
 controls: { scale: 'bottomleft', legend: 'bottomright', layers: 'topright', attribution: true },
 attribution: NSW_SS_DATA_ATTRIBUTION, // data-source attribution (see §5)
 showDataCurrency: true, // appends the cached-data "as at" date
 view: { zoomSnap: 0.25, zoomable: true }
};
```

Reuse the shared attribution constants in [profiles/attribution.ts](../../src/lib/map/profiles/attribution.ts)
for any map showing NSW Spatial Services data.

### 3. Writing a LayerConfig

A `LayerConfig` declares one layer's geometry type, styling and interaction:

```ts
export const myLayer: LayerConfig = {
 id: 'my-layer',
 name: 'My Layer',
 geometryType: 'Point', // 'Point' | 'LineString' | 'Polygon'
 category: 'Community',
 source: { rpcFunction: 'get_my_data' },
 styling: {
  mode: 'static', // 'static' | 'dynamic' (styleFn) | 'categorized'
  base: { point: { radius: 4, fillColor: '#f97316', weight: 0, fillOpacity: 0.8 } }
 },
 interaction: {
  tooltip: { enabled: true, property: 'name' } // or template: (feature) => '...'
 },
 display: { defaultVisible: true, cluster: true } // cluster for dense point layers
};
```

Styling modes: **static** (one `base` style), **dynamic** (`styleFn: (feature) => style`),
**categorized** (per-value styles). Non-circle point shapes (`shape: 'square'|'diamond'|'triangle'`)
render as SVG divIcons. `display.cluster` enables marker clustering for dense point layers.

#### Tooltip/popup templates — escape interpolated values

Templates are bound as **HTML**. Feature properties come from external/cached sources, so any
value you interpolate must be escaped (XSS):

```ts
import { escapeHtml } from '$lib/map/render/template-utils';

interaction: {
 tooltip: { enabled: true, template: (f) => `<strong>${escapeHtml(f.properties?.name)}</strong>` }
}
```

The `{ property: 'name' }` shorthand is auto-escaped by the engine; **function templates are your
responsibility** — always wrap values in `escapeHtml()`.

### 4. Live / viewport-driven layers (ArcGIS, tiles)

Declarative `LayerConfig`s are for data fetched once and handed in. For layers that re-fetch on
pan/zoom (e.g. an ArcGIS FeatureServer, or Geoscape vector tiles), write a **child component** that
consumes the map context and mount it inside `<MapView>`:

```svelte
<MapView profile={addressMapProfile} view={{ center, zoom }} layers={[]} onReady={(m) => (map = m)}>
 <ArcGisFeatureLayer ready={mapReady} url={URL} name="Property Theme" popupTemplate={...} />
 <GnafAddressLayer ready={mapReady} />
</MapView>
```

A live layer (see [layers/live/](../../src/lib/map/layers/live/)) reads the context, gates init on a
`ready` prop, builds its own Leaflet layer, and registers it via `ctx.registerLayer(...)` so it
appears in the layers control; it `unregisterLayer`s on destroy:

```ts
const ctx = getContext<LeafletContext>(LEAFLET_CONTEXT_KEY);
$effect(() => {
 if (!ready || initialized) return;
 const L = ctx.getLeaflet();
 const map = ctx.getLeafletMap();
 if (!L || !map) return;
 initialized = true;
 /* build layer, attach map.on('moveend', …), ctx.registerLayer({ id, name, type, visible, leafletLayer }) */
});
onDestroy(() => ctx.unregisterLayer(id));
```

### 5. Checklist for a new map

1. Server load returns 4326 GeoJSON (+ an extent).
2. Profile chosen/created; NSW SS data attribution set if applicable.
3. LayerConfig(s) authored; templates escape values.
4. Dense point layers set `display.cluster`.
5. `npm run check` clean; run the svelte autofixer on new components.
6. Verify in the browser (render, layer control, tooltips, dark mode, teardown between maps).

---

## Source-data lifecycle

How external geometry enters, is cached in, refreshes within, and is served from the SOC
database. This is the Phase 5 ("caching hardening") deliverable of the strategy above and
resolves gaps **G8** (Geoscape caching) and **G11** (provenance + refresh policy).

### 1. Sources

| Source                        | Endpoint                                                  | What                                                                     | How it enters                                                         | Cache                                                 |
| ----------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- | ----------------------------------------------------- |
| **NSW Spatial Services (SS)** | `portal.spatial.nsw.gov.au/server/rest/...` (ArcGIS REST) | Cadastre / property, address points, address strings, proways, waypoints | `refresh_spatial_data()` → `extract_*()` (server-side `http_*` calls) | **Cached to PostGIS** (`project_*` tables), SRID 7844 |
| **Geoscape / PSMA**           | `api.psma.com.au/v1/maps/{layer}/{z}/{x}/{y}.pbf`         | Incidental basemap vector tiles (address / roads / parcels)              | `api/geoscape/[layerId]/tiles/...` proxy → `geoscape.service.ts`      | **Proxy + HTTP edge-cache** (not persisted)           |

SRID contract is uniform: **store 7844 (GDA2020), serve 4326 (WGS84) to Leaflet, transform at
the RPC boundary.** See §4.5 above.

### 2. NSW SS — cache to PostGIS

#### Why cache (not proxy)

Authoritative, slowly-changing reference data; rate-limited and latency-variable upstream; the
property boundary cached at signup is the immutable anchor for PostGIS RLS/joins and for
property-feature validation. Caching collapses N user views into one fetch.

#### Cached tables

`project_addresspoints`, `project_waypoints`, `project_proways`, `project_properties`,
`project_properties_singlepart`. Each is repopulated **wholesale** (`TRUNCATE` + `INSERT`) by its
`extract_*()` function; `refresh_spatial_data()` orchestrates all five with retry/backoff and
writes a row to `spatial_refresh_log`.

#### Provenance (G11)

Every cached table carries:

- `source` — default `'NSW Spatial Services'`
- `source_layer` — the specific ArcGIS FeatureServer layer (e.g.
  `NSW_Geocoded_Addressing_Theme/FeatureServer/0`)
- `fetched_at timestamptz` — set to the refresh transaction time (`now()` default)
- `refresh_date date` — same, day-granularity (legacy column, now populated)

These are **DEFAULT-only** columns: the `extract_*` INSERTs don't name them, so each wholesale
refresh auto-stamps them — no change to the (large, fragile) extract bodies. The per-table native
NSW object id (`addresspointoid`, `propertyoid`, `prowayoid`, `waypointoid`) is the `source_id`.

Staleness is now queryable, e.g.:

```sql
SELECT 'project_addresspoints' AS tbl, max(fetched_at), now() - max(fetched_at) AS age
FROM project_addresspoints;
```

Rows that pre-date the provenance migration have `fetched_at = NULL` (true fetch time unknown);
the next refresh stamps them.

#### Refresh cadence (G11)

A `pg_cron` job runs the full refresh monthly:

```text
jobname:  refresh-spatial-data-monthly
schedule: 0 17 1 * *      -- 17:00 UTC on the 1st (~03:00–04:00 AEST), low traffic
command:  SELECT public.refresh_spatial_data(true);
```

`refresh_spatial_data()` stamps `spatial_refresh_log.triggered_by = 'cron'` when run without a
JWT (i.e. by the scheduler) vs `'manual'` from the app. Operate it with:

```sql
-- inspect schedule + recent runs
SELECT * FROM cron.job WHERE jobname = 'refresh-spatial-data-monthly';
SELECT started_at, success, duration_seconds, record_counts FROM spatial_refresh_log ORDER BY id DESC LIMIT 10;

-- run now / change cadence / disable
SELECT public.refresh_spatial_data(true);
SELECT cron.schedule('refresh-spatial-data-monthly', '<cron expr>', $$SELECT public.refresh_spatial_data(true);$$);
SELECT cron.unschedule('refresh-spatial-data-monthly');
```

Cadastre changes (subdivision, re-survey, address re-allocation) propagate only at the next
refresh; monthly is ample for this reference data. Refresh is currently wholesale, not
incremental — `fetched_at`/`source_id` make a future incremental refresh feasible if volume grows.

### 3. Geoscape / PSMA — proxy + edge-cache (G8)

Geoscape tiles are **incidental basemap context**, not authoritative anchors, so they are _not_
persisted. The proxy (`api/geoscape/[layerId]/tiles/[z]/[x]/[y]` and `.../metadata`) keeps the
`PUBLIC_GEOSCAPE_GNAF_TILES_API_KEY` server-side and now sets HTTP cache headers so the CDN and
browser absorb repeat requests:

- tiles: `public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400` (browser 1 day,
  CDN 30 days); empty/error tiles `public, max-age=60`
- metadata: `public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600`

Content is non-sensitive public reference data, so a shared `public` cache is intentional even
though the route is auth-gated.

#### Licensing (G12) — assessed against actual usage

Assessed against the [licensing appendix](#appendix-source-data-licensing-opinion) below (AI research
opinion, not formal legal sign-off — sufficient to settle the engineering decision; the
tier/ToU confirmations below are escalated to the Geoscape account owner).

What the app actually uses (verified in code):

| Source                | Endpoint                                  | Used by                                                                             | Dataset                   | Persist + redistribute?                                                       |
| --------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| NSW SS                | ArcGIS REST (`portal.spatial.nsw.gov.au`) | `project_*` cache, address map property theme                                       | CC BY 4.0 (NSW Open Data) | **Yes** — attribution + currency date                                         |
| Geoscape geocoder     | `/v2/addresses/geocoder`                  | signup, my-property, admin addresses                                                | **G-NAF**                 | **Yes** — operational storage; API returns the attribution string (displayed) |
| Geoscape GNAF tiles   | `/v1/maps/.../gnaf/...`                   | address map GNAF layer                                                              | **G-NAF**, CC BY 4.0      | **Yes** (+ no mail-list compilation rule)                                     |
| ~~Geoscape cadastre~~ | `/api/geoscape/cadastre`                  | **none — dead v1 code** (`CadastreGeoJSON.svelte`, no importer; removed in Phase 6) | Commercial                | n/a — not used                                                                |

Conclusions:

- **No commercial-licensing blocker exists.** All live Geoscape usage is **G-NAF** (geocoder +
  tiles), which is open CC BY 4.0; property polygons come from **NSW SS** (also CC BY 4.0).
  Geoscape's _commercial_ cadastre/property/buildings are **not used** — the earlier "Derived
  Material" blocker was based on the assumption cadastre was consumed; it is not.
- **What Phase 5 persists is all NSW SS data → licence-clear.** Attribution + currency are wired:
  every NSW SS map shows a data attribution (`MapProfile.attribution` →
  `lib/map/profiles/attribution.ts`) and MapView appends the currency date from
  `/api/spatial-data-currency` (RPC `get_spatial_data_currency()`).
- **Geocoder results (coords, GNAF PID) may be stored** for operational use. The API returns a
  G-NAF licence `attribution` string which the app already displays
  (`CustomAddressManagementTab.svelte`). Obligation met.
- **No custom Geoscape agreement is needed** (that was only for cadastre, which is unused).

Remaining confirmations (account owner, not engineering — verify against the Geoscape Hub plan):

1. **Product tier** — confirm the geocoder/tiles plan is the **G-NAF** product (the returned
   G-NAF attribution indicates it). If the plan bundles commercial Geoscape datasets, re-check.
2. **Geocoding API Terms of Use** (separate from the data licence) — operational storage of
   looked-up results is fine; don't build a **bulk geocode database for redistribution**.
3. **G-NAF mail-compilation caveat** — don't compile addresses for mail-sending without verifying
   each is mail-capable (SOC does not).

### 4. Status

| Gap | Item                              | State                                                                                                                                                   |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G11 | Provenance columns on `project_*` | Done (`20260628100000_spatial_provenance.sql`)                                                                                                          |
| G11 | Scheduled `refresh_spatial_data`  | Done (`20260628101000_schedule_refresh_spatial_data.sql`, monthly)                                                                                      |
| G8  | Geoscape edge-cache headers       | Done (tiles + metadata `+server.ts`)                                                                                                                    |
| G8  | Geoscape cache-to-PostGIS         | Edge-cache the GNAF tiles; no commercial Geoscape data is consumed                                                                                      |
| G12 | Licensing for persistent caching  | Clear — all live sources are CC BY 4.0 (NSW SS + G-NAF); no commercial Geoscape data used. Open (account owner): confirm G-NAF tier + Geocoding API ToU |

---

## Property data-capture: design intent

Context: the My Property Map (`personal-profile/my-property/[propertyid]/my-map`) editing feature.
The original 1,873-line roadmap (`postgis-editing-workflow.md`) has been retired — its **DB layer
shipped** and its **frontend design was superseded** by the v2 capture components. This section
preserves the still-relevant intent and records where it landed.

**Goal:** PostGIS-powered editing — server-side geometry validation, snapping to the property
boundary, and merge of same-template features — integrated with existing RLS, form actions, toasts.

**As built (differs from the original component sketch):**

- Capture UI is the v2 engine's `capture/` components — `PropertyCaptureController.svelte`,
  `PropertyCaptureMap.svelte`, `snapping.ts` — **not** the roadmap's `LeafletDrawControl` /
  `LeafletValidationPanel` / `LeafletMergeControl` (those were never built).
- Server RPCs `validate_spatial_feature` + `merge_spatial_features` shipped in
  `20260628000000_spatial_validation.sql`; GeoJSON `upsert_spatial_feature` in
  `20260627002000_upsert_spatial_feature_geojson.sql`.
- PostGIS ops: `ST_GeomFromGeoJSON` → `ST_IsValid`/`ST_MakeValid`, `ST_Snap` to boundary,
  `ST_Union` for merges, topology checks (gaps/overlaps/self-intersection); RLS enforces
  property-level access; `SECURITY DEFINER` for controlled access. Enforce the 4326-in / 7844-store
  SRID contract on anything new.

**Still to build:** `snap_to_property_boundary` RPC; further `upsert_spatial_feature` hardening;
optional audit-trail table + composite GIST indexes for validation/merge performance (budget
<500 ms on complex geometries).

**Design principles:** server-side validation (PostGIS is the source of truth for geometry quality);
progressive enhancement (validation previews don't block the workflow); security-first (RLS +
`SECURITY DEFINER`); composable Leaflet controls; full TypeScript/GeoJSON typing; spatial indexes;
audit trail for compliance.

**Future (post-MVP):** split (cut-line) ops, undo/redo, bulk Shapefile/GeoJSON import, GeoPackage
export, PostGIS topology extension, offline/PWA sync, shared template library, AI-assisted digitising.

---

## Appendix: source-data licensing opinion

Condensed from an AI research opinion (**not** formal legal sign-off) on Geoscape/PSMA + NSW Spatial
Services terms. The engineering conclusion is in §3 (Geoscape / PSMA) above; this records the
underlying reasoning. Three tiers:

1. **NSW Spatial Services** — CC BY 4.0 (NSW Open Data). Persistent storage + redistribution
   permitted with attribution (`© Department of Customer Service [extraction date]`); show the
   currency date; comply with the Australian Privacy Principles.
2. **Geoscape open data** (G-NAF Core, Administrative Boundaries) — CC BY 4.0. Storable +
   redistributable with attribution. G-NAF caveat: don't compile addresses for mail-sending unless
   each is verified mail-capable.
3. **Geoscape commercial** (Buildings, Cadastre, Property) — restrictive. "Derived Material" is
   defined recursively, so even derived PostGIS geometry cannot be redistributed to end users.

**Outcome:** SOC uses only tiers 1–2 (NSW SS property polygons + G-NAF geocoder/tiles), so there is
no commercial blocker and no custom Geoscape agreement is required. The earlier "Derived Material"
concern assumed commercial cadastre was consumed; it is not.
