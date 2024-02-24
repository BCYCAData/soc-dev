<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import { mapContext } from '$lib/map/map';

	import type { Map, Control, ControlPosition } from 'leaflet';

	export let leaflet: typeof import('leaflet');
	export let position: ControlPosition = 'bottomleft';
	export let options = {};

	const { getMap } = getContext(mapContext) as { getMap: () => Map };
	const map: Map = getMap();

	let scaleControl: Control;

	onMount(async () => {
		if (!scaleControl) {
			scaleControl = leaflet.control.scale(options).addTo(map);
		}
		scaleControl.setPosition(position);
	});

	onDestroy(() => {
		scaleControl.remove();
	});
</script>
