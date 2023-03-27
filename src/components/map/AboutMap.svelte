<script lang="ts">
	import AboutMapLeaflet from '$components/map/leaflet/AboutMapLeaflet.svelte';
	import Spinner from '$components/page/Spinner.svelte';
	import { env } from '$env/dynamic/public';

	import 'leaflet/dist/leaflet.css';

	import type { MapDataJSON } from '$lib/types';

	let mapObject = {
		divId: 'basicMap',
		centre: [-31.955815, 152.300884],
		zoomControl: false,
		doubleClickZoom: false,
		scrollWheelZoom: false,
		zoomSnap: 0.25,
		zoom: 11.75,
		minZoom: 11.75,
		maxZoom: 11.75,
		maxBounds: undefined,
		dragging: false,
		mapTiler: true
	};

	let mapTileLayer = {
		url: `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${env.PUBLIC_MAPTILER_KEY}`,
		layerOptions: {
			tileSize: 512,
			zoomOffset: -1,
			minZoom: 1,
			attribution:
				'\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e \u003ca href="https://www.spatial.nsw.gov.au" target="_blank"\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e',
			crossOrigin: true
		}
	};

	// '© State of New South Wales (Spatial Services, a business unit of the Department of Customer Service NSW). For current information go to spatial.nsw.gov.au.’
	export let mapLayers: MapDataJSON;
</script>

{#await mapLayers}
	<Spinner />
{:then mapLayers}
	<div class="border-double border-stone-100 h-full">
		<AboutMapLeaflet {mapObject} {mapTileLayer} {mapLayers} />
	</div>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
