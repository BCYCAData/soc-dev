<script lang="ts">
	import AboutMap from '$components/map/AboutMap.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let mapLayers = data.mapData;
</script>

<svelte:head>
	<title>Profile-Community-Map</title>
</svelte:head>

<div class="flex mx-auto flex-col w-full h-full">
	<AboutMap {mapLayers} />
</div>
