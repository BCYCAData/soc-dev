<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';
	import { get, writable, type Writable } from 'svelte/store';

	import { setActiveTemplate, featureTemplates } from '$lib/leaflet/spatialutilities.svelte';

	import type L from 'leaflet';
	import type * as EsriLeaflet from 'esri-leaflet';
	import type * as LeafletDraw from 'leaflet-draw';
	import type * as LeafletEditable from 'leaflet-editable';
	import type { LayerInfo, ControlInfo } from '$lib/leaflet/types';

	interface Props {
		onMapReady?: () => void;
		onMapInstance?: (map: L.Map) => void;
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
		baseLayers?: Array<{ name: string; url: string; attribution: string }>;
		featuresByTemplate?: Record<string, GeoJSON.FeatureCollection>;
		children?: import('svelte').Snippet;
	}

	// Add this after the props declaration
	$effect(() => {
		if (leafletMap && centre) {
			leafletMap.setView(centre, zoom);
		}
	});

	let {
		onMapReady = () => {},
		onMapInstance = () => {},
		centre = undefined,
		zoom = 15,
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
		featuresByTemplate = {},
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

	let leaflet = $state<typeof L>();
	let esriLeaflet = $state<typeof EsriLeaflet>();
	let leafletDraw = $state<typeof LeafletDraw>();
	let leafletEditable = $state<typeof LeafletEditable>();
	let leafletMap = $state<L.Map>();
	let mapDiv: HTMLDivElement;

	let layersControlInstance: L.Control.Layers;

	const leafletStore: Writable<typeof L | null> = writable(null);
	const mapStore: Writable<L.Map | null> = writable(null);
	const layersControlStore: Writable<L.Control.Layers | null> = writable(null);
	const layersStore: Writable<Record<string, LayerInfo>> = writable({});

	setContext('leafletContext', {
		getLeaflet: () => leaflet,
		getLeafletMap: () => leafletMap,
		getLeafletLayers: () => layersStore,
		getLayersControl: () => layersControlStore,
		getEsriLeaflet: () => esriLeaflet,
		getLeafletDraw: () => leafletDraw,
		getLeafletEditable: () => leafletEditable
	});

	function selectLayer(layerName: string) {
		const layers = get(layersStore);
		const layer = layers[layerName];
		if (layer && layer.editable && layer.template_id) {
			const template = featureTemplates[layer.template_id];
			setActiveTemplate(template);
		}
	}

	function updateLayersControl() {
		if (leaflet && leafletMap) {
			baseLayers?.forEach((layer, index) => {
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
		const leafletModule = await import('leaflet');
		const esriLeafletModule = await import('esri-leaflet');
		const leafletDrawModule = await import('leaflet-draw');
		await import('leaflet-editable');

		leaflet = leafletModule;
		esriLeaflet = esriLeafletModule;
		leafletDraw = leafletDrawModule;

		if (mapDiv && leaflet) {
			leafletMap = leaflet.map(mapDiv, {
				editable: true,
				editOptions: {},
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
				zoomControl: false,
				attributionControl: attributionControl.present
			});
			if (zoomControl) {
				leaflet.control.zoom({ position: 'bottomleft' }).addTo(leafletMap);
			}
			if (editControl.present) {
				await import('leaflet-editable');
				leafletMap.editTools = new (window as any).L.Editable(leafletMap);
			}

			if (onMapInstance) {
				onMapInstance(leafletMap);
			}

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

			setTimeout(() => {
				leafletMap?.invalidateSize();
			}, 100);
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
			{#if editControl.present}
				{#await import('$components/map/leaflet/controls/LeafletSelectEditLayerControl.svelte') then { default: LeafletSelectEditLayerControl }}
					<LeafletSelectEditLayerControl onSelectLayer={selectLayer} {featuresByTemplate} />
				{/await}
			{/if}
		{/if}
		{@render children?.()}
	{/if}
</div>
