# Source-data lifecycle

How external geometry enters, is cached in, refreshes within, and is served from the SOC
database. This is the Phase 5 ("caching hardening") deliverable of
[gis-mapping-strategy.md](./gis-mapping-strategy.md) and resolves gaps **G8** (Geoscape
caching) and **G11** (provenance + refresh policy).

## 1. Sources

| Source                        | Endpoint                                                  | What                                                                     | How it enters                                                         | Cache                                                 |
| ----------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- | ----------------------------------------------------- |
| **NSW Spatial Services (SS)** | `portal.spatial.nsw.gov.au/server/rest/...` (ArcGIS REST) | Cadastre / property, address points, address strings, proways, waypoints | `refresh_spatial_data()` → `extract_*()` (server-side `http_*` calls) | **Cached to PostGIS** (`project_*` tables), SRID 7844 |
| **Geoscape / PSMA**           | `api.psma.com.au/v1/maps/{layer}/{z}/{x}/{y}.pbf`         | Incidental basemap vector tiles (address / roads / parcels)              | `api/geoscape/[layerId]/tiles/...` proxy → `geoscape.service.ts`      | **Proxy + HTTP edge-cache** (not persisted)           |

SRID contract is uniform: **store 7844 (GDA2020), serve 4326 (WGS84) to Leaflet, transform at
the RPC boundary.** See [gis-mapping-strategy.md §4.5](./gis-mapping-strategy.md).

## 2. NSW SS — cache to PostGIS

### Why cache (not proxy)

Authoritative, slowly-changing reference data; rate-limited and latency-variable upstream; the
property boundary cached at signup is the immutable anchor for PostGIS RLS/joins and for
property-feature validation. Caching collapses N user views into one fetch.

### Cached tables

`project_addresspoints`, `project_waypoints`, `project_proways`, `project_properties`,
`project_properties_singlepart`. Each is repopulated **wholesale** (`TRUNCATE` + `INSERT`) by its
`extract_*()` function; `refresh_spatial_data()` orchestrates all five with retry/backoff and
writes a row to `spatial_refresh_log`.

### Provenance (G11)

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

### Refresh cadence (G11)

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

## 3. Geoscape / PSMA — proxy + edge-cache (G8)

Geoscape tiles are **incidental basemap context**, not authoritative anchors, so they are _not_
persisted. The proxy (`api/geoscape/[layerId]/tiles/[z]/[x]/[y]` and `.../metadata`) keeps the
`PUBLIC_GEOSCAPE_GNAF_TILES_API_KEY` server-side and now sets HTTP cache headers so the CDN and
browser absorb repeat requests:

- tiles: `public, max-age=86400, s-maxage=2592000, stale-while-revalidate=86400` (browser 1 day,
  CDN 30 days); empty/error tiles `public, max-age=60`
- metadata: `public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600`

Content is non-sensitive public reference data, so a shared `public` cache is intentional even
though the route is auth-gated.

### Licensing (G12) — assessed against actual usage

Assessed against [licensing-opinion-claude.md](./licensing-opinion-claude.md) (AI research
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

## 4. Status

| Gap | Item                              | State                                                                                                                                                   |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G11 | Provenance columns on `project_*` | Done (`20260628100000_spatial_provenance.sql`)                                                                                                          |
| G11 | Scheduled `refresh_spatial_data`  | Done (`20260628101000_schedule_refresh_spatial_data.sql`, monthly)                                                                                      |
| G8  | Geoscape edge-cache headers       | Done (tiles + metadata `+server.ts`)                                                                                                                    |
| G8  | Geoscape cache-to-PostGIS         | Edge-cache the GNAF tiles; no commercial Geoscape data is consumed                                                                                      |
| G12 | Licensing for persistent caching  | Clear — all live sources are CC BY 4.0 (NSW SS + G-NAF); no commercial Geoscape data used. Open (account owner): confirm G-NAF tier + Geocoding API ToU |
