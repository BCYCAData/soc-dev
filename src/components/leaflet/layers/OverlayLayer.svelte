<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getMapContext } from '$lib/map/map-types';
	import { getLeaflet } from '$lib/map/layer-factory';

	let {
		type = 'geojson',
		data,
		options = {},
		visible = true
	} = $props<{
		type?: 'geojson' | 'marker' | 'polyline';
		data: any;
		options?: any;
		visible?: boolean;
	}>();

	const { getMap } = getMapContext();
	let layer: L.Layer | null = null;
	let map: L.Map | null = null;

	onMount(async () => {
		const L = await getLeaflet();
		map = getMap();
		if (!map || !data) return;

		switch (type) {
			case 'geojson':
				layer = L.geoJSON(data, options);
				break;
			case 'marker':
				layer = L.marker(data, options);
				break;
			case 'polyline':
				layer = L.polyline(data, options);
				break;
			default:
				layer = null;
		}

		if (visible && map && layer) {
			layer.addTo(map);
		}
	});

	$effect(() => {
		if (map && layer) {
			visible ? layer.addTo(map) : map.removeLayer(layer);
		}
	});

	onDestroy(() => {
		if (map && layer && map.hasLayer(layer)) {
			map.removeLayer(layer);
		}
	});
</script>
