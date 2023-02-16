<script lang="ts">
	import PropertyMap from '$components/map/PropertyMap.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ mapLayers } = data);
	let test = JSON.stringify(mapLayers);
</script>

<svelte:head>
	<title>Profile-My Place-Map</title>
</svelte:head>

<!-- <pre>{JSON.stringify(mapData)}</pre> -->

<PropertyMap {mapLayers} />
