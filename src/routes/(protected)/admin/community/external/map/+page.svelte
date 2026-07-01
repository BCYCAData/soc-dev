<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';

	import MapView from '$lib/map/MapView.svelte';
	import {
		communityMapProfile,
		communityAreaLayer,
		projectAddressPointsLayer,
		registeredAddressPointsLayer
	} from '$lib/map/profiles/community';
	import type { MapViewTarget, ResolvedLayer } from '$lib/map/profiles/types';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const view = $derived<MapViewTarget>({ extent: data.mapExtent });

	const layers = $derived<ResolvedLayer[]>([
		{ config: communityAreaLayer, data: data.community },
		{ config: projectAddressPointsLayer, data: data.addressPoints },
		{ config: registeredAddressPointsLayer, data: data.registeredPoints }
	]);

	let mapLoaded = $state(false);
</script>

<svelte:head>
	<title>Admin-Community External-Map</title>
</svelte:head>

{#if data.mapExtent}
	<div class="map-container mx-auto flex w-5/6 flex-col">
		<MapView profile={communityMapProfile} {view} {layers} onReady={() => (mapLoaded = true)}>
			{#if !mapLoaded}
				<div class="spinner-overlay">
					<Spinner size="100" />
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
