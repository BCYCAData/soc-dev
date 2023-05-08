<script lang="ts">
	import AboutMap from '$components/map/AboutMap.svelte';

	export let data;
	let mapLayers = data.mapData;
</script>

<svelte:head>
	<title>Profile-Community-Map</title>
</svelte:head>

<div class="flex mx-auto flex-col w-full h-full">
	<AboutMap {mapLayers} />
</div>
