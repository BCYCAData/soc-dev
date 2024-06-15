<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import type L from 'leaflet';

	export let customizeLayerOptions:
		| ((defaultOptions: L.GeoJSONOptions) => L.GeoJSONOptions)
		| L.GeoJSONOptions;
	export let layerName: string;

	const defaultLayerOptions: L.GeoJSONOptions = {
		// Default options here
	};

	const leafletGeoJSONOptions: L.GeoJSONOptions =
		typeof customizeLayerOptions === 'function'
			? customizeLayerOptions(defaultLayerOptions)
			: { ...defaultLayerOptions, ...customizeLayerOptions };

	setContext('leafletGeoJSONOptions', {
		getLeafletGeoJSONOptions: () => leafletGeoJSONOptions
	});

	const geoJSONLayersStore = getContext('geoJSONLayers') as {
		subscribe: (callback: (value: L.GeoJSON[]) => void) => void;
	};

	let geoJSONLayers: L.GeoJSON[] = [];

	geoJSONLayersStore.subscribe((value) => {
		geoJSONLayers = value;
		console.log(layerName, geoJSONLayers);
	});
</script>

{#if leafletGeoJSONOptions}
	<slot></slot>
{/if}
