<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';

	import type { PageData } from './$types';

	import {
		addresspointOptions,
		myPropertyMapConfig,
		propertyOptions,
		waypointOptions
	} from '$lib/leaflet/mapconfig';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const propertyGeometryData = data.propertyGeometryData[0];

	let mapLoaded = $state(false);

	function handleMapLoaded() {
		mapLoaded = true;
	}
</script>

<div class="h-full w-full">
	{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
		{#if !mapLoaded}
			<div class="spinner-overlay">
				<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
			</div>
		{/if}
		<LeafletMap {...myPropertyMapConfig} onMapReady={handleMapLoaded}>
			{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPolygonLayer.svelte') then { default: LeafletGeoJSONPolygonLayer }}
				<LeafletGeoJSONPolygonLayer
					geojsonData={propertyGeometryData.property}
					layerName="Property Boundary Layer"
					visible={true}
					editable={false}
					staticLayer={false}
					showInLegend={true}
					symbology={propertyOptions}
				/>
			{/await}
			{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
				<LeafletGeoJSONPointLayer
					geojsonData={propertyGeometryData.address_point}
					layerName="Addresspoint Layer"
					visible={true}
					editable={false}
					staticLayer={false}
					showInLegend={true}
					symbology={addresspointOptions}
				/>
				<LeafletGeoJSONPointLayer
					geojsonData={propertyGeometryData.way_point}
					layerName="Waypoint Layer"
					visible={true}
					editable={false}
					staticLayer={false}
					showInLegend={true}
					symbology={waypointOptions}
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
