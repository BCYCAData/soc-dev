<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';
	import type { AddressPointsGeoJSON } from '$lib/data/spatial/types';
	import {
		aboutMapConfig,
		projectAddresspointsOptions,
		registeredAddresspointsOptions
	} from '$lib/leaflet/mapconfig';

	interface Props {
		addressPointsGeoJSON: AddressPointsGeoJSON;
	}

	let { addressPointsGeoJSON }: Props = $props();

	let mapLoaded = $state(false);

	const focusAreas = [
		{
			title: 'The Burrell Creek Hall',
			description:
				'an emergency information hub, a place where up-to-date accurate, current information is available.'
		},
		{
			title: 'KYNGs',
			description:
				'Know Your Neighbour Groups - Community groups who work together to provide information, connection and support.'
		},
		{
			title: 'Digital Online Mapping',
			description:
				'this website. A digital representation of our local information, that we own and update.'
		},
		{
			title: 'Workshops',
			description:
				'locally run workshops to increase community preparedness, through knowledge sharing.'
		}
	];

	const handleMapLoaded = () => (mapLoaded = true);
</script>

<svelte:head>
	<title>Project Overview - Strengthen OUR Community</title>
	<meta
		name="description"
		content="Explore our community resilience project focusing on emergency preparedness, local connections, and digital mapping"
	/>
</svelte:head>

<article class="grid h-full grid-rows-[auto_auto_auto_1fr] gap-4 overflow-hidden">
	<header class="text-center">
		<h1 class="h1 text-primary-600">Strengthen OUR Community</h1>
		<p class="text-xl">
			This project empowers our community to take responsibility for being prepared and <br /> working
			together to make a difference.
		</p>
	</header>

	<section class="text-center">
		<h2 class="h2 text-primary-600">Our aim: Prepare, Connect and Rebound</h2>
	</section>

	<section class="mx-auto max-w-3xl">
		<strong>The project focuses on four areas:</strong>
		<ol class="mt-0 space-y-1">
			{#each focusAreas as area}
				<li>
					<strong>{area.title}</strong> - {area.description}
				</li>
			{/each}
		</ol>

		<p class="h4 my-3 text-center font-semibold">
			This map shows the <span class="text-primary">properties</span> that have participated
		</p>
	</section>

	<section
		class="mx-auto flex h-[calc(100vh-400px)] w-full max-w-3xl flex-col overflow-hidden px-4"
	>
		{#if addressPointsGeoJSON}
			{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
				{#if !mapLoaded}
					<div class="flex items-center justify-center">
						<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
					</div>
				{/if}

				<LeafletMap
					{...aboutMapConfig(
						addressPointsGeoJSON.initialExtent as [[number, number], [number, number]]
					)}
					onMapReady={handleMapLoaded}
				>
					{#await import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte') then { default: LeafletGeoJSONPointLayer }}
						<LeafletGeoJSONPointLayer
							geojsonData={addressPointsGeoJSON.allAddresspoints}
							layerName="Project Address Points"
							visible={true}
							symbology={projectAddresspointsOptions}
							staticLayer={false}
							showInLegend={true}
							editable={false}
						/>
						<LeafletGeoJSONPointLayer
							geojsonData={addressPointsGeoJSON.registeredAddresspoints}
							layerName="Registered Address Points"
							visible={true}
							symbology={registeredAddresspointsOptions}
							staticLayer={false}
							showInLegend={true}
							editable={false}
						/>
					{/await}

					{#await import('$components/map/leaflet/controls/LeafletScaleControl.svelte') then { default: LeafletScaleControl }}
						<LeafletScaleControl position="bottomleft" />
					{/await}
				</LeafletMap>
			{/await}
		{:else}
			<p class="text-surface-500 mt-4 text-center">Unable to load map data</p>
		{/if}
	</section>
</article>
