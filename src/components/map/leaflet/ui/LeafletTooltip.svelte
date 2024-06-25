<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import { geoJSONLayersStore } from '$stores/leaflet';

	import type L from 'leaflet';
	import type { GeoJSONObject } from '$lib/types';
	import type { Feature } from 'geojson';

	export let tooltipContent: string;
	export let layerName: string;

	const leaflet = (getContext('leaflet') as { getLeaflet: () => typeof L }).getLeaflet();

	let geoJSONLayer: L.GeoJSON;

	onMount(() => {
		if (layerName) {
			const layersStore = geoJSONLayersStore.subscribe((currentlLayers) => {
				if (currentlLayers && currentlLayers[layerName]) {
					geoJSONLayer = currentlLayers[layerName].layer;
				}
			});
			if (geoJSONLayer) {
				geoJSONLayer.eachLayer((layer) => {
					const featurelayer = layer as L.GeoJSON;
					const feature = featurelayer.feature as Feature;
					tooltipContent = '';
					if (feature.properties) {
						tooltipContent += `
					<p>Address: ${feature.properties['Address'] ? feature.properties['Address'] : 'Not Known'}</p>
                    <p>Alternate Addresses: ${feature.properties['Alternate Addresses'] ? feature.properties['Alternate Addresses'] : 'None'}</p>
                    <p>Secondary Addresses: ${feature.properties['Secondary Addresses'] ? feature.properties['Secondary Addresses'] : 'None'}</p>
			`;
					} else {
						tooltipContent += `
				<p>No Data</p>
			`;
					}
					const tooltipItem = leaflet.tooltip({});
					tooltipItem.setContent(tooltipContent);
					layer.bindTooltip(tooltipItem);
				});
			}
		}
	});

	onDestroy(() => {
		if (geoJSONLayer) {
			geoJSONLayer.eachLayer((layer) => {
				const tooltip = layer.getTooltip();
				if (tooltip) {
					tooltip.remove();
				}
			});
		}
	});
</script>
