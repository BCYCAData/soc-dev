<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';

	import type { PageData } from './$types';
	import type { PointSymbologyOptions, PolygonSymbologyOptions } from '$lib/leaflet/types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const propertyGeometryData = data.propertyGeometryData[0];

	let mapLoaded = $state(false);

	function handleMapLoaded() {
		mapLoaded = true;
	}

	const baseLayers = [
		{
			name: 'NSW Streets',
			url: `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}`,
			attribution: `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`
		},
		{
			name: 'NSW Aerial',
			url: `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}`,
			attribution: `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`
		},
		{
			name: 'OpenStreetMap',
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			attribution: '© OpenStreetMap contributors'
		},
		{
			name: 'Satellite',
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			attribution:
				'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
		}
	];

	const mapConfig = {
		centre: propertyGeometryData.centre as [number, number],
		initialExtent: propertyGeometryData.bounds as [[number, number], [number, number]],
		minZoom: undefined,
		maxZoom: undefined,
		zoomable: true,
		zoomSnap: 0.25,
		scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
		attributionControl: { present: true },
		layersControl: { present: true, position: 'topright' as L.ControlPosition },
		legend: { present: false, position: 'bottomright' as L.ControlPosition },
		width: '100%',
		height: '99%',
		baseLayers: baseLayers
	};

	const addresspointOptions: PointSymbologyOptions = {
		type: 'custom',
		options: {
			markerShape: 'diamond',
			fillColour: '#f97316',
			size: 12,
			strokeColour: '#000',
			strokeWidth: 0,
			strokeOpacity: 1,
			fillOpacity: 0.8
		}
	};

	const waypointOptions: PointSymbologyOptions = {
		type: 'custom',
		options: {
			markerShape: 'diamond',
			fillColour: '#a5a5a5',
			size: 12,
			strokeColour: '#000',
			strokeWidth: 0,
			strokeOpacity: 1,
			fillOpacity: 0.8
		}
	};

	const propertyOptions: PolygonSymbologyOptions = {
		fillColor: '#3388ff',
		fillOpacity: 0.7,
		color: '#000',
		weight: 1,
		opacity: 1
	};
</script>

<div class="h-full w-full">
	{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
		{#if !mapLoaded}
			<div class="spinner-overlay">
				<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
			</div>
		{/if}
		<LeafletMap {...mapConfig} onMapReady={handleMapLoaded}>
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
