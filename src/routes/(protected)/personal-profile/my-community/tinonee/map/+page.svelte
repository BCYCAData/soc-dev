<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';
	import {
		communityFillOptions,
		myCommunityTinoneeMapConfig,
		projectAddresspointsOptions,
		registeredAddresspointsOptions
	} from '$lib/leaflet/mapconfig';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const { community, mapExtent, addressPoints, registeredPoints } = data;

	const initialExtent = mapExtent;
	const tinoneeAddressPoints = addressPoints;
	const tinoneeRegisteredPoints = registeredPoints;
	const tinoneeCommunityArea = community;

	let mapLoaded = $state(false);

	function handleMapLoaded() {
		mapLoaded = true;
	}
</script>

<svelte:head>
	<title>Profile-Community Tinonee-Map</title>
</svelte:head>

{#if initialExtent}
	<div class="map-container mx-auto flex w-5/6 flex-col">
		{#if !mapLoaded}
			<div class="spinner-overlay">
				<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
			</div>
		{/if}
		{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
			<LeafletMap {...myCommunityTinoneeMapConfig(initialExtent)} onMapReady={handleMapLoaded}>
				{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPolygonLayer.svelte') then { default: LeafletGeoJSONPolygonLayer }}
					<LeafletGeoJSONPolygonLayer
						geojsonData={tinoneeCommunityArea}
						layerName="BCYCA Community Area"
						visible={true}
						editable={false}
						staticLayer={false}
						showInLegend={true}
						symbology={communityFillOptions}
					/>
				{/await}
				{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
					<LeafletGeoJSONPointLayer
						geojsonData={tinoneeAddressPoints}
						layerName="Project Address Points"
						visible={true}
						editable={false}
						showInLegend={true}
						staticLayer={false}
						symbology={projectAddresspointsOptions}
					/>
					<LeafletGeoJSONPointLayer
						geojsonData={tinoneeRegisteredPoints}
						layerName="Registered Address Points"
						visible={true}
						editable={false}
						showInLegend={true}
						staticLayer={false}
						symbology={registeredAddresspointsOptions}
					/>
				{/await}
				{#await import('$components/map/leaflet/controls/LeafletScaleControl.svelte') then { default: LeafletScaleControl }}
					<LeafletScaleControl position="bottomleft" />
				{/await}
				{#await import('$components/map/leaflet/controls/LeafletLegendControl.svelte') then { default: LeafletLegendControl }}
					<LeafletLegendControl position="bottomright" />
				{/await}
			</LeafletMap>
		{/await}
	</div>
{:else}
	<div class="main-map mx-auto flex h-full w-5/6 flex-col">
		<p class="mt-4 text-center text-surface-500">Bugger!</p>
	</div>
{/if}

<style>
	.map-container {
		height: 95%;
		min-height: 400px;
		position: relative;
	}

	.spinner-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.7);
		z-index: 1000;
	}
</style>
