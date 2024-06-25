<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import { geoJSONLayersStore } from '$stores/leaflet';

	import type L from 'leaflet';
	import type { GeoJsonObject } from 'geojson';

	export let geoJSONData: GeoJsonObject;
	export let layerName: string;
	export let layerMode: 'baseMaps' | 'overlayMaps' | 'fixedMap';
	export let visible: boolean = true;
	export let fitBounds: boolean = false;

	const leaflet = (getContext('leaflet') as { getLeaflet: () => typeof L }).getLeaflet();
	const leafletMap = (getContext('leafletMap') as { getLeafletMap: () => L.Map }).getLeafletMap();
	const leafletGeoJSONOptions = (
		getContext('leafletGeoJSONOptions') as {
			getLeafletGeoJSONOptions: () => L.GeoJSONOptions;
		}
	).getLeafletGeoJSONOptions();

	onMount(async () => {
		const geoJSONLayer = leaflet.geoJSON(geoJSONData, leafletGeoJSONOptions);
		if (visible) {
			geoJSONLayer.addTo(leafletMap);
		}
		geoJSONLayersStore.update((layers) => ({
			...layers,
			[layerName]: { layer: geoJSONLayer, layerMode: layerMode, layerName }
		}));
		if (fitBounds) {
			const bounds = geoJSONLayer.getBounds();
			leafletMap.fitBounds(bounds);
		}
	});

	onDestroy(() => {
		geoJSONLayersStore.update((layers) => {
			const { [layerName]: removedLayer, ...rest } = layers as any;
			return rest;
		});
	});
</script>
