<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- esri-leaflet/GeoJSON dynamic data */
	import { getContext, onDestroy } from 'svelte';
	import type L from 'leaflet';
	import { LEAFLET_CONTEXT_KEY, type LeafletContext } from '$lib/map/createLeafletMap';

	interface Props {
		/** Gate: true once MapView has created the map (parent passes onReady state). */
		ready: boolean;
		url: string;
		name: string;
		visible?: boolean;
		style?: L.PathOptions;
		popupTemplate?: (properties: any) => string;
	}

	let { ready, url, name, visible = true, style, popupTemplate }: Props = $props();

	const ctx = getContext<LeafletContext>(LEAFLET_CONTEXT_KEY);
	const layerId = $derived(`arcgis:${name}`);
	let initialized = false;

	// esri-leaflet's featureLayer fetches by viewport/zoom natively, so unlike the v1
	// component we don't page the query manually — just add it and let it manage itself.
	$effect(() => {
		if (!ready || initialized) return;
		const map = ctx.getLeafletMap();
		if (!map) return;
		initialized = true;

		(async () => {
			const esri = await import('esri-leaflet');
			const featureLayer = esri.featureLayer({
				url,
				style: () =>
					style ?? {
						color: '#FF0000',
						weight: 0.5,
						opacity: 1,
						fillColor: '#FF0000',
						fillOpacity: 0.1
					},
				onEachFeature: (feature: GeoJSON.Feature, layer: L.Layer) => {
					if (popupTemplate) layer.bindPopup(popupTemplate(feature.properties));
				}
			});
			ctx.registerLayer({
				id: layerId,
				name,
				type: 'geojson',
				visible,
				leafletLayer: featureLayer as unknown as L.Layer
			});
		})();
	});

	onDestroy(() => ctx.unregisterLayer(layerId));
</script>
