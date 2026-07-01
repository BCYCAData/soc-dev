<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';
	import type L from 'leaflet';

	import { LEAFLET_CONTEXT_KEY, type LeafletContext } from '$lib/map/createLeafletMap';
	import {
		hasSetOpacity,
		hasSetZIndex,
		type MapLayerDescriptor,
		type MapLayerRegistry
	} from '$lib/map/map-types';
	import { buildLeafletLayer, legendColor } from '$lib/map/render/build-layer';
	import type { MapProfile, MapViewTarget, ResolvedLayer } from '$lib/map/profiles/types';

	interface Props {
		profile: MapProfile;
		view: MapViewTarget;
		layers: ResolvedLayer[];
		onReady?: (map: L.Map) => void;
		/** Enable Leaflet.Editable (drawing/geometry editing) on the map. */
		editable?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		profile,
		view,
		layers,
		onReady,
		editable = false,
		class: className = '',
		children
	}: Props = $props();

	// ── Per-map state (owned by the shell, not module singletons; see §4.2) ──
	let leaflet = $state<typeof L | undefined>(undefined);
	let map = $state<L.Map | undefined>(undefined);
	const registry = $state<MapLayerRegistry>({});

	// Non-reactive bookkeeping: layer id → the data reference last built from.
	const builtFrom = new Map<string, GeoJSON.FeatureCollection | null>();
	let layersControl: L.Control.Layers | undefined;

	// ── Typed registration API (kept on the v2 Symbol context) ──
	function registerLayer(layer: MapLayerDescriptor) {
		registry[layer.id] = layer;
		if (layer.visible !== false && layer.leafletLayer && map) {
			layer.leafletLayer.addTo(map);
		}
		if (layersControl && layer.leafletLayer) {
			layersControl.addOverlay(layer.leafletLayer, layer.name ?? layer.id);
		}
	}

	function unregisterLayer(id: string) {
		const l = registry[id];
		if (!l) return;
		if (l.leafletLayer) {
			if (map) map.removeLayer(l.leafletLayer);
			if (layersControl) layersControl.removeLayer(l.leafletLayer);
		}
		delete registry[id];
	}

	function updateLayer(id: string, patch: Partial<MapLayerDescriptor>) {
		const l = registry[id];
		if (!l) return;
		Object.assign(l, patch);
		if (!map || !l.leafletLayer) return;
		if ('visible' in patch) {
			if (patch.visible) l.leafletLayer.addTo(map);
			else map.removeLayer(l.leafletLayer);
		}
		if ('opacity' in patch && hasSetOpacity(l.leafletLayer)) {
			l.leafletLayer.setOpacity(patch.opacity ?? 1);
		}
		if ('zIndex' in patch && hasSetZIndex(l.leafletLayer)) {
			l.leafletLayer.setZIndex(patch.zIndex ?? 0);
		}
	}

	// Context is set synchronously during init (Svelte requirement). Consumers
	// read the live map/leaflet through getters, so null-until-ready is fine.
	setContext<LeafletContext>(LEAFLET_CONTEXT_KEY, {
		getLeaflet: () => leaflet,
		getLeafletMap: () => map,
		getLeafletLayers: () => registry,
		registerLayer,
		unregisterLayer,
		updateLayer
	});

	/** Fetch the cached-data currency and fold the "as at" date into the data
	 * attribution. Best-effort: on failure or null (no refresh yet) the base
	 * attribution already stands, so we leave it unchanged. */
	async function addDataCurrency(m: L.Map, baseAttribution: string) {
		try {
			const res = await fetch('/api/spatial-data-currency');
			if (!res.ok) return;
			const { currency } = (await res.json()) as { currency: string | null };
			if (!currency) return;
			const asAt = new Date(currency).toLocaleDateString('en-AU', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
			m.attributionControl.removeAttribution(baseAttribution);
			m.attributionControl.addAttribution(`${baseAttribution} (as at ${asAt})`);
		} catch {
			// Network/parse failure — keep the date-less attribution.
		}
	}

	function buildLegend(L: typeof import('leaflet'), m: L.Map, position: L.ControlPosition) {
		const legend = new L.Control({ position });
		legend.onAdd = () => {
			const div = L.DomUtil.create('div', 'mapview-legend');
			for (const { config } of layers) {
				const row = L.DomUtil.create('div', 'mapview-legend__row', div);
				const swatch = L.DomUtil.create('span', 'mapview-legend__swatch', row);
				swatch.style.background = legendColor(config);
				row.appendChild(document.createTextNode(config.name));
			}
			return div;
		};
		legend.addTo(m);
	}

	/** Bind Leaflet to the DOM node: create the map, base layers, controls and
	 * view once, then tear it down on unmount. Layers are synced reactively (below). */
	function initMap(node: HTMLElement) {
		let cancelled = false;

		(async () => {
			const mod = await import('leaflet');
			await import('leaflet/dist/leaflet.css');
			// Leaflet.Editable augments L.Map; must load before map creation so the
			// `editable` option wires up map.editTools.
			if (editable) await import('leaflet-editable');
			if (cancelled) return;
			const L = (mod.default ?? mod) as typeof import('leaflet');

			// `zoomable: false` means a fully static map — disable every interaction
			// handler (drag/scroll/dblclick/box/touch/keyboard), not just the zoom buttons.
			const interactive = profile.view?.zoomable !== false;
			const m = L.map(node, {
				attributionControl: profile.controls.attribution !== false,
				zoomSnap: profile.view?.zoomSnap ?? 0.25,
				zoomControl: interactive,
				dragging: interactive,
				scrollWheelZoom: interactive,
				doubleClickZoom: interactive,
				boxZoom: interactive,
				touchZoom: interactive,
				keyboard: interactive,
				editable
			} as L.MapOptions);

			// Base layers
			const baseLayersForControl: Record<string, L.Layer> = {};
			let firstBase: L.TileLayer | undefined;
			for (const b of profile.baseLayers) {
				const tile = L.tileLayer(b.url, { attribution: b.attribution, ...(b.options ?? {}) });
				baseLayersForControl[b.name] = tile;
				if (!firstBase || b.visible) firstBase = firstBase && !b.visible ? firstBase : tile;
			}
			firstBase?.addTo(m);

			// View target
			if (view.extent) {
				m.fitBounds(view.extent);
			} else if (view.center) {
				m.setView(view.center, view.zoom ?? profile.view?.defaultZoom ?? 13);
			} else {
				m.setView([0, 0], 2);
			}

			// Controls
			if (profile.controls.layers) {
				layersControl = L.control
					.layers(baseLayersForControl, {}, { position: profile.controls.layers })
					.addTo(m);
			}
			if (profile.controls.scale) {
				L.control.scale({ position: profile.controls.scale }).addTo(m);
			}
			if (profile.controls.legend) {
				buildLegend(L, m, profile.controls.legend);
			}

			// Data-source attribution (distinct from basemap-tile attribution). Required by
			// the NSW SS CC BY 4.0 licence; the currency date is appended once fetched.
			if (profile.attribution && profile.controls.attribution !== false) {
				m.attributionControl.addAttribution(profile.attribution);
				if (profile.showDataCurrency) addDataCurrency(m, profile.attribution);
			}

			leaflet = L;
			map = m;
			onReady?.(m);
		})();

		return () => {
			cancelled = true;
			layersControl = undefined;
			builtFrom.clear();
			map?.remove();
			map = undefined;
			leaflet = undefined;
			for (const id of Object.keys(registry)) delete registry[id];
		};
	}

	// Reconcile the `layers` prop into the live map whenever it (or the map) changes.
	$effect(() => {
		const m = map;
		const L = leaflet;
		const desired = layers;
		if (!m || !L) return;

		let active = true;
		(async () => {
			// Diff against `builtFrom` (non-reactive) so this effect never reads the
			// `registry` $state it writes to — avoiding a self-triggering re-run.
			const desiredIds = new Set(desired.map((d) => d.config.id));
			for (const id of [...builtFrom.keys()]) {
				if (!desiredIds.has(id)) {
					unregisterLayer(id);
					builtFrom.delete(id);
				}
			}
			for (const rl of desired) {
				const id = rl.config.id;
				if (builtFrom.has(id) && builtFrom.get(id) === rl.data) continue; // unchanged
				const leafletLayer = await buildLeafletLayer(L, rl.config, rl.data);
				if (!active) return;
				if (builtFrom.has(id)) unregisterLayer(id);
				registerLayer({
					id,
					name: rl.config.name,
					type: 'geojson',
					visible: rl.config.display?.defaultVisible ?? true,
					leafletLayer
				});
				builtFrom.set(id, rl.data);
			}
		})();

		return () => {
			active = false;
		};
	});
</script>

<div class="mapview-root {className}">
	<div class="mapview-canvas" {@attach initMap}></div>
	{@render children?.()}
</div>

<style>
	.mapview-root {
		position: relative;
		height: 100%;
		width: 100%;
	}
	.mapview-canvas {
		height: 100%;
		width: 100%;
	}
	:global(.mapview-legend) {
		/* Theme surface tokens so the legend follows light/dark mode (the `.dark`
		 * class flips these) instead of staying white with invisible text. */
		background: var(--color-surface-100);
		color: var(--color-surface-900);
		padding: 6px 8px;
		border-radius: 4px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
		font-size: 0.8rem;
		line-height: 1.4;
	}
	:global(.dark .mapview-legend) {
		background: var(--color-surface-800);
		color: var(--color-surface-50);
	}
	:global(.mapview-legend__row) {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	:global(.mapview-legend__swatch) {
		display: inline-block;
		width: 12px;
		height: 12px;
		border: 1px solid rgba(0, 0, 0, 0.4);
		border-radius: 2px;
	}
</style>
