<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';

	import type L from 'leaflet';

	export let url: string;
	export let attribution: string;
	export let layerOptions: L.TileLayerOptions = {};

	const leaflet = (getContext('leaflet') as { getLeaflet: () => typeof L }).getLeaflet();
	const leafletMap = (getContext('leafletMap') as { getLeafletMap: () => L.Map }).getLeafletMap();
	const tileLayersStore = getContext('tileLayers') as {
		subscribe: (callback: (value: L.TileLayer[]) => void) => void;
		set: (value: L.TileLayer[]) => void;
	};
	let tileLayer: L.TileLayer;
	let tileLayers: L.TileLayer[];

	tileLayersStore.subscribe((value) => {
		tileLayers = value;
	});

	onMount(() => {
		tileLayer = leaflet.tileLayer(url, { ...layerOptions, attribution }).addTo(leafletMap);
		tileLayersStore.set([...tileLayers, tileLayer]);
	});

	onDestroy(() => {
		if (leafletMap && tileLayer) {
			leafletMap.removeLayer(tileLayer);
			tileLayersStore.set(tileLayers.filter((layer) => layer !== tileLayer));
		}
	});

	$: {
		if (leafletMap && tileLayer) {
			for (const layer of tileLayers) {
				// Do something with each layer
				// console.log(layer);
			}
		}
	}
</script>
