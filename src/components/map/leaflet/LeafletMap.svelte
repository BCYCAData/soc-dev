<script lang="ts">
	import { onDestroy, setContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	import type L from 'leaflet';

	import 'leaflet/dist/leaflet.css';
	import '$components/map/leaflet/custom.css';
	import { addOrUpdateLayer, geoJSONLayersStore, tileLayersStore, userInfo } from '$stores/leaflet';

	export let centre: L.LatLngExpression;
	export let zoom: number = 15;
	export let minZoom: number | undefined = undefined;
	export let maxZoom: number | undefined = undefined;
	export let zoomControl: boolean = true;
	export let attributionControl: boolean = true;
	export let boxZoom: boolean = true;
	export let doubleClickZoom: boolean = true;
	export let touchZoom: boolean = true;
	export let dragging: boolean = true;
	export let zoomSnap: number = 1;
	export let zoomDelta: number = 1;
	export let scrollWheelZoom: boolean = true;
	export let keyboard: boolean = true;
	export let layersControl: boolean = false;
	export let width = '100%';
	export let height = '98%';

	$: style = `width:${width};height:${height};`;

	const tileLayers = writable<L.TileLayer[]>([]);
	const geoJSONLayers = writable<L.GeoJSON[]>([]);

	let leaflet: typeof L;
	let leafletMap: L.Map;
	let mapDiv: HTMLDivElement;

	setContext('leaflet', {
		getLeaflet: () => leaflet
	});

	setContext('leafletMap', {
		getLeafletMap: () => leafletMap
	});

	setContext('tileLayers', tileLayers);

	setContext('geoJSONLayers', geoJSONLayers);

	onMount(async () => {
		leaflet = await import('leaflet');
		leafletMap = leaflet
			.map(mapDiv, {
				minZoom,
				maxZoom,
				zoomSnap,
				zoomDelta,
				boxZoom,
				doubleClickZoom,
				touchZoom,
				scrollWheelZoom,
				dragging,
				keyboard,
				zoomControl,
				attributionControl
			})
			.setView(centre, zoom);
		if (layersControl) {
			tileLayersStore.subscribe((tileLayers) => {
				for (const layerName in tileLayers) {
					const { layer, layerMode, layerName: name } = tileLayers[layerName];
					if (layerMode !== 'fixedMap') {
						addOrUpdateLayer(layerMode === 'baseMaps' ? 'baseMaps' : 'overlayMaps', {
							layer,
							name
						});
					}
				}
			});
			geoJSONLayersStore.subscribe((geoJSONLayers) => {
				for (const layerName in geoJSONLayers) {
					const { layer, layerMode, layerName: name } = geoJSONLayers[layerName];
					if (layerMode !== 'fixedMap') {
						addOrUpdateLayer(layerMode === 'baseMaps' ? 'baseMaps' : 'overlayMaps', {
							layer,
							name
						});
					}
				}
			});
		}
		// leafletMap.on('click', function (e) {
		// 	// Example of updating user info based on click coordinates
		// 	console.log(e);
		// 	// console.log(JSON.stringify(e));
		// 	userInfo.set({
		// 		name: 'Clicked Location',
		// 		details: `Latitude: ${e.latlng.lat}, Longitude: ${e.latlng.lng}`
		// 	});
		// });
	});

	onDestroy(() => {
		leafletMap?.remove();
	});
</script>

<div bind:this={mapDiv} {style}>
	{#if leaflet && leafletMap}
		<slot />
	{/if}
</div>
