<script lang="ts">
	import { getContext } from 'svelte';
	import { mapContext } from '$lib/map/map';
	import { PUBLIC_HERE_API_KEY } from '$env/static/public';

	import type { Control, Map } from 'leaflet';

	export let leaflet: typeof import('leaflet');
	export let addToMap = false;
	export let layerlable: string;
	export let layerMode: 'baseMaps' | 'overlayMaps';
	export let baseMaps: Control.LayersObject;
	export let overlayMaps: Control.LayersObject;

	const { getMap } = getContext(mapContext) as { getMap: () => Map };
	const map: Map = getMap();

	const hereTileUrl = `https://maps.hereapi.com/v3/base/mc/{z}/{x}/{y}/png8?apiKey=${PUBLIC_HERE_API_KEY}&style=satellite.day&size=512`;

	const hereMap = leaflet.tileLayer(hereTileUrl, { maxZoom: 20, maxNativeZoom: 18 });

	if (addToMap) {
		hereMap.addTo(map);
	}

	if (layerMode === 'baseMaps') {
		baseMaps[layerlable] = hereMap;
	} else {
		overlayMaps[layerlable] = hereMap;
	}
</script>
