<script lang="ts">
	import AboutMap from '$components/map/AboutMap.svelte';

	export let data;
	let allPoints = data.mapData.jsonLayers[0];
	let registeredPoints = data.mapData.jsonLayers[1];
</script>

<svelte:head>
	<title>Profile-Community BCYCA-Map</title>
</svelte:head>

<div class="flex mx-auto flex-col w-full h-full">
	<AboutMap {allPoints} {registeredPoints} />
</div>
