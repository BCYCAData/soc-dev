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
	import { buildLeafletLayer, getLegendSymbol } from '$lib/map/render/build-layer';
	import type {
		AddressSearchEntry,
		MapProfile,
		MapViewTarget,
		ResolvedLayer
	} from '$lib/map/profiles/types';

	interface AddressSearchConfig {
		entries: AddressSearchEntry[];
		placeholder?: string;
		minQueryLength?: number;
		maxResults?: number;
		position?: L.ControlPosition;
		noResultsText?: string;
		onSelect?: (entry: AddressSearchEntry, map: L.Map) => void;
	}

	interface Props {
		profile: MapProfile;
		view: MapViewTarget;
		layers: ResolvedLayer[];
		onReady?: (map: L.Map) => void;
		/** Enable Leaflet.Editable (drawing/geometry editing) on the map. */
		editable?: boolean;
		addressSearch?: AddressSearchConfig;
		class?: string;
		children?: Snippet;
	}

	let {
		profile,
		view,
		layers,
		onReady,
		editable = false,
		addressSearch,
		class: className = '',
		children
	}: Props = $props();

	// ── Per-map state (owned by the shell, not module singletons; see §4.2) ──
	let leaflet = $state<typeof L | undefined>(undefined);
	let map = $state<L.Map | undefined>(undefined);
	const registry = $state<MapLayerRegistry>({});

	// Non-reactive bookkeeping: layer id → the data reference last built from.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- intentionally non-reactive
	const builtFrom = new Map<string, GeoJSON.FeatureCollection | null>();
	const layerConfigs = new Map<string, ResolvedLayer['config']>();
	let layersControl: L.Control.Layers | undefined;
	let addressSearchControl: L.Control | undefined;
	let addressPointHighlightLayer: L.Layer | undefined;
	let legendContainer: HTMLDivElement | undefined;
	let updateLegendVisibility: (() => void) | undefined;
	let highlightedZoom = $state<number | undefined>(undefined);
	let mapZoom = $state<number | undefined>(undefined);
	let clearHighlightOnZoomChange: (() => void) | undefined;

	function normalizeSearchText(value: string) {
		return value.replace(/\s+/g, ' ').trim().toLowerCase();
	}

	function currentScaleLineMeters(m: L.Map): number {
		const { y } = m.getSize();
		const midY = y / 2;
		const left = m.containerPointToLatLng([0, midY]);
		const right = m.containerPointToLatLng([100, midY]);
		return m.distance(left, right);
	}

	function isLayerVisibleAtCurrentZoom(config: ResolvedLayer['config'], m: L.Map): boolean {
		const zoom = mapZoom ?? m.getZoom();
		if (config.display?.minZoom !== undefined && zoom < config.display.minZoom) return false;
		if (config.display?.maxZoom !== undefined && zoom > config.display.maxZoom) return false;
		if (config.display?.scaleLineMaxMeters !== undefined) {
			if (currentScaleLineMeters(m) > config.display.scaleLineMaxMeters) return false;
		}
		return true;
	}

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

	/** Make the credits (attribution) collapsible behind a persistent ⓘ toggle.
	 * Licensing: OSM's attribution guidelines require the credit to be visible on
	 * load, so it always starts expanded and only the user can collapse it — never
	 * auto-collapse or default to collapsed. The attribution element itself stays
	 * Leaflet-managed (only reparented into the wrapper), so base-layer switches
	 * and the data-currency update keep rendering into it. */
	function buildAttributionToggle(L: typeof import('leaflet'), m: L.Map) {
		const attribEl = m.attributionControl?.getContainer();
		if (!attribEl) return;

		const Toggle = L.Control.extend({
			options: { position: 'bottomright' },
			onAdd: () => {
				const wrap = L.DomUtil.create('div', 'mapview-attrib');
				wrap.appendChild(attribEl);
				const btn = L.DomUtil.create('button', 'mapview-attrib__toggle', wrap);
				btn.type = 'button';
				btn.textContent = 'i';
				const setCollapsed = (collapsed: boolean) => {
					wrap.classList.toggle('is-collapsed', collapsed);
					btn.setAttribute('aria-expanded', String(!collapsed));
					const label = collapsed ? 'Show map credits' : 'Hide map credits';
					btn.setAttribute('aria-label', label);
					btn.title = label;
				};
				setCollapsed(false);
				L.DomEvent.disableClickPropagation(wrap);
				L.DomEvent.on(btn, 'click', () => setCollapsed(!wrap.classList.contains('is-collapsed')));
				return wrap;
			}
		});
		const toggle = new Toggle().addTo(m);
		// Bottom corners stack newest-first; move the credits back to the very
		// bottom so profiles with a bottomright legend keep their order.
		const el = toggle.getContainer();
		el?.parentElement?.appendChild(el);
	}

	function buildLegend(L: typeof import('leaflet'), m: L.Map, position: L.ControlPosition) {
		const legend = new L.Control({ position });
		legend.onAdd = () => {
			const div = L.DomUtil.create('div', 'mapview-legend');
			legendContainer = div;
			for (const { config } of layers) {
				const symbol = getLegendSymbol(config);
				const row = L.DomUtil.create('div', 'mapview-legend__row', div);
				row.dataset.layerId = config.id;
				const swatch = L.DomUtil.create('span', 'mapview-legend__swatch', row);
				const glyph = L.DomUtil.create(
					'span',
					`mapview-legend__glyph mapview-legend__glyph--${symbol.kind}`,
					swatch
				);
				if (symbol.kind === 'point') {
					glyph.style.background = symbol.point.fillColor ?? '#3388ff';
					// Triangle glyphs draw via `border-bottom: ... currentColor` (see the
					// --triangle CSS), so carry the fill on `color` too.
					glyph.style.color = symbol.point.fillColor ?? '#3388ff';
					glyph.style.borderColor = symbol.point.color ?? 'rgba(0, 0, 0, 0.5)';
					glyph.style.borderWidth = `${symbol.point.weight ?? 1}px`;
					if (symbol.point.shape && symbol.point.shape !== 'circle') {
						glyph.classList.add(`mapview-legend__glyph--${symbol.point.shape}`);
					}
				} else if (symbol.kind === 'line') {
					glyph.style.background = symbol.line.color ?? '#3388ff';
					glyph.style.height = `${Math.max(symbol.line.weight ?? 2, 2)}px`;
				} else {
					const polygon = symbol.polygon;
					glyph.style.background = polygon.fillColor ?? 'transparent';
					glyph.style.borderColor = polygon.color ?? '#3388ff';
					glyph.style.borderWidth = `${polygon.weight ?? 1}px`;
					if ((polygon.fillOpacity ?? 1) === 0) {
						glyph.style.background = 'transparent';
					}
				}
				row.appendChild(document.createTextNode(config.name));
			}
			updateLegendVisibility = () => {
				if (!legendContainer) return;
				for (const row of legendContainer.querySelectorAll<HTMLElement>('.mapview-legend__row')) {
					const layerId = row.dataset.layerId;
					const config = layerId ? layerConfigs.get(layerId) : undefined;
					const shouldShow =
						!!config &&
						(config.display?.defaultVisible ?? true) &&
						isLayerVisibleAtCurrentZoom(config, m);
					row.style.display = shouldShow ? 'flex' : 'none';
				}
			};
			updateLegendVisibility();
			return div;
		};
		legend.addTo(m);
	}

	function buildAddressSearchControl(
		L: typeof import('leaflet'),
		m: L.Map,
		position: L.ControlPosition
	) {
		function clearAddressPointHighlight() {
			if (clearHighlightOnZoomChange) {
				m.off('zoomend', clearHighlightOnZoomChange);
				clearHighlightOnZoomChange = undefined;
			}
			if (addressPointHighlightLayer) {
				m.removeLayer(addressPointHighlightLayer);
				addressPointHighlightLayer = undefined;
			}
			highlightedZoom = undefined;
		}

		function highlightAddressPoint(entry: AddressSearchEntry) {
			if (!entry.highlightPoint) return;
			clearAddressPointHighlight();
			addressPointHighlightLayer = L.circleMarker(entry.highlightPoint, {
				radius: 10,
				color: '#f59e0b',
				weight: 3,
				fillColor: '#f59e0b',
				fillOpacity: 0.2,
				pane: 'markerPane'
			});
			addressPointHighlightLayer.addTo(m);
			if ('bringToFront' in addressPointHighlightLayer) {
				(addressPointHighlightLayer as L.Path).bringToFront();
			}
		}

		function lockHighlightToCurrentZoom() {
			highlightedZoom = m.getZoom();
			clearHighlightOnZoomChange = () => {
				if (highlightedZoom === undefined) return;
				if (m.getZoom() !== highlightedZoom) clearAddressPointHighlight();
			};
			m.on('zoomend', clearHighlightOnZoomChange);
		}

		const control = new L.Control({ position });
		let onDocumentClick: ((event: MouseEvent) => void) | undefined;
		control.onAdd = () => {
			const container = L.DomUtil.create('div', 'mapview-address-search');
			container.setAttribute('role', 'search');
			container.setAttribute('aria-label', 'Address search');
			container.classList.add('is-collapsed');

			const toggle = L.DomUtil.create('button', 'mapview-address-search__toggle', container);
			toggle.setAttribute('type', 'button');
			toggle.setAttribute('aria-label', 'Toggle address search');
			toggle.setAttribute('aria-expanded', 'false');
			const glyph = L.DomUtil.create('span', 'mapview-address-search__glyph', toggle);
			glyph.setAttribute('aria-hidden', 'true');

			const panel = L.DomUtil.create('div', 'mapview-address-search__panel', container);
			const topRow = L.DomUtil.create('div', 'mapview-address-search__top', panel);
			const input = L.DomUtil.create('input', 'mapview-address-search__input', topRow);
			input.setAttribute('type', 'text');
			input.setAttribute('placeholder', addressSearch?.placeholder ?? 'Search address');
			input.setAttribute('aria-label', 'Search address');

			const clear = L.DomUtil.create('button', 'mapview-address-search__clear', topRow);
			clear.setAttribute('type', 'button');
			clear.setAttribute('aria-label', 'Clear search');
			clear.textContent = 'Clear';

			const results = L.DomUtil.create('ul', 'mapview-address-search__results', panel);
			results.setAttribute('role', 'listbox');

			L.DomEvent.disableClickPropagation(container);
			L.DomEvent.disableScrollPropagation(container);

			let filtered: AddressSearchEntry[] = [];
			let selectedIndex = -1;
			let collapsed = true;

			const minQueryLength = () => addressSearch?.minQueryLength ?? 2;
			const maxResults = () => addressSearch?.maxResults ?? 12;
			const allEntries = () => addressSearch?.entries ?? [];

			function setCollapsed(next: boolean) {
				collapsed = next;
				container.classList.toggle('is-collapsed', collapsed);
				toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
				if (collapsed) {
					results.style.display = 'none';
				} else {
					input.focus();
				}
			}

			function select(entry: AddressSearchEntry) {
				input.value = entry.label;
				highlightAddressPoint(entry);
				if (entry.zoomBounds) {
					m.fitBounds(entry.zoomBounds, {
						padding: [24, 24],
						maxZoom: entry.zoomMax ?? 18
					});
					m.once('moveend', lockHighlightToCurrentZoom);
				} else {
					lockHighlightToCurrentZoom();
				}
				addressSearch?.onSelect?.(entry, m);
				results.style.display = 'none';
				results.innerHTML = '';
				selectedIndex = -1;
				setCollapsed(true);
			}

			function renderResults() {
				results.innerHTML = '';
				if (!filtered.length) {
					const noResult = L.DomUtil.create('li', 'mapview-address-search__item', results);
					noResult.textContent = addressSearch?.noResultsText ?? 'No matching addresses';
					results.style.display = 'block';
					return;
				}
				for (const [index, entry] of filtered.entries()) {
					const item = L.DomUtil.create('li', 'mapview-address-search__item', results);
					if (index === selectedIndex) item.classList.add('is-active');
					const button = L.DomUtil.create('button', 'mapview-address-search__option', item);
					button.setAttribute('type', 'button');
					button.setAttribute('role', 'option');
					button.textContent = entry.label;
					button.addEventListener('click', () => select(entry));
				}
				results.style.display = 'block';
			}

			function runFilter() {
				const query = normalizeSearchText(input.value);
				if (query.length < minQueryLength()) {
					results.style.display = 'none';
					results.innerHTML = '';
					selectedIndex = -1;
					return;
				}
				filtered = allEntries()
					.filter((entry) => {
						const haystack = normalizeSearchText(
							[entry.label, ...(entry.keywords ?? [])].join(' ')
						);
						return haystack.includes(query);
					})
					.slice(0, maxResults());
				selectedIndex = filtered.length ? 0 : -1;
				renderResults();
			}

			input.addEventListener('input', runFilter);
			input.addEventListener('keydown', (event) => {
				if (event.key === 'ArrowDown') {
					event.preventDefault();
					if (!filtered.length) return;
					selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1);
					renderResults();
					return;
				}
				if (event.key === 'ArrowUp') {
					event.preventDefault();
					if (!filtered.length) return;
					selectedIndex = Math.max(selectedIndex - 1, 0);
					renderResults();
					return;
				}
				if (event.key === 'Enter') {
					event.preventDefault();
					const query = normalizeSearchText(input.value);
					const exactMatches = allEntries().filter(
						(entry) => normalizeSearchText(entry.label) === query
					);
					if (exactMatches.length === 1) {
						select(exactMatches[0]);
						return;
					}
					if (selectedIndex < 0 || selectedIndex >= filtered.length) return;
					select(filtered[selectedIndex]);
					return;
				}
				if (event.key === 'Escape') {
					event.preventDefault();
					input.value = '';
					results.style.display = 'none';
					results.innerHTML = '';
					selectedIndex = -1;
				}
			});

			clear.addEventListener('click', () => {
				input.value = '';
				results.style.display = 'none';
				results.innerHTML = '';
				selectedIndex = -1;
				input.focus();
			});

			toggle.addEventListener('click', () => {
				setCollapsed(!collapsed);
			});

			onDocumentClick = (event: MouseEvent) => {
				if (!container.contains(event.target as Node)) {
					setCollapsed(true);
				}
			};
			document.addEventListener('click', onDocumentClick);

			return container;
		};
		control.onRemove = () => {
			clearAddressPointHighlight();
			if (onDocumentClick) document.removeEventListener('click', onDocumentClick);
		};
		control.addTo(m);
		return control;
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
			mapZoom = m.getZoom();
			m.on('zoomend', () => {
				mapZoom = m.getZoom();
			});

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
			const searchControlPosition = addressSearch?.position ?? profile.controls.addressSearch;
			if (searchControlPosition && addressSearch) {
				addressSearchControl = buildAddressSearchControl(L, m, searchControlPosition);
			}

			// Data-source attribution (distinct from basemap-tile attribution). Required by
			// the NSW SS CC BY 4.0 licence; the currency date is appended once fetched.
			if (profile.attribution && profile.controls.attribution !== false) {
				m.attributionControl.addAttribution(profile.attribution);
				if (profile.showDataCurrency) addDataCurrency(m, profile.attribution);
			}
			if (profile.controls.attribution !== false) {
				buildAttributionToggle(L, m);
			}

			leaflet = L;
			map = m;
			onReady?.(m);
		})();

		return () => {
			cancelled = true;
			legendContainer = undefined;
			updateLegendVisibility = undefined;
			layersControl = undefined;
			addressSearchControl?.remove();
			addressSearchControl = undefined;
			builtFrom.clear();
			layerConfigs.clear();
			map?.remove();
			map = undefined;
			mapZoom = undefined;
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
			layerConfigs.clear();
			for (const rl of desired) layerConfigs.set(rl.config.id, rl.config);
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
					visible:
						(rl.config.display?.defaultVisible ?? true) &&
						isLayerVisibleAtCurrentZoom(rl.config, m),
					leafletLayer
				});
				builtFrom.set(id, rl.data);
			}
			updateLegendVisibility?.();
		})();

		return () => {
			active = false;
		};
	});

	$effect(() => {
		const m = map;
		const zoom = mapZoom;
		if (!m || zoom === undefined) return;

		for (const [id, config] of layerConfigs.entries()) {
			updateLayer(id, {
				visible: (config.display?.defaultVisible ?? true) && isLayerVisibleAtCurrentZoom(config, m)
			});
		}
		updateLegendVisibility?.();
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
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 14px;
		flex: 0 0 18px;
	}
	:global(.mapview-legend__glyph) {
		display: inline-block;
		box-sizing: border-box;
	}
	:global(.mapview-legend__glyph--polygon) {
		width: 16px;
		height: 12px;
		border-style: solid;
		border-radius: 2px;
	}
	:global(.mapview-legend__glyph--line) {
		width: 16px;
		border-radius: 999px;
	}
	:global(.mapview-legend__glyph--point) {
		width: 10px;
		height: 10px;
		border-style: solid;
		border-radius: 999px;
	}
	:global(.mapview-legend__glyph--square) {
		border-radius: 2px;
	}
	:global(.mapview-legend__glyph--diamond) {
		transform: rotate(45deg);
		border-radius: 1px;
	}
	:global(.mapview-legend__glyph--triangle) {
		width: 0;
		height: 0;
		background: transparent !important;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-bottom: 10px solid currentColor;
	}
	:global(.mapview-address-search) {
		min-width: 280px;
		max-width: min(90vw, 360px);
		background: var(--color-surface-100);
		color: var(--color-surface-900);
		padding: 8px;
		border-radius: 6px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: flex-start;
		gap: 6px;
	}
	:global(.mapview-address-search.is-collapsed) {
		min-width: 0;
		max-width: none;
		padding: 6px;
	}
	:global(.dark .mapview-address-search) {
		background: var(--color-surface-800);
		color: var(--color-surface-50);
	}
	:global(.mapview-address-search__toggle) {
		width: 32px;
		height: 32px;
		border-radius: 4px;
		border: 1px solid color-mix(in srgb, var(--color-surface-700) 35%, transparent);
		background: var(--color-surface-200);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}
	:global(.dark .mapview-address-search__toggle) {
		background: var(--color-surface-700);
	}
	:global(.mapview-address-search__glyph) {
		position: relative;
		width: 14px;
		height: 14px;
	}
	:global(.mapview-address-search__glyph::before) {
		content: '';
		position: absolute;
		inset: 0;
		border: 2px solid currentColor;
		border-radius: 50%;
	}
	:global(.mapview-address-search__glyph::after) {
		content: '';
		position: absolute;
		width: 6px;
		height: 2px;
		background: currentColor;
		bottom: -1px;
		right: -3px;
		transform: rotate(45deg);
		transform-origin: left center;
	}
	:global(.mapview-address-search__panel) {
		flex: 1;
		min-width: 0;
	}
	:global(.mapview-address-search.is-collapsed .mapview-address-search__panel) {
		display: none;
	}
	:global(.mapview-address-search__top) {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	:global(.mapview-address-search__input) {
		flex: 1;
		padding: 6px 8px;
		border: 1px solid color-mix(in srgb, var(--color-surface-700) 35%, transparent);
		border-radius: 4px;
		background: var(--color-surface-50);
		color: inherit;
	}
	:global(.dark .mapview-address-search__input) {
		background: var(--color-surface-900);
	}
	:global(.mapview-address-search__clear) {
		padding: 6px 8px;
		font-size: 0.75rem;
		border-radius: 4px;
		border: 1px solid color-mix(in srgb, var(--color-surface-700) 35%, transparent);
		background: var(--color-surface-200);
		cursor: pointer;
	}
	:global(.dark .mapview-address-search__clear) {
		background: var(--color-surface-700);
		color: var(--color-surface-50);
	}
	:global(.mapview-address-search__results) {
		list-style: none;
		margin: 6px 0 0;
		padding: 0;
		max-height: 220px;
		overflow: auto;
		display: none;
		border: 1px solid color-mix(in srgb, var(--color-surface-700) 25%, transparent);
		border-radius: 4px;
		background: var(--color-surface-50);
	}
	:global(.dark .mapview-address-search__results) {
		background: var(--color-surface-900);
	}
	:global(.mapview-address-search__item) {
		margin: 0;
	}
	:global(.mapview-address-search__option) {
		display: block;
		width: 100%;
		text-align: left;
		padding: 8px;
		border: 0;
		background: transparent;
		color: inherit;
		cursor: pointer;
	}
	:global(.mapview-address-search__item + .mapview-address-search__item) {
		border-top: 1px solid color-mix(in srgb, var(--color-surface-700) 20%, transparent);
	}
	:global(.mapview-address-search__item.is-active .mapview-address-search__option) {
		background: color-mix(in srgb, var(--color-primary-500) 22%, transparent);
	}
	:global(.leaflet-control-attribution) {
		max-width: min(60vw, 460px);
		white-space: normal;
		line-height: 1.35;
		text-wrap: balance;
	}
	:global(.leaflet-control-attribution a) {
		word-break: break-word;
	}
	:global(.mapview-attrib) {
		display: flex;
		align-items: flex-end;
		gap: 4px;
	}
	/* Extra .mapview-root class so this outranks leaflet.css's corner margins
	   (leaflet.css is dynamically imported after component styles). Keeps the
	   credits flush in the corner like the stock control. */
	:global(.mapview-root .mapview-attrib.leaflet-control) {
		margin: 0;
	}
	:global(.mapview-attrib__toggle) {
		width: 20px;
		height: 20px;
		flex: 0 0 20px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		margin: 0 2px 2px 0;
		border: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.8);
		color: #333;
		font:
			italic bold 12px/1 Georgia,
			'Times New Roman',
			serif;
		cursor: pointer;
	}
	:global(.mapview-attrib.is-collapsed .leaflet-control-attribution) {
		display: none;
	}
</style>
