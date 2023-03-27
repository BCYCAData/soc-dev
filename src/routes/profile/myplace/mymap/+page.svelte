<script lang="ts">
	import type { PageData } from './$types';

	import PropertyMap from '$components/map/PropertyMap.svelte';
	export let data: PageData;
	$: ({ mapLayers, mapCentre, minZoom } = data);
</script>

<svelte:head>
	<title>Profile-My Place-Map</title>
</svelte:head>

<PropertyMap {mapLayers} {mapCentre} />
