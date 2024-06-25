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

	export let projectAddressPoints: AboutGeoJsonData;

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
	<title>Strengthen Our Community</title>
</svelte:head>

<section class="wrapper h-full grid text-gray-900">
	<div class="main-headlines text-center mx-auto">
		<h1 class="title-font font-bold hidden sm:block sm:text-4xl sm:mt-4 text-orange-600">
			Strengthen OUR Community
		</h1>
		<h3 class="pt-4">
			This project is about empowering our community to take responsibility for being prepared and
			working together to make a difference.
		</h3>
	</div>
	<div class="about-content text-center mx-auto">
		<h3 class="pt-4">Our aim is to: Prepare, Connect and Rebound</h3>
	</div>
	<div class="main-list mx-auto">
		<p class="mb-2">The project focuses on four areas:</p>
		<ol type="1" class="mt-0">
			<li class="m-1">
				<span class="font-semibold">The Burrell Creek Hall</span>
				- an emergency information hub, a place where up-to-date accurate, current information is available.
			</li>
			<li class="m-1">
				<span class="font-semibold">KYNGs</span>
				- Know Your Neighbour Groups - Community groups who work together to provide information, connection
				and support.
			</li>
			<li class="m-1">
				<span class="font-semibold">Digital Online Mapping</span>
				- this website. A digital representation of our local information, that we own and update.
			</li>
			<li class="m-1">
				<span class="font-semibold">Workshops</span>
				- locally run workshops to increase community preparedness, through knowledge sharing.
			</li>
		</ol>

		<p class="my-3 font-semibold text-center">
			This map shows the <span class="text-orange-600">properties</span>
			that have participated
		</p>
	</div>
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
						geoJSONData={projectAddressPoints.allAddresspoints}
						layerName="About Addresspoints"
						layerMode="fixedMap"
					/>
				</LeafletGeoJSONLayerOptions>
				<LeafletGeoJSONLayerOptions customizeLayerOptions={registeredAddresspointsGeoJsonOptions}>
					<LeafletGeoJSONLayer
						geoJSONData={projectAddressPoints.registeredAddresspoints}
						layerName="Registered Addresspoints"
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
</section>

<style>
	.main-headlines {
		grid-area: headlines;
	}
	.main-list {
		grid-area: list;
	}
	.about-content {
		grid-area: content-words;
	}
	.main-map {
		grid-area: map-area;
	}
	.wrapper {
		display: grid;
		grid-template-columns: 1fr 2fr auto 2fr 1fr;
		grid-template-areas:
			'headlines headlines headlines headlines headlines '
			'content-words content-words content-words content-words content-words '
			'list list list list list '
			'. map-area map-area map-area .';
		grid-template-rows: auto auto auto 1fr;
	}
</style>
