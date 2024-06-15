<script lang="ts">
	import LeafletMap from '$components/map/leaflet/LeafletMap.svelte';
	import LeafletTileLayer from '$components/map/leaflet/layers/LeafletTileLayer.svelte';
	import LeafletGeoJSONLayerOptions from '$components/map/leaflet/layers/LeafletGeoJSONLayerOptions.svelte';
	import LeafletGeoJSONLayer from '$components/map/leaflet/layers/LeafletGeoJSONLayer.svelte';

	import {
		kyngAddresspointsGeoJsonOptions,
		kyngAreaGeoJsonOptions,
		kyngPropertyAreasGeoJsonOptions,
		kyngProwayGeoJsonOptions,
		kyngWayPointsGeoJsonOptions,
		type KyngGeoJsonData
	} from '$lib/map/map';

	export let data;

	const kyngGeoJsonData = data.kyngGeoJsonData as unknown as KyngGeoJsonData;

	const mapCentre: [number, number] = [-31.940026654472703, 152.40239389529367];
	const streetsUrl = `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}`;
	const streetsAttribution = `\u003ca href="https://www.spatial.nsw.gov.au" target="_blank"\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`;
	const aerialUrl = `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}`;
	const aerialAttribution = `\u003ca href="https://www.spatial.nsw.gov.au" target="_blank"\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`;
</script>

{#if data.kyngGeoJsonData}
	<LeafletMap centre={mapCentre} zoom={13}>
		<LeafletTileLayer url={aerialUrl} attribution={aerialAttribution} />
		<LeafletTileLayer url={streetsUrl} attribution={streetsAttribution} />
		<LeafletGeoJSONLayerOptions
			customizeLayerOptions={kyngAreaGeoJsonOptions}
			layerName="Kyng Area"
		>
			<LeafletGeoJSONLayer
				geoJSONData={kyngGeoJsonData.kyngArea}
				fitBounds={true}
				layerName="Kyng Area"
			/>
		</LeafletGeoJSONLayerOptions>
		<LeafletGeoJSONLayerOptions
			customizeLayerOptions={kyngPropertyAreasGeoJsonOptions}
			layerName="Property Areas"
		>
			<LeafletGeoJSONLayer geoJSONData={kyngGeoJsonData.propertyAreas} layerName="Property Areas" />
		</LeafletGeoJSONLayerOptions>
		<LeafletGeoJSONLayerOptions
			customizeLayerOptions={kyngProwayGeoJsonOptions}
			layerName="Proway Lines"
		>
			<LeafletGeoJSONLayer geoJSONData={kyngGeoJsonData.prowayLines} layerName="Proway Lines" />
		</LeafletGeoJSONLayerOptions>
		<LeafletGeoJSONLayerOptions
			customizeLayerOptions={kyngAddresspointsGeoJsonOptions}
			layerName="Address Points"
		>
			<LeafletGeoJSONLayer geoJSONData={kyngGeoJsonData.addressPoints} layerName="Address Points" />
		</LeafletGeoJSONLayerOptions>
		<LeafletGeoJSONLayerOptions
			customizeLayerOptions={kyngWayPointsGeoJsonOptions}
			layerName="Way Points"
		>
			<LeafletGeoJSONLayer geoJSONData={kyngGeoJsonData.wayPoints} layerName="Way Points" />
		</LeafletGeoJSONLayerOptions>
	</LeafletMap>
{/if}
