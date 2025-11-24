<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getMapContext } from '$lib/map/map-types';
	import { getLeaflet } from '$lib/map/layer-factory';

	let {
		url,
		options = {},
		visible = true
	} = $props<{
		url: string;
		options?: L.TileLayerOptions;
		visible?: boolean;
	}>();

	const { getMap } = getMapContext();
	let layer: L.TileLayer | null = null;
	let map: L.Map | null = null;

	onMount(async () => {
		const L = await getLeaflet();
		map = getMap();
		layer = L.tileLayer(url, options);
		if (visible && map) layer.addTo(map);
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
