<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getLeaflet } from '$lib/map/layer-factory';
	import { writable } from 'svelte/store';
	import type { Map } from 'leaflet';
	import { setMapContext, type LayerMeta } from '$lib/map/map-types';

	interface Props {
		center?: [number, number];
		zoom?: number;
		options?: any;
		children?: import('svelte').Snippet;
	}

	let { center = [-35.5, 148.2], zoom = 10, options = {}, children }: Props = $props();

	let map = $state<Map | null>(null);
	let mapElement!: HTMLDivElement;

	const registry = writable<Record<string, LayerMeta>>({});

	// Set context - pass the store itself, not the dereferenced value
	setMapContext({
		getMap: () => map,
		registry,
		registerLayer: (layer: LayerMeta) => {
			registry.update((r) => ({ ...r, [layer.id]: layer }));
		},
		unregisterLayer: (id: string) => {
			registry.update((r) => {
				const newRegistry = { ...r };
				delete newRegistry[id];
				return newRegistry;
			});
		},
		updateLayer: (id: string, patch: Partial<LayerMeta>) => {
			registry.update((r) => ({
				...r,
				[id]: { ...r[id], ...patch }
			}));
		},
		setLayerInstance: (id: string, instance: L.Layer) => {
			registry.update((r) => ({
				...r,
				[id]: { ...r[id], instance }
			}));
		}
	});

	onMount(async () => {
		if (!mapElement) {
			console.error('NewMap: Map element not found');
			return;
		}
		try {
			const L = await getLeaflet();
			console.log('NewMap: Leaflet loaded');
			map = L.map(mapElement, { center, zoom, ...options });
			setTimeout(() => map?.invalidateSize(), 0);
			console.log('NewMap: Map initialized with center', center, 'zoom', zoom);
		} catch (error) {
			console.error('NewMap: Failed to initialize Leaflet map:', error);
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
			map = null;
			console.log('NewMap: Map destroyed');
		}
	});
</script>

<div bind:this={mapElement} class="map-container"></div>

{@render children?.()}

<style>
	.map-container {
		width: 100%;
		height: 100%;
	}
</style>
