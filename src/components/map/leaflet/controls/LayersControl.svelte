<script lang="ts">
	import { getContext } from 'svelte';
	import { control, type ControlPosition } from 'leaflet';

	import type { Map as LeafletMap } from 'leaflet';

	import 'leaflet/dist/leaflet.css';

	export let baseMaps = {};
	export let overlayMaps = {};
	export let position: ControlPosition = 'topright';

	const { getMap } = getContext<{ getMap: () => LeafletMap }>('leaflet_map');
	const map = getMap();

	if (map) {
		const layerControl = control.layers(baseMaps, overlayMaps).addTo(map);
		layerControl.setPosition(position); //Possible values are 'topleft', 'topright', 'bottomleft' or 'bottomright'
	}
</script>
