<script lang="ts">
	import { page } from '$app/state';
	import Spinner from '$components/page/Spinner.svelte';

	import MapView from '$lib/map/MapView.svelte';
	import {
		kyngMapProfile,
		kyngAreaLayer,
		kyngPropertyAreasLayer,
		kyngProwayLinesLayer,
		kyngWayPointsLayer,
		kyngAddressPointsLayer
	} from '$lib/map/profiles/kyng';
	import type { MapViewTarget, ResolvedLayer } from '$lib/map/profiles/types';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const kyngGeoJsonData = $derived(data.kyngGeoJsonData);

	// View: explicit lat/lng/zoom search params win; otherwise fit the area bounds.
	const view = $derived.by<MapViewTarget>(() => {
		const lat = page.url.searchParams.get('lat');
		const lng = page.url.searchParams.get('lng');
		const zoom = page.url.searchParams.get('zoom');
		if (lat && lng && zoom) {
			return { center: [Number(lat), Number(lng)], zoom: Number(zoom) };
		}
		return { extent: kyngGeoJsonData.bounds as [[number, number], [number, number]] };
	});

	const layers = $derived<ResolvedLayer[]>([
		{ config: kyngAreaLayer, data: kyngGeoJsonData.kyngArea },
		{ config: kyngPropertyAreasLayer, data: kyngGeoJsonData.propertyAreas },
		{ config: kyngProwayLinesLayer, data: kyngGeoJsonData.prowayLines },
		{ config: kyngWayPointsLayer, data: kyngGeoJsonData.wayPoints },
		{ config: kyngAddressPointsLayer, data: kyngGeoJsonData.addressPoints }
	]);

	let mapLoaded = $state(false);
</script>

<svelte:head>
	<title>Kyng Map</title>
</svelte:head>

{#if kyngGeoJsonData}
	<div class="map-container mx-auto flex w-5/6 flex-col">
		<MapView profile={kyngMapProfile} {view} {layers} onReady={() => (mapLoaded = true)}>
			{#if !mapLoaded}
				<div class="spinner-overlay">
					<Spinner size="50" />
				</div>
			{/if}
		</MapView>
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
