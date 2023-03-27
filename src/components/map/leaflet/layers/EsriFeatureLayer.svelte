<script lang="ts">
	import { getContext } from 'svelte';
	import type { Map as LeafletMap } from 'leaflet';
	import { featureLayer } from 'esri-leaflet';

	export let url: string =
		'https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Elevation_and_Depth_Theme/FeatureServer/2';

	const { getMap } = getContext<{ getMap: () => LeafletMap }>('leaflet_map');
	const map = getMap();
	if (map) {
		const layer = featureLayer({
			url: url
		});
		map.addLayer(layer);
	}
</script>
