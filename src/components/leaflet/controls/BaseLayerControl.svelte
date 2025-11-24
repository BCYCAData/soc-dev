<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getMapContext } from '$lib/map/map-types';
	import { getLeaflet } from '$lib/map/layer-factory';
	import type { Control as LeafletControl } from 'leaflet';

	let { position = 'topright' } = $props<{
		position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
	}>();

	const { registry, updateLayer, getMap } = getMapContext();

	// Get all base layers - now reactive to store changes
	const baseLayers = $derived(Object.values($registry).filter((layer) => layer.type === 'base'));

	// Add debug logging
	$effect(() => {
		console.log('BaseLayerControl: registry', $registry);
		console.log('BaseLayerControl: baseLayers count', baseLayers.length);
	});

	let controlContainer: HTMLDivElement = $state()!;
	let leafletControl: LeafletControl | null = null;
	let L: typeof import('leaflet') | null = null;

	function switchBaseLayer(layerId: string) {
		const map = getMap();
		if (!map) return;

		// Hide all base layers first
		for (const layer of baseLayers) {
			if (layer.instance && map.hasLayer(layer.instance)) {
				map.removeLayer(layer.instance);
			}
			updateLayer(layer.id, { visible: false });
		}

		// Show the selected base layer
		const selectedLayer = $registry[layerId];
		if (selectedLayer?.instance) {
			selectedLayer.instance.addTo(map);
			updateLayer(layerId, { visible: true });
			console.log(`BaseLayerControl: Switched to ${layerId}`);
		}
	}

	// Initialize control when map, container, AND base layers are ready
	$effect(() => {
		const map = getMap();
		if (!map || !controlContainer || leafletControl || baseLayers.length === 0) {
			return;
		}

		(async () => {
			try {
				const leaflet = await getLeaflet();
				L = (leaflet as any).default || leaflet;

				if (!L) {
					console.error('BaseLayerControl: Failed to load Leaflet');
					return;
				}

				const CustomControl = L.Control.extend({
					onAdd: function () {
						return controlContainer;
					},
					onRemove: function () {
						// Cleanup if needed
					}
				});

				leafletControl = new CustomControl({ position });
				leafletControl.addTo(map);

				console.log(
					`BaseLayerControl: Added control at ${position} with ${baseLayers.length} base layers`
				);
			} catch (error) {
				console.error('BaseLayerControl: Failed to initialize control:', error);
			}
		})();

		return () => {
			if (map && leafletControl) {
				map.removeControl(leafletControl);
				leafletControl = null;
				console.log('BaseLayerControl: Removed control from effect cleanup');
			}
		};
	});

	onDestroy(() => {
		const map = getMap();
		if (map && leafletControl) {
			map.removeControl(leafletControl);
			console.log('BaseLayerControl: Removed control');
		}
	});
</script>

<div bind:this={controlContainer} class="leaflet-control leaflet-bar">
	<div class="min-w-[200px] rounded bg-white p-3 shadow-lg">
		<h3 class="mb-2 text-sm font-semibold text-gray-700">Base Layers</h3>
		{#if baseLayers.length > 0}
			<div class="space-y-2">
				{#each baseLayers as layer}
					<label class="flex cursor-pointer items-center space-x-2 rounded p-1 hover:bg-gray-50">
						<input
							type="radio"
							name="base-layer"
							value={layer.id}
							checked={layer.visible}
							onchange={() => switchBaseLayer(layer.id)}
							class="h-4 w-4 cursor-pointer text-blue-600"
						/>
						<span class="text-sm text-gray-800">{layer.label}</span>
					</label>
				{/each}
			</div>
		{:else}
			<p class="text-xs text-gray-500">Loading layers...</p>
		{/if}
	</div>
</div>

<style>
	:global(.leaflet-control) {
		pointer-events: auto;
	}
</style>
