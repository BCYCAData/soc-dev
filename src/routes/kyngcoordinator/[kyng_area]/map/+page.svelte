<script lang="ts">
	import LeafletMap from '$components/map/leaflet/LeafletMap.svelte';
	import LeafletTileLayer from '$components/map/leaflet/layers/LeafletTileLayer.svelte';
	import LeafletGeoJSONLayerOptions from '$components/map/leaflet/layers/LeafletGeoJSONLayerOptions.svelte';
	import LeafletGeoJSONLayer from '$components/map/leaflet/layers/LeafletGeoJSONLayer.svelte';
	import LeafletLayersControl from '$components/map/leaflet/controls/LeafletLayersControl.svelte';

	import {
		kyngAddresspointsGeoJsonOptions,
		kyngAreaGeoJsonOptions,
		kyngPropertyAreasGeoJsonOptions,
		kyngProwayGeoJsonOptions,
		kyngWayPointsGeoJsonOptions,
		type KyngGeoJsonData
	} from '$lib/map/map';

	import LeafletScaleControl from '$components/map/leaflet/controls/LeafletScaleControl.svelte';
	import LeafletTooltip from '$components/map/leaflet/ui/LeafletTooltip.svelte';

	export let data;

	const kyngGeoJsonData = data.kyngGeoJsonData as unknown as KyngGeoJsonData;

	const mapCentre: [number, number] = [-31.940026654472703, 152.40239389529367];
	const streetsUrl = `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}`;
	const streetsAttribution = `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`;
	const aerialUrl = `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}`;
	const aerialAttribution = `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`;
</script>

{#if data.kyngGeoJsonData}
	<LeafletMap centre={mapCentre} zoom={13} layersControl={true} zoomDelta={0.2} zoomSnap={0.2}>
		<LeafletTileLayer
			url={aerialUrl}
			attribution={aerialAttribution}
			layerName="Air Photo"
			layerMode="baseMaps"
		/>
		<LeafletTileLayer
			url={streetsUrl}
			attribution={streetsAttribution}
			layerName="Streets"
			layerMode="baseMaps"
		/>
		<LeafletGeoJSONLayerOptions customizeLayerOptions={kyngAreaGeoJsonOptions}>
			<LeafletGeoJSONLayer
				geoJSONData={kyngGeoJsonData.kyngArea}
				fitBounds={true}
				layerName="Kyng Area"
				layerMode="fixedMap"
			/>
		</LeafletGeoJSONLayerOptions>
		<LeafletGeoJSONLayerOptions customizeLayerOptions={kyngPropertyAreasGeoJsonOptions}>
			<LeafletGeoJSONLayer
				geoJSONData={kyngGeoJsonData.propertyAreas}
				layerName="Property Areas"
				layerMode="fixedMap"
			></LeafletGeoJSONLayer>
		</LeafletGeoJSONLayerOptions>
		<LeafletGeoJSONLayerOptions customizeLayerOptions={kyngProwayGeoJsonOptions}>
			<LeafletGeoJSONLayer
				geoJSONData={kyngGeoJsonData.prowayLines}
				layerName="Proway Lines"
				layerMode="overlayMaps"
				visible={false}
			/>
		</LeafletGeoJSONLayerOptions>
		<LeafletGeoJSONLayerOptions customizeLayerOptions={kyngAddresspointsGeoJsonOptions}>
			<LeafletGeoJSONLayer
				geoJSONData={kyngGeoJsonData.addressPoints}
				layerName="Address Points"
				layerMode="overlayMaps"
			/>
		</LeafletGeoJSONLayerOptions>
		<LeafletGeoJSONLayerOptions customizeLayerOptions={kyngWayPointsGeoJsonOptions}>
			<LeafletGeoJSONLayer
				geoJSONData={kyngGeoJsonData.wayPoints}
				layerName="Way Points"
				layerMode="overlayMaps"
				visible={false}
			/>
		</LeafletGeoJSONLayerOptions>
		<LeafletTooltip layerName={'Property Areas'} tooltipContent="Your tooltip content here" />
		<LeafletLayersControl />
		<LeafletScaleControl />
	</LeafletMap>
{/if}
