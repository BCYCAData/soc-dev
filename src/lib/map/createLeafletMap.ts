import {
	hasSetOpacity,
	hasSetZIndex,
	type MapLayerDescriptor,
	type MapLayerRegistry
} from '$lib/map/map-types';

import { setContext } from 'svelte';
import type L from 'leaflet';

export interface LeafletInitOptions {
	center?: [number, number];
	zoom?: number;
	mapDiv: HTMLElement;
	mapState: ReturnType<typeof $state<L.Map | null>>; // Receive the reactive map reference
}

// Use a symbol for the context key to avoid collisions
export const LEAFLET_CONTEXT_KEY = Symbol('leafletContext');

export type LeafletContext = {
	getLeaflet: () => typeof L | undefined;
	getLeafletMap: () => L.Map | undefined;
	getLeafletLayers: () => MapLayerRegistry;
	registerLayer: (layer: MapLayerDescriptor) => void;
	unregisterLayer: (id: string) => void;
	updateLayer: (id: string, patch: Partial<MapLayerDescriptor>) => void;
};

/**
 * Creates a Leaflet map and exposes typed registration API.
 * Uses dynamic imports so it is safe in SSR.
 */
export async function createLeafletMap({ center = [0, 0], zoom = 2, mapDiv }: LeafletInitOptions) {
	const leafletModule = await import('leaflet');
	await import('leaflet/dist/leaflet.css');

	const leaflet = leafletModule.default; // Handle default export if needed
	const map = leaflet.map(mapDiv).setView(center, zoom);

	leaflet
		.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OSM contributors'
		})
		.addTo(map);

	// Local reactive state for layers
	const layers = $state<MapLayerRegistry>({});

	function registerLayer(layer: MapLayerDescriptor) {
		layers[layer.id] = layer;
		if (layer.visible !== false && layer.leafletLayer) {
			layer.leafletLayer.addTo(map);
		}
	}

	function unregisterLayer(id: string) {
		const l = layers[id];
		if (!l) return;
		if (l.leafletLayer) map.removeLayer(l.leafletLayer);
		delete layers[id];
	}

	function updateLayer(id: string, patch: Partial<MapLayerDescriptor>) {
		const l = layers[id];
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

	// Set context with getters for encapsulation
	setContext<LeafletContext>(LEAFLET_CONTEXT_KEY, {
		getLeaflet: () => leaflet,
		getLeafletMap: () => map,
		getLeafletLayers: () => layers,
		registerLayer,
		unregisterLayer,
		updateLayer
	});

	console.log('Map created', map);

	return { leaflet, map, layers, registerLayer, unregisterLayer, updateLayer };
}
