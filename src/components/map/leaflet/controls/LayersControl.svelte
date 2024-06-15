<script lang="ts">
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import {
		leafletContext,
		type LeafletBaseMapLayer,
		type LeafletOverlayMapLayer
	} from '$lib/map/map';

	import type { Map, Control, ControlPosition } from 'leaflet';

	export let baseMapLayers: LeafletBaseMapLayer[];
	export let overlayMapLayers: LeafletOverlayMapLayer[] | undefined = undefined;
	export let position: ControlPosition = 'topright';

	const { getLeafletMap } = getContext(leafletContext) as { getLeafletMap: () => Map };
	const map: Map = getLeafletMap();
	const { getLeaflet } = getContext(leafletContext) as {
		getLeaflet: () => typeof import('leaflet');
	};
	const leaflet: typeof import('leaflet') = getLeaflet();

	let layerControl: Control.Layers;

	onMount(async () => {
		if (map) {
			layerControl = leaflet.control.layers(undefined, undefined).addTo(map);
			layerControl.setPosition(position); //Possible values are 'topleft', 'topright', 'bottomleft' or 'bottomright'
			for (let i = 0; i < baseMapLayers.length; i++) {
				const { lable, url, options } = baseMapLayers[i];
				// if (i === 0) {
				// 	leaflet.tileLayer(url, options).addTo(map);
				// }
				layerControl.addBaseLayer(leaflet.tileLayer(url, options), lable);
			}
			if (overlayMapLayers) {
				for (let i = 0; i < overlayMapLayers.length; i++) {
					layerControl.addOverlay(overlayMapLayers[i].data, overlayMapLayers[i].name);
				}
			}
		}
	});

	setContext(leafletContext, {
		getLayerControl: () => layerControl
	});

	console.log('layerControl context', map);

	onDestroy(() => {
		layerControl.remove();
	});
</script>

<slot />
