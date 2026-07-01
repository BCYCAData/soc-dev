# Authoring a map: profiles, LayerConfigs and live layers

The SOC map stack is a single declarative engine ("v2"): one `MapView` shell driven by a
**profile** (the map's purpose: basemaps, controls, view, attribution) plus a list of
**LayerConfig + data** pairs (`ResolvedLayer[]`). This guide shows how to add a new map or
layer. Background/rationale: [gis-mapping-strategy.md](./gis-mapping-strategy.md).

Key files:

- Engine shell — [MapView.svelte](../src/lib/map/MapView.svelte)
- Layer builder — [render/build-layer.ts](../src/lib/map/render/build-layer.ts)
- Profile types — [profiles/types.ts](../src/lib/map/profiles/types.ts)
- LayerConfig schema — [layers/schemas/layer-config.types.ts](../src/lib/map/layers/schemas/layer-config.types.ts)
- Example profiles — [profiles/community.ts](../src/lib/map/profiles/community.ts), [profiles/kyng.ts](../src/lib/map/profiles/kyng.ts), [profiles/site.ts](../src/lib/map/profiles/site.ts)

## 1. The shape of a map

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

## 2. Writing a profile

A `MapProfile` (see `profiles/types.ts`) declares basemaps + controls + view + attribution:

```ts
export const myProfile: MapProfile = {
	id: 'my-map',
	baseLayers: [{ id: 'nsw-streets', name: 'NSW Streets', url: NSW_STREETS_URL,
		attribution: NSW_SS_BASEMAP_ATTRIBUTION, visible: true }],
	controls: { scale: 'bottomleft', legend: 'bottomright', layers: 'topright', attribution: true },
	attribution: NSW_SS_DATA_ATTRIBUTION, // data-source attribution (see §5)
	showDataCurrency: true,               // appends the cached-data "as at" date
	view: { zoomSnap: 0.25, zoomable: true }
};
```

Reuse the shared attribution constants in [profiles/attribution.ts](../src/lib/map/profiles/attribution.ts)
for any map showing NSW Spatial Services data.

## 3. Writing a LayerConfig

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

### Tooltip/popup templates — escape interpolated values

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

## 4. Live / viewport-driven layers (ArcGIS, tiles)

Declarative `LayerConfig`s are for data fetched once and handed in. For layers that re-fetch on
pan/zoom (e.g. an ArcGIS FeatureServer, or Geoscape vector tiles), write a **child component** that
consumes the map context and mount it inside `<MapView>`:

```svelte
<MapView profile={addressMapProfile} view={{ center, zoom }} layers={[]} onReady={(m) => (map = m)}>
	<ArcGisFeatureLayer ready={mapReady} url={URL} name="Property Theme" popupTemplate={...} />
	<GnafAddressLayer ready={mapReady} />
</MapView>
```

A live layer (see [layers/live/](../src/lib/map/layers/live/)) reads the context, gates init on a
`ready` prop, builds its own Leaflet layer, and registers it via `ctx.registerLayer(...)` so it
appears in the layers control; it `unregisterLayer`s on destroy:

```ts
const ctx = getContext<LeafletContext>(LEAFLET_CONTEXT_KEY);
$effect(() => {
	if (!ready || initialized) return;
	const L = ctx.getLeaflet(); const map = ctx.getLeafletMap();
	if (!L || !map) return;
	initialized = true;
	/* build layer, attach map.on('moveend', …), ctx.registerLayer({ id, name, type, visible, leafletLayer }) */
});
onDestroy(() => ctx.unregisterLayer(id));
```

## 5. Checklist for a new map

1. Server load returns 4326 GeoJSON (+ an extent).
2. Profile chosen/created; NSW SS data attribution set if applicable.
3. LayerConfig(s) authored; templates escape values.
4. Dense point layers set `display.cluster`.
5. `npm run check` clean; run the svelte autofixer on new components.
6. Verify in the browser (render, layer control, tooltips, dark mode, teardown between maps).
