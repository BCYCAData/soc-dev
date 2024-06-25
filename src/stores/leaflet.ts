import { writable } from 'svelte/store';

import type L from 'leaflet';
import type { Geometry } from 'geojson';

type LayerDefinition = {
	layer: L.TileLayer | L.GeoJSON<any, Geometry>;
	name: string;
};
type ControlLayersStore = {
	baseMaps: LayerDefinition[];
	overlayMaps: LayerDefinition[];
};

export const tileLayersStore = writable<
	Record<
		string,
		{ layer: L.TileLayer; layerMode: 'baseMaps' | 'overlayMaps' | 'fixedMap'; layerName: string }
	>
>({});

export const geoJSONLayersStore = writable<
	Record<
		string,
		{
			layer: L.GeoJSON<any, Geometry>;
			layerMode: 'baseMaps' | 'overlayMaps' | 'fixedMap';
			layerName: string;
		}
	>
>({});

export const controlLayersStore = writable<ControlLayersStore>({
	baseMaps: [],
	overlayMaps: []
});

export function addOrUpdateLayer(
	mapType: 'baseMaps' | 'overlayMaps',
	layer: LayerDefinition
): void {
	// if (mapType === 'baseMaps' || mapType === 'overlayMaps') {
	controlLayersStore.update((currentState: ControlLayersStore) => {
		const index = currentState[mapType].findIndex((l) => l.name === layer.name);
		if (index === -1) {
			currentState[mapType].push(layer);
		} else {
			currentState[mapType][index] = layer;
		}
		return currentState;
	});
	// }
}
