<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';
	import FeatureAttributesForm from '$components/map/leaflet/FeatureAttributesForm.svelte';
	import FeaturesList from '$components/map/leaflet/FeaturesList.svelte';
	import { editingState } from '$lib/leaflet/spatialutilities.svelte';
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
	let leafletMapInstance = $state<L.Map>();

	function handleMapLoaded() {
		mapLoaded = true;
	}

	function handleMapInstance(map: L.Map) {
		leafletMapInstance = map;
	}

	$effect(() => {
		if (mapLoaded && leafletMapInstance) {
			setTimeout(() => {
				leafletMapInstance?.invalidateSize();
			}, 100);
		}
	});
</script>

<div class="flex h-full">
	<div class="w-80 bg-gray-50 p-4">
		<FeaturesList />
	</div>
	<div class="relative flex-1">
		<div class="map-container">
			{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
				{#if !mapLoaded}
					<div class="spinner-overlay">
						<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
					</div>
				{/if}
				<div class="h-full w-full">
					<LeafletMap
						{...myPropertyMapConfig(propertyGeometryData.centre, propertyGeometryData.bounds)}
						onMapReady={handleMapLoaded}
						onMapInstance={handleMapInstance}
					>
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
				</div>
				{#if editingState.mode === 'create' || editingState.mode === 'edit'}
					<div class="absolute bottom-4 right-4 w-96">
						<FeatureAttributesForm />
					</div>
				{/if}
			{/await}
		</div>
	</div>
</div>

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
