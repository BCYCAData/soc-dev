<script lang="ts">
	import { getContext } from 'svelte';
	import { mapContext } from '$lib/map/map';

	import type { Control, Map } from 'leaflet';

	export let esriLeaflet: typeof import('esri-leaflet');
	export let layerUrl: string;
	export let addToMap = false;
	export let maxZoom = 20;
	export let maxNativeZoom = 18;
	export let layerlable: string;
	export let layerMode: 'baseMaps' | 'overlayMaps';
	export let baseMaps: Control.LayersObject;
	export let overlayMaps: Control.LayersObject;

	const { getMap } = getContext(mapContext) as { getMap: () => Map };
	const map: Map = getMap();

	const tiledMapLayer = new esriLeaflet.TiledMapLayer({
		url: layerUrl,
		maxZoom: maxZoom,
		maxNativeZoom: maxNativeZoom
	});

	console.log('tiledMapLayer', tiledMapLayer);

	if (addToMap) {
		tiledMapLayer.addTo(map);
	}

	if (layerMode === 'baseMaps') {
		baseMaps[layerlable] = tiledMapLayer;
	} else {
		overlayMaps[layerlable] = tiledMapLayer;
	}
</script>
