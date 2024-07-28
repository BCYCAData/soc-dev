<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import { tileLayersStore } from '$stores/leaflet';

	import type L from 'leaflet';

	export let url: string;
	export let attribution: string;
	export let layerOptions: L.TileLayerOptions = {};
	export let layerName: string;
	export let layerMode: 'baseMaps' | 'overlayMaps' | 'fixedMap';

	const leaflet = (getContext('leaflet') as { getLeaflet: () => typeof L }).getLeaflet();
	const leafletMap = (getContext('leafletMap') as { getLeafletMap: () => L.Map }).getLeafletMap();

	let tileLayer: L.TileLayer;

	onMount(() => {
		tileLayer = leaflet.tileLayer(url, { ...layerOptions, attribution }).addTo(leafletMap);
		tileLayersStore.update((layers) => ({
			...layers,
			[layerName]: { layer: tileLayer, layerMode, layerName }
		}));
	});

	onDestroy(() => {
		if (leafletMap && tileLayer) {
			leafletMap.removeLayer(tileLayer);
		}
	});
	// $: {
	// 	if (leafletMap && tileLayer) {
	// 		const tileLayersArray = Object.values($tileLayersStore);
	// 		for (const tileLayer of tileLayersArray) {
	// 			// Do something with each layer
	// 			// console.log(layer);
	// 		}
	// 	}
	// }
</script>
