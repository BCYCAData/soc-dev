<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';
	import {
		kyngAddresspointsGeoJsonOptions,
		kyngAreaGeoJsonOptions,
		kyngCoordinatorKyngAreaMapConfig,
		kyngPropertyAreasGeoJsonOptions,
		kyngProwayGeoJsonOptions,
		kyngWayPointsGeoJsonOptions
	} from '$lib/leaflet/mapconfig';

	import { generateUniqueColorForKey, type Color } from '$lib/leaflet/leafletlegendutility';
	import type { PageData } from './$types';
	import type { PolygonSymbologyOptions } from '$lib/leaflet/types';
	import type { Feature } from 'geojson';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const kyngGeoJsonData = data.kyngGeoJsonData;

	let existingColors: Color[] = [];

	export function getPropertyAreaStyle(feature: Feature): PolygonSymbologyOptions {
		return {
			...kyngPropertyAreasGeoJsonOptions,
			fillColor: generateUniqueColorForKey(
				feature.properties?.['Principal Address Site OID']?.toString() ?? 'default',
				existingColors
			)
		};
	}

	let mapLoaded = $state(false);

	function handleMapLoaded() {
		mapLoaded = true;
	}
</script>

<svelte:head>
	<title>Kyng Map</title>
</svelte:head>

{#if kyngGeoJsonData}
	<div class="map-container mx-auto flex w-5/6 flex-col">
		{#if !mapLoaded}
			<div class="spinner-overlay">
				<Spinner size="50" ballTopLeft="#006400" ballTopRight="#FF3E00" />
			</div>
		{/if}
		{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
			<LeafletMap
				{...kyngCoordinatorKyngAreaMapConfig(
					[-31.940026654472703, 152.40239389529367] as [number, number],
					kyngGeoJsonData.initialExtent
				)}
				onMapReady={handleMapLoaded}
			>
				{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
					<LeafletGeoJSONPointLayer
						geojsonData={kyngGeoJsonData.wayPoints}
						layerName="Way Points"
						visible={true}
						editable={false}
						staticLayer={false}
						showInLegend={true}
						symbology={kyngWayPointsGeoJsonOptions}
					/>
					<LeafletGeoJSONPointLayer
						geojsonData={kyngGeoJsonData.addressPoints}
						layerName="Address Points"
						visible={true}
						editable={false}
						staticLayer={false}
						showInLegend={true}
						symbology={kyngAddresspointsGeoJsonOptions}
					/>
				{/await}
				{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONLineLayer.svelte') then { default: LeafletGeoJSONLineLayer }}
					<LeafletGeoJSONLineLayer
						geojsonData={kyngGeoJsonData.prowayLines}
						layerName="Proway Lines"
						visible={false}
						editable={false}
						staticLayer={false}
						showInLegend={true}
						symbology={kyngProwayGeoJsonOptions}
					/>
				{/await}
				{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPolygonLayer.svelte') then { default: LeafletGeoJSONPolygonLayer }}
					<LeafletGeoJSONPolygonLayer
						geojsonData={kyngGeoJsonData.kyngArea}
						layerName="Kyng Area"
						visible={true}
						editable={false}
						staticLayer={true}
						showInLegend={true}
						symbology={kyngAreaGeoJsonOptions}
					/>
					<LeafletGeoJSONPolygonLayer
						geojsonData={kyngGeoJsonData.propertyAreas}
						layerName="Property Areas"
						visible={true}
						editable={false}
						staticLayer={true}
						showInLegend={true}
						symbology={kyngPropertyAreasGeoJsonOptions}
					/>
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
