<script lang="ts">
	import { setContext } from 'svelte';
	import type L from 'leaflet';

	export let customizeLayerOptions:
		| ((defaultOptions: L.GeoJSONOptions) => L.GeoJSONOptions)
		| L.GeoJSONOptions;

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
</script>

{#if leafletGeoJSONOptions}
	<slot></slot>
{/if}
