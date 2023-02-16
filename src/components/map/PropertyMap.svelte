<script lang="ts">
	import PropertyMapLeaflet from '$components/map/leaflet/PropertyMapLeaflet.svelte';
	import Spinner from '$components/page/Spinner.svelte';
	import { env } from '$env/dynamic/public';

	import type { MapDataJSON } from '$lib/types';

	export let mapLayers: MapDataJSON;

	let mapObject = {
		divId: 'basicMap',
		centre: [
			mapLayers.jsonLayers[1].geometry.coordinates[1],
			mapLayers.jsonLayers[1].geometry.coordinates[0]
		],
		zoomControl: false,
		doubleClickZoom: false,
		scrollWheelZoom: true,
		zoomSnap: 0.25,
		zoom: 15,
		minZoom: 15,
		maxZoom: 16,
		maxBounds: undefined,
		dragging: false,
		mapTiler: true
	};

	// let mapTileLayer = {
	// 	url: `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${env.PUBLIC_MAPTILER_KEY}`,
	// 	layerOptions: {
	// 		tileSize: 512,
	// 		zoomOffset: -1,
	// 		minZoom: 1,
	// 		attribution:
	// 			'\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e \u003ca href="https://www.spatial.nsw.gov.au" target="_blank"\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e',
	// 		crossOrigin: true
	// 	}
	// };

	// let mapTileLayer = {
	// 	url: 'https://maps.six.nsw.gov.au/arcgis/services/public/NSW_Base_Map/MapServer/WmsServer',
	// 	layerOptions: {
	// 		layers: 'LPIMap_PlacePoint'
	// 	}
	// };

	let mapTileLayer = {
		url: 'https://maps.six.nsw.gov.au/arcgis/services/public/NSW_Imagery/MapServer/WmsServer',
		layerOptions: {
			layers: '0'
		}
	};

	// '© State of New South Wales (Spatial Services, a business unit of the Department of Customer Service NSW). For current information go to spatial.nsw.gov.au.’
</script>

{#await mapLayers}
	<Spinner />
{:then mapLayers}
	<div class="border-double border-stone-100 h-full">
		<PropertyMapLeaflet {mapObject} {mapTileLayer} {mapLayers} />
	</div>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
