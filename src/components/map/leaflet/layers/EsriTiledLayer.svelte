<script lang="ts">
	import { getContext } from 'svelte';
	import type { Map as LeafletMap } from 'leaflet';
	import { tiledMapLayer } from 'esri-leaflet';

	export let url: string =
		'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer';
	// export let maxZoom: number = 19;
	// export let attribution: string =
	// 	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
	export let useCors = true;

	// let x = tiledMapLayer({
	// 	url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer',
	// 	useCors: false
	// });
	// console.log('x', x);
	// x.addTo(map);

	const { getMap } = getContext<{ getMap: () => LeafletMap }>('leaflet_map');
	const map = getMap();
	if (map) {
		const layer = tiledMapLayer({
			url: url,
			useCors: useCors
		});
		console.log('layer', layer);
		console.log('map', map);
		map.addLayer(layer);
	}
</script>
