<script lang="ts">
	import { getContext } from 'svelte';
	import { mapContext } from '$lib/map/map';

	import type { Control, Map } from 'leaflet';

	export let esriLeafletVector: typeof import('esri-leaflet-vector');
	export let layerUrl: string;
	export let addToMap = false;
	export let layerlable: string;
	export let layerMode: 'baseMaps' | 'overlayMaps';
	export let baseMaps: Control.LayersObject;
	export let overlayMaps: Control.LayersObject;

	const { getMap } = getContext(mapContext) as { getMap: () => Map };
	const map: Map = getMap();

	const vectorTileLayer = esriLeafletVector.vectorTileLayer(layerUrl, {});
	console.log('vectorTileLayer', vectorTileLayer);

	if (addToMap) {
		vectorTileLayer.addTo(map);
	}

	if (layerMode === 'baseMaps') {
		baseMaps[layerlable] = vectorTileLayer;
	} else {
		overlayMaps[layerlable] = vectorTileLayer;
	}
</script>
