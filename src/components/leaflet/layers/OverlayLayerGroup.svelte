<!-- components/leaflet/layers/OverlayLayerGroup.svelte -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createOverlay, getLeaflet } from '$lib/map/layer-factory';
	import type { Layer } from 'leaflet';
	import { getMapContext } from '$lib/map/map-types';
	import type { OverlayLayerConfig } from '$lib/map/layer-factory';

	let { overlays = [] } = $props<{
		overlays: OverlayLayerConfig[];
	}>();

	const { getMap, registerLayer, unregisterLayer, setLayerInstance, registry } = getMapContext();
	let layerInstances: Record<string, Layer> = {};

	// Initialize overlays when map is ready
	$effect(() => {
		const map = getMap();
		if (!map) return;

		(async () => {
			try {
				const L = await getLeaflet();

				for (const overlay of overlays) {
					// Skip if already created
					if (layerInstances[overlay.id]) continue;

					registerLayer({
						id: overlay.id,
						label: overlay.label,
						type: 'overlay',
						pane: overlay.pane,
						visible: overlay.visible,
						events: overlay.events
					});

					let layer: Layer | null = null;

					// Use factory if provided (for custom/ESRI layers)
					if (overlay.type === 'custom' && overlay.factory) {
						try {
							layer = overlay.factory(L);
							console.log(`OverlayLayerGroup: Created custom overlay ${overlay.id} using factory`);
						} catch (error) {
							console.error(`OverlayLayerGroup: Factory failed for ${overlay.id}:`, error);
						}
					} else {
						// Use standard createOverlay for built-in types
						layer = await createOverlay(overlay);
						console.log(`OverlayLayerGroup: Created standard overlay ${overlay.id}`);
					}

					if (layer) {
						setLayerInstance(overlay.id, layer);
						layerInstances[overlay.id] = layer;

						if (overlay.visible) {
							layer.addTo(map);
							setTimeout(() => map?.invalidateSize(), 0);
							console.log(`OverlayLayerGroup: Added overlay ${overlay.id} to map`);
						}
					} else {
						console.warn(`OverlayLayerGroup: Failed to create overlay: ${overlay.id}`);
					}
				}
			} catch (error) {
				console.error('OverlayLayerGroup: Failed to initialize overlays:', error);
			}
		})();

		// Cleanup function
		return () => {
			if (map) {
				for (const lyr of Object.values(layerInstances)) {
					if (map.hasLayer(lyr)) map.removeLayer(lyr);
				}
			}
		};
	});

	// Reactively update layer visibility based on registry changes
	$effect(() => {
		const map = getMap();
		if (!map) return;

		// Access $registry to make this effect reactive to registry changes
		const currentRegistry = $registry;

		for (const [id, meta] of Object.entries(currentRegistry)) {
			// Only handle overlay layers that we manage
			if (meta.type !== 'overlay') continue;

			const layer = layerInstances[id];
			if (!layer) continue;

			const isOnMap = map.hasLayer(layer);

			if (meta.visible && !isOnMap) {
				layer.addTo(map);
				console.log(`OverlayLayerGroup: Added ${id} to map`);
				setTimeout(() => map?.invalidateSize(), 0);
			} else if (!meta.visible && isOnMap) {
				map.removeLayer(layer);
				console.log(`OverlayLayerGroup: Removed ${id} from map`);
			}
		}
	});

	onDestroy(() => {
		const map = getMap();
		if (map) {
			for (const lyr of Object.values(layerInstances)) {
				if (map.hasLayer(lyr)) map.removeLayer(lyr);
			}
		}

		// Unregister all layers
		for (const id in layerInstances) {
			unregisterLayer(id);
		}

		layerInstances = {};
		console.log('OverlayLayerGroup: Cleaned up layers');
	});
</script>
