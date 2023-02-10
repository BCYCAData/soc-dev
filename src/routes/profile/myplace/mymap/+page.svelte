<script lang="ts">
	import { map } from 'leaflet';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ mapData } = data);
	let test = JSON.stringify(mapData);
</script>

<svelte:head>
	<title>Profile-My Place-Map</title>
</svelte:head>

<pre>{test}</pre>
