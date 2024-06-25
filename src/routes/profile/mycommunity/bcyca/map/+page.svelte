<script lang="ts">
	import LeafletMap from '$components/map/leaflet/LeafletMap.svelte';
	import LeafletTileLayer from '$components/map/leaflet/layers/LeafletTileLayer.svelte';
	import LeafletGeoJSONLayerOptions from '$components/map/leaflet/layers/LeafletGeoJSONLayerOptions.svelte';
	import LeafletGeoJSONLayer from '$components/map/leaflet/layers/LeafletGeoJSONLayer.svelte';

	import { env } from '$env/dynamic/public';

	import {
		aboutAddresspointsGeoJsonOptions,
		registeredAddresspointsGeoJsonOptions,
		type AboutGeoJsonData
	} from '$lib/map/map';

	export let data;
	const { projectAddressPoints } = data;
	const geoJsonData: AboutGeoJsonData = projectAddressPoints as unknown as AboutGeoJsonData;

	const mapCentre: [number, number] = [-31.955815, 152.300884];
	const baseUrl = `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${env.PUBLIC_MAPTILER_KEY}`;
	const baseAttribution = `\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e \u003ca href="https://www.spatial.nsw.gov.au" target="_blank"\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`;
	const baseOptions = {
		tileSize: 512,
		zoomOffset: -1,
		minZoom: 1,
		crossOrigin: true
	};
</script>

<svelte:head>
	<title>Profile-Community BCYCA-Map</title>
</svelte:head>

{#if projectAddressPoints}
	<div class="main-map flex mx-auto flex-col w-5/6 h-full">
		<LeafletMap
			centre={mapCentre}
			zoom={11.75}
			zoomSnap={0.25}
			zoomControl={false}
			dragging={false}
			doubleClickZoom={false}
			scrollWheelZoom={false}
			boxZoom={false}
			touchZoom={false}
			keyboard={false}
		>
			<LeafletTileLayer
				url={baseUrl}
				layerOptions={baseOptions}
				attribution={baseAttribution}
				layerName="Streets"
				layerMode="baseMaps"
			/>
			<LeafletGeoJSONLayerOptions customizeLayerOptions={aboutAddresspointsGeoJsonOptions}>
				<LeafletGeoJSONLayer
					geoJSONData={geoJsonData.allAddresspoints}
					layerName="BCYCA Addresspoints"
					layerMode="fixedMap"
				/>
			</LeafletGeoJSONLayerOptions>
			<LeafletGeoJSONLayerOptions customizeLayerOptions={registeredAddresspointsGeoJsonOptions}>
				<LeafletGeoJSONLayer
					geoJSONData={geoJsonData.registeredAddresspoints}
					layerName="BCYCA Registered Addresspoints"
					layerMode="fixedMap"
				/>
			</LeafletGeoJSONLayerOptions>
		</LeafletMap>
	</div>
{:else}
	<div class="main-map flex mx-auto flex-col w-5/6 h-full">
		<p class="text-center text-gray-500 mt-4">Bugger!</p>
	</div>
{/if}
