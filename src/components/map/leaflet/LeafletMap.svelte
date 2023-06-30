<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { Map as LeafletMap } from 'leaflet';

	import 'leaflet/dist/leaflet.css';

	setContext('leaflet_map', {
		getMap: () => map
	});

	export let lat = -31.940026654472703;
	export let lon = 152.40239389529367;
	export let zoom = 15;
	export let width = '100%';
	export let height = '100%';

	$: style = `width:${width};height:${height};`;

	let container: HTMLDivElement;
	let map: LeafletMap;

	onMount(() => {
		map = new LeafletMap(container).setView([lat, lon], zoom);
		return () => {
			map.remove();
		};
	});
</script>

<div bind:this={container} {style}>
	{#if map}
		<slot />
	{/if}
</div>
