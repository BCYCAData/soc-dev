<script lang="ts">
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import { mapContext, layerControlContext } from '$lib/map/map';

	import type { Map, Control, ControlPosition } from 'leaflet';

	export let leaflet: typeof import('leaflet');
	export let baseMaps: Control.LayersObject;
	export let overlayMaps: Control.LayersObject;
	export let position: ControlPosition = 'topright';

	const { getMap } = getContext(mapContext) as { getMap: () => Map };
	const map: Map = getMap();

	let layerControl: Control;

	onMount(async () => {
		if (map) {
			layerControl = leaflet.control.layers(baseMaps, overlayMaps).addTo(map);
			layerControl.setPosition(position); //Possible values are 'topleft', 'topright', 'bottomleft' or 'bottomright'
		}
	});

	onDestroy(() => {
		layerControl.remove();
	});
</script>

<slot />
