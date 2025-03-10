<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';

	import type { PageData } from './$types';

	import {
		adminCommunityBCYCAMapConfig,
		communityFillOptions,
		projectAddresspointsOptions,
		registeredAddresspointsOptions
	} from '$lib/leaflet/mapconfig';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const { community, mapExtent, addressPoints, registeredPoints } = data;

	const initialExtent = mapExtent;
	const bcycaAddressPoints = addressPoints;
	const bcycaRegisteredPoints = registeredPoints;
	const bcycaCommunityArea = community;

	let mapLoaded = $state(false);

	function handleMapLoaded() {
		mapLoaded = true;
	}
</script>

<svelte:head>
	<title>Admin-Community BCYCA-Map</title>
</svelte:head>

{#if initialExtent}
	<div class="map-container mx-auto flex w-5/6 flex-col">
		{#if !mapLoaded}
			<div class="spinner-overlay">
				<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
			</div>
		{/if}
		{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
			<LeafletMap {...adminCommunityBCYCAMapConfig(initialExtent)} onMapReady={handleMapLoaded}>
				{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPolygonLayer.svelte') then { default: LeafletGeoJSONPolygonLayer }}
					<LeafletGeoJSONPolygonLayer
						geojsonData={bcycaCommunityArea}
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
						geojsonData={bcycaAddressPoints}
						layerName="Project Address Points"
						visible={true}
						editable={false}
						showInLegend={true}
						staticLayer={false}
						symbology={projectAddresspointsOptions}
					/>
					<LeafletGeoJSONPointLayer
						geojsonData={bcycaRegisteredPoints}
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
