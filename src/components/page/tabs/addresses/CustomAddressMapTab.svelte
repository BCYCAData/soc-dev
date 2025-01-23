<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';
	import LeafletArcGisFeatureServerLayer from '$components/map/leaflet/layers/LeafletArcGISFeatureServerLayer.svelte';
	import LeafletGeoJSONPointLayer from '$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte';
	import GNAFGeoJSON from '$components/map/leaflet/layers/pbf-data/GNAFGeoJSON.svelte';
	import GNAFAddressCheckForm from '$components/form/GNAFAddressCheckForm.svelte';

	import { customAddressesMapConfig, gnafAddressPointsOptions } from '$lib/leaflet/mapconfig';
	import {
		gurasPropertyPopUpTemplate,
		gnafAddressTooltipTemplate,
		gnafMultiFeaturePopupTemplate
	} from '$lib/leaflet/leafletdatatemplates';

	// import 'leaflet/dist/leaflet.css';

	interface Props {
		active: boolean;
	}

	let { active = false }: Props = $props();
	let leafletMapInstance = $state<L.Map>();
	let mapLoaded = $state(false);
	let gnafAddressPoints = $state<GeoJSON.FeatureCollection>({
		type: 'FeatureCollection',
		features: []
	});

	function handleAddressChecked(result: any) {
		if (result?.geojson?.geometry) {
			const coords = result.geojson.geometry.coordinates;
			leafletMapInstance?.setView([coords[1], coords[0]], 18);
		}
	}

	function handleMapInstance(map: L.Map) {
		leafletMapInstance = map;
	}

	function handleMapLoaded() {
		mapLoaded = true;
	}

	function handleGnafData(data: GeoJSON.FeatureCollection) {
		gnafAddressPoints = data;
	}

	$effect(() => {
		if (active && leafletMapInstance) {
			setTimeout(() => {
				leafletMapInstance?.invalidateSize();
			}, 100);
		}
	});
</script>

<div class="map-wrapper">
	<div class="map-container">
		{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: Leafletmap }}
			{#if !mapLoaded}
				<div class="spinner-overlay">
					<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
				</div>
			{/if}
			<Leafletmap
				{...customAddressesMapConfig([-31.9511, 152.2983] as [number, number])}
				onMapReady={handleMapLoaded}
				onMapInstance={handleMapInstance}
			>
				<LeafletArcGisFeatureServerLayer
					url="https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Land_Parcel_Property_Theme/FeatureServer/12"
					name="Property Theme"
					visible={true}
					popupTemplate={gurasPropertyPopUpTemplate}
				/>
				{#if leafletMapInstance}
					<GNAFGeoJSON {leafletMapInstance} onGnafData={handleGnafData} />
				{/if}
				<LeafletGeoJSONPointLayer
					geojsonData={gnafAddressPoints}
					layerName="GNAF Addresses"
					visible={true}
					editable={false}
					showInLegend={true}
					staticLayer={false}
					symbology={gnafAddressPointsOptions}
					tooltipTemplate={gnafAddressTooltipTemplate}
					multiFeaturePopupTemplate={gnafMultiFeaturePopupTemplate}
				/>
				{#await import('$components/map/leaflet/controls/LeafletScaleControl.svelte') then { default: LeafletScaleControl }}
					<LeafletScaleControl position="bottomleft" />
				{/await}
			</Leafletmap>
		{/await}
	</div>
	<div class="card mb-4 px-4">
		<GNAFAddressCheckForm onAddressChecked={handleAddressChecked} />
	</div>
</div>

<style>
	.map-wrapper {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.map-container {
		height: 55vh;
		min-height: 400px;
		position: relative;
		padding-left: 20px;
		padding-right: 20px;
		width: 100%;
	}
</style>
