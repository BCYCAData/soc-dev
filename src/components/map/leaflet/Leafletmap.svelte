<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';

	import GeomanControls from '$components/map/leaflet/controls/GeomanControls.svelte';

	import type L from 'leaflet';
	import type { LayerInfo, ControlInfo } from '$lib/leaflet/types';

	import { writable, type Writable } from 'svelte/store';

	interface Props {
		onMapReady?: () => void;
		centre?: L.LatLngExpression | [number, number] | undefined;
		initialExtent?: L.LatLngBoundsExpression | [[number, number], [number, number]] | undefined;
		zoom?: number | undefined;
		minZoom?: number | undefined;
		maxZoom?: number | undefined;
		zoomable?: boolean;
		zoomSnap?: number;
		attributionControl?: ControlInfo;
		layersControl?: ControlInfo;
		editControl?: ControlInfo;
		width?: string;
		height?: string;
		baseLayers: Array<{ name: string; url: string; attribution: string }>;
		children?: import('svelte').Snippet;
	}

	let {
		onMapReady = () => {},
		centre = undefined,
		zoom = undefined,
		initialExtent = undefined,
		minZoom = undefined,
		maxZoom = undefined,
		zoomable = true,
		zoomSnap = 0.25,
		attributionControl = { present: true },
		layersControl = { present: true, position: 'topright' },
		editControl = { present: true },
		width = '100%',
		height = '98%',
		baseLayers,
		children
	}: Props = $props();

	const boxZoom = zoomable;
	const doubleClickZoom = zoomable;
	const touchZoom = zoomable;
	const dragging = zoomable;
	const zoomDelta = zoomSnap;
	const scrollWheelZoom = zoomable;
	const keyboard = zoomable;
	const zoomControl = zoomable;

	let style = $derived(`width:${width};height:${height};`);

	// Leaflet module and map instance
	let leaflet = $state<typeof L>();
	let leafletMap = $state<L.Map>();
	let mapDiv: HTMLDivElement;

	// Controls
	let layersControlInstance: L.Control.Layers;

	// Stores for Leaflet and map instance
	const leafletStore: Writable<typeof L | null> = writable(null);
	const mapStore: Writable<L.Map | null> = writable(null);
	const layersControlStore: Writable<L.Control.Layers | null> = writable(null);
	const layersStore: Writable<Record<string, LayerInfo>> = writable({});

	// Set context for child components
	setContext('leafletContext', {
		getLeaflet: () => leaflet,
		getLeafletMap: () => leafletMap,
		getLeafletLayers: () => layersStore,
		getLayersControl: () => layersControlStore
	});

	function updateLayersControl() {
		if (leaflet && leafletMap) {
			baseLayers.forEach((layer, index) => {
				const tileLayer = leaflet?.tileLayer(layer.url, { attribution: layer.attribution });
				if (index === 0 && leafletMap) {
					tileLayer?.addTo(leafletMap);
				}
				if (layersControlInstance && tileLayer) {
					layersControlInstance.addBaseLayer(tileLayer, layer.name);
				}
			});
			leafletMap.on('overlayadd', (e: L.LayersControlEvent) => {
				layersStore.update((layers) => ({
					...layers,
					[e.name]: { ...layers[e.name], visible: true }
				}));
			});

			leafletMap.on('overlayremove', (e: L.LayersControlEvent) => {
				layersStore.update((layers) => ({
					...layers,
					[e.name]: { ...layers[e.name], visible: false }
				}));
			});
		}
	}

	onMount(async () => {
		leaflet = await import('leaflet');
		if (mapDiv && leaflet) {
			// if (editControl.present) {
			// 	const geoman = await import('@geoman-io/leaflet-geoman-free');
			// }
			leafletMap = leaflet.map(mapDiv, {
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
				attributionControl: attributionControl.present
			});
			if (initialExtent) {
				leafletMap.fitBounds(initialExtent);
			} else if (centre) {
				leafletMap.setView(centre, zoom);
			}
			if (layersControl.present) {
				layersControlInstance = leaflet.control.layers(undefined, undefined, {
					position: layersControl.position
				});
				leafletMap.addControl(layersControlInstance);
				layersControlStore.set(layersControlInstance);
			}
			updateLayersControl();
			mapStore.set(leafletMap);
			onMapReady();
		}
	});
	onDestroy(() => {
		if (leafletMap) {
			leafletMap.remove();
			mapStore.set(null);
		}
		if (layersControlInstance) {
			layersControlInstance.remove();
			layersStore.set({});
		}
		leafletStore.set(null);
		layersControlStore.set(null);
	});
</script>

<div bind:this={mapDiv} {style}>
	{#if leaflet && leafletMap}
		{#if editControl.present}
			<GeomanControls />
		{/if}
		{@render children?.()}
	{/if}
</div>
