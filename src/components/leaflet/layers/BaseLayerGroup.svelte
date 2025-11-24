<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Layer } from 'leaflet';
	import { getMapContext } from '$lib/map/map-types';
	import { getLeaflet } from '$lib/map/layer-factory';
	import type { BaseLayerConfig } from '$lib/map/layer-factory';

	let { layers = [], activeLayerId = $bindable<string>() } = $props<{
		layers: BaseLayerConfig[];
		activeLayerId: string;
	}>();

	const { getMap, registerLayer, unregisterLayer, updateLayer } = getMapContext();
	let layerInstances: Record<string, Layer> = {};
	let L: typeof import('leaflet') | null = null;

	onMount(async () => {
		const leaflet = await getLeaflet();
		L = (leaflet as any).default || leaflet;
	});

	// Initialize layers when map and Leaflet are ready
	$effect(() => {
		const map = getMap();
		if (!map || !L) return;

		try {
			console.log('BaseLayerGroup: Initializing with', layers.length, 'layers');

			if (!layers.length) {
				console.warn('BaseLayerGroup: No layers provided');
				return;
			}

			// Create layers using factory functions
			for (const layer of layers) {
				if (!layer.id || !layer.factory) {
					console.warn('BaseLayerGroup: Invalid layer config', layer);
					continue;
				}

				if (!layerInstances[layer.id]) {
					try {
						layerInstances[layer.id] = layer.factory(L);
						console.log(`BaseLayerGroup: Created layer ${layer.id}`);

						registerLayer({
							id: layer.id,
							label: layer.label || layer.id,
							type: 'base',
							visible: layer.id === activeLayerId,
							instance: layerInstances[layer.id]
						});
					} catch (error) {
						console.error(`BaseLayerGroup: Failed to create layer ${layer.id}:`, error);
					}
				}
			}

			// Remove all layers from map first
			for (const id in layerInstances) {
				if (map.hasLayer(layerInstances[id])) {
					map.removeLayer(layerInstances[id]);
					console.log(`BaseLayerGroup: Removed layer ${id} from map`);
				}
			}

			// Add only the active layer
			const active = layerInstances[activeLayerId];
			if (active) {
				active.addTo(map);
				console.log(`BaseLayerGroup: Added layer ${activeLayerId} to map`);
				setTimeout(() => map.invalidateSize(), 0);
			} else {
				console.warn(`BaseLayerGroup: No active layer found for ID: ${activeLayerId}`);
			}
		} catch (error) {
			console.error('BaseLayerGroup: Failed to initialize base layers:', error);
		}

		// Cleanup function for this effect
		return () => {
			if (map) {
				for (const lyr of Object.values(layerInstances)) {
					if (map.hasLayer(lyr)) map.removeLayer(lyr);
				}
			}
		};
	});

	// React to activeLayerId changes
	$effect(() => {
		const map = getMap();
		if (!map || !L) return;

		console.log(`BaseLayerGroup: Switching to layer ${activeLayerId}`);

		// Remove all base layers
		for (const id in layerInstances) {
			if (map.hasLayer(layerInstances[id])) {
				map.removeLayer(layerInstances[id]);
				updateLayer(id, { visible: false });
			}
		}

		// Add active layer
		const active = layerInstances[activeLayerId];
		if (active) {
			active.addTo(map);
			updateLayer(activeLayerId, { visible: true });
			console.log(`BaseLayerGroup: Activated layer ${activeLayerId}`);
		}
	});

	onDestroy(() => {
		// Unregister all layers
		for (const id in layerInstances) {
			unregisterLayer(id);
		}

		layerInstances = {};
		console.log('BaseLayerGroup: Cleaned up layers');
	});
</script>
