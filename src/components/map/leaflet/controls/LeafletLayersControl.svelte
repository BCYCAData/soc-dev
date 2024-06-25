<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import { controlLayersStore } from '$stores/leaflet';

	import type L from 'leaflet';
	import { type ControlPosition } from 'leaflet';

	export let position: ControlPosition = 'topright';

	const leaflet = (getContext('leaflet') as { getLeaflet: () => typeof L }).getLeaflet();
	const leafletMap = (getContext('leafletMap') as { getLeafletMap: () => L.Map }).getLeafletMap();

	let layersControl: L.Control.Layers;

	onMount(() => {
		layersControl = leaflet.control.layers({}, {}, { position: position }).addTo(leafletMap);
		controlLayersStore.subscribe(({ baseMaps, overlayMaps }) => {
			for (const base of baseMaps) {
				layersControl.addBaseLayer(base.layer, base.name);
			}
			for (const overlay of overlayMaps) {
				layersControl.addOverlay(overlay.layer, overlay.name);
			}
		});
		console.log(layersControl);
	});

	onDestroy(() => {
		layersControl.remove();
	});
</script>
