# GIS / Mapping — Design & Implementation Strategy

> **Status:** Draft for review · **Author:** audit + strategy pass · **Date:** 2026-06-26
> **Scope:** All map-bearing features in `soc-dev` — property data capture, community
> visualization, KYNG coordination, admin oversight, and source-data caching.
> **Companion docs:** [spatial-schema.md](./spatial-schema.md), [database.md](./database.md),
> [postgis-editing-workflow.md](./postgis-editing-workflow.md), [address-lookup.md](./address-lookup.md).

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

**Implication:** the validation/merge RPCs proposed in [postgis-editing-workflow.md](./postgis-editing-workflow.md)
(`validate_spatial_feature`, `merge_spatial_features`, enhanced `upsert_spatial_feature`) **do not
exist in any database yet** — they are a design, not deployed code. The strategy must treat them
as net-new work and target dev → newprod via migrations.

### 2.2 Two parallel frontend map architectures

> **Historical (pre-refactor snapshot).** As of Phase 6 the v1 stack described here has been
> **deleted**; the v2 engine (§4) is the only map system. Kept for rationale/context.

**v1 — component stack (in production use):**

- Map shell: [Leafletmap.svelte](../src/components/map/leaflet/Leafletmap.svelte) — `onMount` dynamic-imports `leaflet`, `esri-leaflet`, `leaflet-draw`, **and** `leaflet-editable`; publishes string context key `'leafletContext'` exposing getters (`getLeaflet`, `getLeafletMap`, `getLeafletLayers`, …).
- Layers: [layers/geojson/](../src/components/map/leaflet/layers/geojson/) (Point/Line/Polygon), [LeafletArcGISFeatureServerLayer.svelte](../src/components/map/leaflet/layers/LeafletArcGISFeatureServerLayer.svelte), and live-tile layers [layers/pbf-data/](../src/components/map/leaflet/layers/pbf-data/) (Cadastre/GNAF/Roads).
- Controls: attribute editor, delete editor, legend, scale, select-edit-layer.
- State + helpers: [spatialutilities.svelte.ts](../src/lib/leaflet/spatialutilities.svelte.ts) (module-level `$state`), `mapconfig.ts`, `symbol/*` generators, `geometryUtilities.ts`, `leafleteditutilities.ts`.
- **Consumers:** property data-capture `my-map`, community maps, KYNG, admin maps.

**v2 — config-driven stack (built, wired to nothing):**

- [createLeafletMap.ts](../src/lib/map/createLeafletMap.ts) — **Symbol** context key `LEAFLET_CONTEXT_KEY`, typed `registerLayer/unregisterLayer/updateLayer` API over a `$state` registry.
- [layer-factory.ts](../src/lib/map/layer-factory.ts) — factory helpers (`tileLayer`, `wmsLayer`, `geoJSON`, `marker`, ESRI base/feature/dynamic/image, `customLayer`).
- [layers/schemas/layer-config.types.ts](../src/lib/map/layers/schemas/layer-config.types.ts) — rich declarative `LayerConfig`: `source.rpcFunction` + cache hints, `styling` (static/dynamic/categorized/choropleth + hover/selection), `interaction` (popup/tooltip/sidePanel/click/hover), `query` (filters), `editing` (create/update/delete, snapping, snapLayers, per-property validation, CRUD RPC names), and a `PropertySchema` for forms.
- Config instances: [layers/configs/](../src/lib/map/layers/configs/) (`parcels`, `poi`, `roads`), `styles/*`, `templates/*`, `symbology-presets.ts`, `map-types.ts`.

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
   tree ([address-lookup.md](./address-lookup.md)) and **cached server-side** into
   `property_profile.geom`, `address_point_extract_wgs84`, `project_addresspoints`, and KYNG views
   (`saveextractedaddresspoints`, `get_registered_addresspoints`, `refresh_spatial_data`). Stored
   in **SRID 7844 (GDA2020)**.
2. **Geoscape / PSMA** — `api.psma.com.au/v1/maps/{layer}/{z}/{x}/{y}.pbf` (cadastre/roads/address
   vector tiles). Served through [geoscape.service.ts](../src/lib/server/services/geoscape.service.ts)
   and [api/geoscape/[layerId]/tiles/...](../src/routes/api/geoscape/) as a **live passthrough
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
  from [createLeafletMap.ts](../src/lib/map/createLeafletMap.ts). Retire the string-keyed
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
| G7  | Type defs scattered                                   | `lib/data`, `lib/map`                     | Med                 | **Done** — v1 dup type files removed; engine types via barrel [`lib/map/types.ts`](../src/lib/map/types.ts); data-shapes stay in `lib/data/spatial`               |
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
[source-data-lifecycle.md](./source-data-lifecycle.md).

**Phase 6 — Decommission v1 & document.** _Done._
The last three v1 holdouts were re-platformed onto the engine — the public About project map and
the admin KYNG-boundaries map (GeoJSON, on `siteStreetsProfile`), and the admin address-data map
(live ArcGIS + Geoscape GNAF layers, via the new MapView-child pattern in `lib/map/layers/live/`).
With no route importing them, `components/map/leaflet/*` (16 files) and `lib/leaflet/*` (19 files)
were deleted. Authoring guide added: [authoring-map-layers.md](./authoring-map-layers.md). The v2
stack is now the only map system.

---

## 7. Risks

- **Migration regressions** on live maps — mitigate by porting read-only routes first and keeping
  v1 in place until each route is verified.
- **PostGIS perf at scale** — validation/merge on complex geometries; budget <500ms, add the
  composite GIST indexes from [postgis-editing-workflow.md](./postgis-editing-workflow.md) §5.1.
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

### 9.2 Spatial RPCs to build (none exist yet)

`validate_spatial_feature`, `merge_spatial_features`, hardened `upsert_spatial_feature`
(see [postgis-editing-workflow.md](./postgis-editing-workflow.md) for reference implementations —
adjust to the 4326-in / 7844-store SRID contract before deploying).

### 9.3 Key files

> v1 (`components/map/leaflet/*`, `lib/leaflet/*`) was deleted in Phase 6 — the engine below is the
> only map system. Authoring guide: [authoring-map-layers.md](./authoring-map-layers.md).

- Engine shell: [MapView.svelte](../src/lib/map/MapView.svelte) (context in [createLeafletMap.ts](../src/lib/map/createLeafletMap.ts))
- Layer builder + renderer: [render/build-layer.ts](../src/lib/map/render/build-layer.ts), [render/](../src/lib/map/render/)
- Profiles: [profiles/](../src/lib/map/profiles/) (community, kyng, property-capture, site)
- Live/viewport layers: [layers/live/](../src/lib/map/layers/live/) (ArcGIS FeatureServer, Geoscape GNAF)
- Schema: [layer-config.types.ts](../src/lib/map/layers/schemas/layer-config.types.ts)
- Source caching: [geoscape.service.ts](../src/lib/server/services/geoscape.service.ts), [api/geoscape/](../src/routes/api/geoscape/); lifecycle in [source-data-lifecycle.md](./source-data-lifecycle.md)
- Data capture: [capture/](../src/lib/map/capture/) + [my-map/+page.server.ts](<../src/routes/(protected)/personal-profile/my-property/[propertyid]/my-map/+page.server.ts>)
