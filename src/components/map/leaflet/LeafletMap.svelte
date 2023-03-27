<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { Map as LeafletMap } from 'leaflet';

	import 'leaflet/dist/leaflet.css';

	setContext('leaflet_map', {
		getMap: () => map
	});

	export let lat: number = -31.940026654472703;
	export let lon: number = 152.40239389529367;
	export let zoom: number = 15;
	export let width: string = '100%';
	export let height: string = '100%';

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
