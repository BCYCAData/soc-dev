<script lang="ts">
	import { page } from '$app/state';
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
	let center = $derived(() => {
		const lat = page.url.searchParams.get('lat');
		const lng = page.url.searchParams.get('lng');
		const zoom = page.url.searchParams.get('zoom');

		// Use URL params if all are present
		if (lat && lng && zoom) {
			return {
				useBounds: false,
				center: [Number(lat), Number(lng)] as [number, number],
				zoom: Number(zoom)
			};
		}

		// Use bounds for initial extent
		return {
			useBounds: true,
			bounds: kyngGeoJsonData.bounds as [[number, number], [number, number]]
		};
	});

	let { data }: Props = $props();
	const kyngGeoJsonData = $derived(data.kyngGeoJsonData);

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
					center().useBounds ? undefined : center().center,
					center().useBounds ? center().bounds : undefined,
					center().useBounds ? undefined : center().zoom
				)}
				onMapReady={handleMapLoaded}
			>
				{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
					<LeafletGeoJSONPointLayer
						geojsonData={kyngGeoJsonData.wayPoints}
						layerName="Way Points"
						visible={false}
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
						tooltipTemplate={(feature) => `
									<strong>${feature.properties?.Address}</strong><br>
									<i>Type: </i> ${feature.properties ? feature.properties['Address Type'] : 'N/A'}<br>
									<i>Principal Address Type: </i> ${feature.properties ? feature.properties['Principal Address Type'] : 'N/A'}<br>
									<i>Address Point Type: </i> ${feature.properties ? feature.properties['Address Point Type'] : 'N/A'}
								`}
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
