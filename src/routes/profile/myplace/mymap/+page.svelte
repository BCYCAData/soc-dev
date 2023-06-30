<script lang="ts">
	import PropertyMap from '$components/map/PropertyMap.svelte';

	export let data;
	$: ({ mapLayers, mapCentre, minZoom } = data);
</script>

<svelte:head>
	<title>Profile-My Place-Map</title>
</svelte:head>

<PropertyMap {mapLayers} {mapCentre} />
