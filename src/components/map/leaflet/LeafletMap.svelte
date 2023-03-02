<!-- <script lang="ts">
	import { Map as LeafletMap } from 'leaflet';
	import { setContext } from 'svelte';
	// import { tiledMapLayer } from 'esri-leaflet';
	// import 'leaflet/dist/leaflet.css';

	// import type { MapDataJSON, MapObject, MapTileLayerObject } from '$lib/types';

	// export let mapObject: MapOptions;
	// export let baseLayers: any[];

	setContext('leaflet_map', {
		getMap: () => map
	});

	export let lat: number = 0;
	export let lon: number = 0;
	export let zoom: number = 5;
	export let width: string = '100%';
	export let height: string = '100px';

	$: style = `width:${width};height:${height};`;

	const map = (domNode: HTMLDivElement) => {
		const map = new LeafletMap(domNode).setView([lat, lon], zoom);
		// map.setView([mapObject.centre[0], mapObject.centre[1]], mapObject.zoom);
		console.log(map.getCenter());
		// if (mapObject.maxBounds) {
		// 	map.setMaxBounds(mapObject.maxBounds);
		// }
		// if (mapObject.zoomControl) {
		// 	map.addControl(map.zoomControl);
		// } else {
		// 	map.removeControl(map.zoomControl);
		// }
		// Add a Feature Layer
		// baseLayers[1].addTo(map);
	};
</script>

<div use:map {style}>
	<slot />
</div> -->
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
