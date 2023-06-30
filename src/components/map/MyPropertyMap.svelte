<script lang="ts">
	import { onDestroy, onMount, setContext } from 'svelte';
	import { mapContext, propertyFeatureStyle } from '$lib/map/map';

	import type { MapDataJSON } from '$lib/types';

	import type { Map, Control, FeatureGroup, PM, Marker } from 'leaflet';

	export let mapCentre: [number, number];
	export let mapLayers: MapDataJSON;
	export let map: Map;
	export let leaflet: typeof import('leaflet');
	export let esriLeaflet: typeof import('esri-leaflet');
	export let esriLeafletVector: typeof import('esri-leaflet-vector');

	let waypointGroup: FeatureGroup;
	let addresspointGroup: FeatureGroup;
	let propertyGroup: FeatureGroup;

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

		map.setView(mapCentre, 16);

		let propertyFeature: GeoJSON.Feature = {
			type: 'Feature',
			properties: {},
			geometry: mapLayers.jsonLayers[0].geometry
		};

		let features = [];
		const property = L.geoJSON(propertyFeature, {
			style: propertyFeatureStyle
		});
		features.push(property);
		propertyGroup = L.featureGroup(features);
		map.addLayer(propertyGroup);
		features = [];
		let g = mapLayers.jsonLayers[1];
		let p = g.geometry.coordinates;
		let marker = new L.CircleMarker(new L.LatLng(p[1], p[0], 0));
		marker.setStyle({ color: '#f97316', weight: 0, radius: 3, fillOpacity: 0.75 });
		features.push(marker);
		addresspointGroup = L.featureGroup(features);
		map.addLayer(addresspointGroup);
		features = [];
		g = mapLayers.jsonLayers[2];
		p = g.geometry.coordinates;
		marker = new L.CircleMarker(new L.LatLng(p[1], p[0], 0));
		const amarker: Marker = new L.Marker(new L.LatLng(p[1], p[0], 0));
		marker.setStyle({ color: '#a5a5a5', weight: 0, radius: 3, fillOpacity: 0.75 });
		features.push(marker);
		waypointGroup = L.featureGroup(features);
		map.addLayer(waypointGroup);
		// map.on('resize', function () {
		map.setMinZoom(0);
		map.setMaxZoom(20);
		map.fitBounds(propertyGroup.getBounds());
		map.invalidateSize();
		// });

		// const layerControl = L.control
		// 	.layers(baseMaps, overlay, {
		// 		collapsed: true
		// 	})
		// 	.addTo(map);

		// add Leaflet-Geoman controls
		// map.pm.addControls({
		// 	position: 'topleft',
		// 	cutPolygon: true
		// });
		// const addHazardPoint: (PM.ACTION_NAMES | PM.Action)[] = [
		// 	// uses the default 'cancel' action
		// 	'cancel',
		// 	// creates a new action that has text, no click event
		// 	{ text: 'Custom text, no click' },
		// 	// creates a new action with text and a click event
		// 	{
		// 		text: 'click me',
		// 		onClick: () => {
		// 			map.pm.setPathOptions(
		// 				{ color: 'orange' },
		// 				{
		// 					ignoreShapes: ['Circle', 'Rectangle']
		// 				}
		// 			);
		// 		}
		// 	}
		// ];
		// map.pm.Toolbar.copyDrawControl('drawCircleMarker', {
		// 	name: 'HazardPoint',
		// 	block: 'custom',
		// 	title: 'Display text on hover button',
		// 	actions: addHazardPoint
		// });

		// let MyCustomMarker = L.icon({
		// 	shadowUrl: null,
		// 	iconAnchor: new L.Point(12, 12),
		// 	iconSize: new L.Point(24, 24),
		// 	iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Information_icon4_orange.svg'
		// });

		// let infoMarker = map.pm.Toolbar.copyDrawControl('drawMarker', { name: 'infoMarker' });
		// infoMarker.drawInstance.setOptions({ markerStyle: { icon: MyCustomMarker } });

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

<style>
	@import 'leaflet/dist/leaflet.css';
	@import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
	@import '$components/map/leaflet/geoman/custom-geoman.css';
</style>
