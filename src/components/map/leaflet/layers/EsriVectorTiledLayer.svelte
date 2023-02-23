<script lang="ts">
	import { getContext } from 'svelte';
	import type { Map as LeafletMap } from 'leaflet';
	import { vectorTileLayer } from 'esri-leaflet-vector';

	export let url: string =
		'https://portal.spatial.nsw.gov.au/vectortileservices/rest/services/Hosted/NSW_BaseMap_VectorTile_DarkGrey/VectorTileServer';

	const { getMap } = getContext<{ getMap: () => LeafletMap }>('leaflet_map');
	const map = getMap();
	if (map) {
		const layer = vectorTileLayer(url, {});
		map.addLayer(layer);
	}
</script>
