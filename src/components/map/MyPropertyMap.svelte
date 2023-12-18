<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';
	import {
		mapContext,
		propertyFeatureStyle,
		type LeafletGeoJSON,
		addresspointFeatureStyle,
		waypointFeatureStyle
	} from '$lib/map/map';

	import 'leaflet/dist/leaflet.css';
	import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
	import '$components/map/leaflet/geoman/custom-geoman.css';

	import type { GeoJSONObject, MapDataJSON } from '$lib/types';

	import type { Map } from 'leaflet';
	import type { GeoJsonObject } from 'geojson';

	export let leafletGeoJSONArray: LeafletGeoJSON[];
	export let mapCentre: [number, number];
	export let minZoom: number;
	export let map: Map;
	export let leaflet: typeof import('leaflet');
	export let esriLeaflet: typeof import('esri-leaflet');
	export let esriLeafletVector: typeof import('esri-leaflet-vector');

	let mapElement: string | HTMLElement;

	setContext(mapContext, {
		getMap: () => map
	});

	onMount(async () => {
		const L = await import('leaflet');
		const eL = await import('esri-leaflet');
		const eLV = await import('esri-leaflet-vector');
		await import('@geoman-io/leaflet-geoman-free');
		map = L.map(mapElement, { preferCanvas: true });
		leaflet = L;
		esriLeaflet = eL;
		esriLeafletVector = eLV;
		map.setView(mapCentre, minZoom);
		const geoJSONLayer = L.geoJSON().addTo(map);
		leafletGeoJSONArray.forEach((item) => {
			const featureType = item.properties.featureType;
			const latlng = L.latLng(item.geometry.coordinates[1], item.geometry.coordinates[0]);
			const feature = {
				type: 'Feature',
				properties: item.properties,
				geometry: item.geometry
			};
			let layer;
			if (featureType === 'AddressPoint') {
				layer = L.circleMarker(latlng, addresspointFeatureStyle);
			} else if (featureType === 'WayPoint') {
				layer = L.circleMarker(latlng, waypointFeatureStyle);
			} else if (featureType === 'Property') {
				layer = L.geoJSON(feature as GeoJsonObject, { style: propertyFeatureStyle });
			}
			if (layer) {
				const properties = feature.properties;
				const tooltipContent = `Feature: ${featureType}<br>ID: ${properties.id}<br>Principal Address Site OID: ${properties.principaladdresssiteoid}<br>Created At: ${properties.created_at}<br>Last Updated: ${properties.last_updated}`;
				layer.bindTooltip(tooltipContent);
				layer.addTo(geoJSONLayer);
			}
		});
		map.setMinZoom(0);
		map.setMaxZoom(20);
		map.fitBounds(geoJSONLayer.getBounds());

		map.on('pm:buttonclick', function (e) {
			console.log(e);
		});
	});

	onDestroy(async () => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="h-[90%] w-full" bind:this={mapElement}>
	{#if map}
		<slot />
	{/if}
</div>

<!-- <img
	src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAgMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQogIDxjaXJjbGUgY3g9IjUiIGN5PSI1IiByPSI0IiBmaWxsPSIjMDAwMEZGIiAvPg0KPC9zdmc+DQo="
	alt="blue circle"
/> -->

<!-- <style lang="css">
	@import 'leaflet/dist/leaflet.css';
	@import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
	@import '$components/map/leaflet/geoman/custom-geoman.css';
</style> -->
