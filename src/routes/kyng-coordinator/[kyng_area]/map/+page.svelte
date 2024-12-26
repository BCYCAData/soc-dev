<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';
	import { kyngMapConfig } from '$lib/leaflet/mapconfig';

	import { generateUniqueColorForKey, type Color } from '$lib/leaflet/leafletlegendutility';
	import type { PageData } from './$types';
	import type {
		GroupedSymbologyOptions,
		PointSymbologyOptions,
		PolygonSymbologyOptions,
		LineSymbologyOptions
	} from '$lib/leaflet/types';
	import type { Feature } from 'geojson';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const kyngGeoJsonData = data.kyngGeoJsonData;

	const kyngAddresspointsGeoJsonOptions: GroupedSymbologyOptions = {
		type: 'leaflet',
		propertyField: 'addressPointType',
		options: {
			type: 'divIcon',
			options: {
				className: 'address-marker',
				iconSize: [10, 10],
				iconAnchor: [5, 5],
				html: ''
			}
		},
		groups: [
			{
				value: 'Property',
				label: 'Property Address',
				symbol: {
					type: 'leaflet',
					options: {
						type: 'divIcon',
						markerShape: 'square',
						options: {
							className: 'address-marker',
							color: 'blue',
							iconSize: [8, 8],
							iconAnchor: [4, 4],
							html: ''
						}
					}
				}
			},
			{
				value: 'Building',
				label: 'Building Address',
				symbol: {
					type: 'leaflet',
					options: {
						type: 'divIcon',
						markerShape: 'diamond',
						options: {
							className: 'address-marker',
							color: 'green',
							iconSize: [10, 10],
							iconAnchor: [5, 5],
							html: ''
						}
					}
				}
			},
			{
				value: 'Default',
				label: 'Address',
				symbol: {
					type: 'leaflet',
					options: {
						type: 'divIcon',
						markerShape: 'diamond',
						options: {
							className: 'address-marker',
							color: 'black',
							iconSize: [10, 10],
							iconAnchor: [5, 5],
							html: ''
						}
					}
				}
			}
		]
	};

	export const kyngAreaGeoJsonOptions: PolygonSymbologyOptions = {
		fillColor: 'transparent',
		fillOpacity: 0,
		weight: 5,
		color: 'magenta'
	};

	export const kyngProwayGeoJsonOptions: LineSymbologyOptions = {
		width: 1,
		color: 'steelblue',
		pattern: 'solid',
		lineCap: 'round',
		lineJoin: 'round'
	};

	let existingColors: Color[] = [];

	export const kyngPropertyAreasGeoJsonOptions: PolygonSymbologyOptions = {
		fillColor: 'transparent', // Default color that will be overridden
		fillOpacity: 0.3,
		weight: 1,
		color: 'black'
	};

	export function getPropertyAreaStyle(feature: Feature): PolygonSymbologyOptions {
		return {
			...kyngPropertyAreasGeoJsonOptions,
			fillColor: generateUniqueColorForKey(
				feature.properties?.['Principal Address Site OID']?.toString() ?? 'default',
				existingColors
			)
		};
	}

	export const kyngWayPointsGeoJsonOptions: PointSymbologyOptions = {
		type: 'leaflet',
		options: {
			type: 'circleMarker',
			options: {
				radius: 3,
				fillColor: 'red',
				color: 'black',
				weight: 1,
				fillOpacity: 1,
				className: 'waypoint-marker'
			}
		}
	};

	let mapLoaded = $state(false);

	function handleMapLoaded() {
		mapLoaded = true;
	}

	const mapConfig = {
		centre: [-31.940026654472703, 152.40239389529367] as [number, number],
		zoom: 13,
		minZoom: undefined,
		maxZoom: undefined,
		initialExtent: kyngGeoJsonData.bounds,
		zoomable: true,
		zoomSnap: 0.25,
		scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
		attributionControl: { present: true },
		layersControl: { present: true, position: 'topright' as L.ControlPosition },
		legend: { present: true, position: 'bottomright' as L.ControlPosition },
		editControl: { present: false },
		width: '100%',
		height: '98%',
		baseLayers: kyngMapConfig.baseLayers
	};
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
			<LeafletMap {...mapConfig} onMapReady={handleMapLoaded}>
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
