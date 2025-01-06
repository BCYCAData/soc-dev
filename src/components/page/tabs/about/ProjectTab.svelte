<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';
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

	// const pointStyles = {
	// 	project: {
	// 		type: 'custom',
	// 		options: {
	// 			markerShape: 'circle',
	// 			fillColour: '#a5a5a5',
	// 			size: 6,
	// 			strokeColour: '#000',
	// 			strokeWidth: 0,
	// 			strokeOpacity: 0,
	// 			fillOpacity: 0.8
	// 		}
	// 	} as PointSymbologyOptions,
	// 	registered: {
	// 		type: 'custom',
	// 		options: {
	// 			markerShape: 'circle',
	// 			fillColour: '#f97316',
	// 			size: 8,
	// 			strokeColour: '#000',
	// 			strokeWidth: 0,
	// 			strokeOpacity: 0,
	// 			fillOpacity: 1
	// 		}
	// 	} as PointSymbologyOptions
	// };

	const handleMapLoaded = () => (mapLoaded = true);
</script>

<svelte:head>
	<title>Project Overview - Strengthen OUR Community</title>
	<meta
		name="description"
		content="Explore our community resilience project focusing on emergency preparedness, local connections, and digital mapping"
	/>
</svelte:head>

<article class="project-container">
	<header class="project-header">
		<h1>Strengthen OUR Community</h1>
		<p class="text-xl">
			This project empowers our community to take responsibility for being prepared and <br /> working
			together to make a difference.
		</p>
	</header>

	<section class="project-mission">
		<h2>Our aim: Prepare, Connect and Rebound</h2>
	</section>

	<section class="project-areas">
		<strong>The project focuses on four areas:</strong>
		<ol>
			{#each focusAreas as area}
				<li>
					<strong>{area.title}</strong> - {area.description}
				</li>
			{/each}
		</ol>

		<p class="map-description">
			This map shows the <span class="text-primary">properties</span> that have participated
		</p>
	</section>

	<section class="project-map">
		{#if addressPointsGeoJSON}
			{#await import('$components/map/leaflet/Leafletmap.svelte') then { default: LeafletMap }}
				{#if !mapLoaded}
					<div class="spinner-container">
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
							geojsonData={addressPointsGeoJSON.registeredAddresspoints}
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
			<p class="error-message">Unable to load map data</p>
		{/if}
	</section>
</article>

<style lang="postcss">
	.project-container {
		@apply grid h-full grid-rows-[auto_auto_auto_1fr] gap-4 overflow-hidden;
	}

	.project-header {
		@apply text-center;
		h1 {
			@apply h1 text-primary-600;
		}
	}

	.project-mission {
		@apply text-center;
		h2 {
			@apply h2 text-primary-600;
		}
	}

	.project-areas {
		@apply mx-auto max-w-3xl;
		ol {
			@apply mt-0 space-y-1;
		}
	}

	.project-map {
		@apply mx-auto flex w-full max-w-3xl flex-col overflow-hidden px-4;
		height: calc(100vh - 400px); /* Dynamic height calculation */
	}

	:global(.project-map > *) {
		@apply h-full w-full flex-1;
	}

	.map-description {
		@apply h4 my-3 text-center font-semibold;
	}

	.spinner-container {
		@apply flex items-center justify-center;
	}

	.error-message {
		@apply mt-4 text-center text-surface-500;
	}
</style>
