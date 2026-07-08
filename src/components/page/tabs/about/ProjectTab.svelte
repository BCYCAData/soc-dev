<script lang="ts">
	import type { AddressPointsGeoJSON } from '$lib/data/spatial/types';
	import MapView from '$lib/map/MapView.svelte';
	import { siteStreetsProfile } from '$lib/map/profiles/site';
	import {
		projectAddressPointsLayer,
		registeredAddressPointsLayer
	} from '$lib/map/profiles/community';
	import type { ResolvedLayer } from '$lib/map/profiles/types';

	interface Props {
		addressPointsGeoJSON: AddressPointsGeoJSON;
	}

	let { addressPointsGeoJSON }: Props = $props();

	let layers = $derived<ResolvedLayer[]>([
		{ config: projectAddressPointsLayer, data: addressPointsGeoJSON?.allAddresspoints ?? null },
		{
			config: registeredAddressPointsLayer,
			data: addressPointsGeoJSON?.registeredAddresspoints ?? null
		}
	]);

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
		<p class="text-base sm:text-xl">
			This project empowers our community to take responsibility for being prepared and
			<br class="hidden sm:inline" /> working together to make a difference.
		</p>
	</header>

	<section class="text-center">
		<h2 class="h2 text-primary-600">Our aim: Prepare, Connect and Rebound</h2>
	</section>

	<section class="mx-auto max-w-3xl">
		<strong>The project focuses on four areas:</strong>
		<ol class="mt-0 space-y-1">
			{#each focusAreas as area (area)}
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
		class="mx-auto flex h-[45vh] min-h-75 w-full max-w-3xl flex-col overflow-hidden px-0 sm:h-[calc(100vh-400px)] sm:px-4"
	>
		{#if addressPointsGeoJSON}
			<MapView
				profile={siteStreetsProfile}
				view={{
					extent: addressPointsGeoJSON.initialExtent as [[number, number], [number, number]]
				}}
				{layers}
				class="h-full"
			/>
		{:else}
			<p class="text-surface-500 mt-4 text-center">Unable to load map data</p>
		{/if}
	</section>
</article>
