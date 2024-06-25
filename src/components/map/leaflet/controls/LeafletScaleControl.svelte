<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';

	import type L from 'leaflet';
	import { type ControlPosition } from 'leaflet';

	export let position: ControlPosition = 'bottomleft';
	export let options: L.Control.ScaleOptions = { imperial: false };

	const leaflet = (getContext('leaflet') as { getLeaflet: () => typeof L }).getLeaflet();
	const leafletMap = (getContext('leafletMap') as { getLeafletMap: () => L.Map }).getLeafletMap();

	let scaleControl: L.Control.Scale;

	onMount(async () => {
		if (!scaleControl) {
			scaleControl = leaflet.control.scale(options).addTo(leafletMap);
		}
		scaleControl.setPosition(position);
	});

	onDestroy(() => {
		scaleControl.remove();
	});
</script>
