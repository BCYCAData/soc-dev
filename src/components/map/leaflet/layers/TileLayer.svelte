<script lang="ts">
	import { getContext } from 'svelte';
	import { Map as LeafletMap, tileLayer } from 'leaflet';

	export let url: string = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	export let maxZoom: number = 19;
	export let attribution: string =
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

	const { getMap } = getContext<{ getMap: () => LeafletMap }>('leaflet_map');
	const map = getMap();
	if (map) {
		const layer = tileLayer(url, {
			maxZoom,
			attribution
		});
		map.addLayer(layer);
	}
</script>
