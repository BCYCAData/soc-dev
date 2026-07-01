<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic form/API/map data */
	import type L from 'leaflet';
	import MapView from '$lib/map/MapView.svelte';
	import ArcGisFeatureLayer from '$lib/map/layers/live/ArcGisFeatureLayer.svelte';
	import GnafAddressLayer from '$lib/map/layers/live/GnafAddressLayer.svelte';
	import GNAFAddressCheckForm from '$components/form/GNAFAddressCheckForm.svelte';
	import { addressMapProfile } from '$lib/map/profiles/site';
	import { gurasPropertyPopUpTemplate } from '$lib/map/render/address-templates';

	interface Props {
		active: boolean;
	}

	let { active = false }: Props = $props();

	let mapInstance = $state<L.Map>();
	let mapReady = $state(false);

	function handleReady(map: L.Map) {
		mapInstance = map;
		mapReady = true;
	}

	function handleAddressChecked(result: any) {
		if (result?.geojson?.geometry) {
			const coords = result.geojson.geometry.coordinates;
			mapInstance?.setView([coords[1], coords[0]], 18);
		}
	}

	// Leaflet needs a size recalculation when the tab becomes visible.
	$effect(() => {
		if (active && mapInstance) {
			setTimeout(() => mapInstance?.invalidateSize(), 100);
		}
	});
</script>

<div class="map-wrapper">
	<div class="map-container">
		<MapView
			profile={addressMapProfile}
			view={{ center: [-31.9511, 152.2983], zoom: 15 }}
			layers={[]}
			onReady={handleReady}
			class="h-full"
		>
			<ArcGisFeatureLayer
				ready={mapReady}
				url="https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Land_Parcel_Property_Theme/FeatureServer/12"
				name="Property Theme"
				popupTemplate={gurasPropertyPopUpTemplate}
			/>
			<GnafAddressLayer ready={mapReady} />
		</MapView>
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
