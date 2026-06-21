<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic Leaflet/GeoJSON/external-library data structures */
	import { onDestroy } from 'svelte';
	import { getMapContext } from '$lib/map/map-types';
	import { getLeaflet } from '$lib/map/layer-factory';
	import type { Control as LeafletControl } from 'leaflet';

	let { position = 'topright' } = $props<{
		position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
	}>();

	const { registry, updateLayer, getMap } = getMapContext();

	// Get all overlay layers
	const overlayLayers = $derived(
		Object.values($registry).filter((layer) => layer.type === 'overlay')
	);

	let controlContainer: HTMLDivElement = $state()!;
	let leafletControl: LeafletControl | null = null;
	let L: typeof import('leaflet') | null = null;

	function toggleOverlay(layerId: string, visible: boolean) {
		const map = getMap();
		if (!map) return;

		const layer = $registry[layerId];
		if (layer?.instance) {
			if (visible) {
				layer.instance.addTo(map);
			} else if (map.hasLayer(layer.instance)) {
				map.removeLayer(layer.instance);
			}
			updateLayer(layerId, { visible });
			console.log(`OverlayLayerControl: Toggled ${layerId} to ${visible}`);
		}
	}

	// Initialize control when map, container, AND overlay layers are ready
	$effect(() => {
		const map = getMap();
		if (!map || !controlContainer || leafletControl || overlayLayers.length === 0) {
			return;
		}

		(async () => {
			try {
				const leaflet = await getLeaflet();
				L = (leaflet as any).default || leaflet;

				if (!L) {
					console.error('OverlayLayerControl: Failed to load Leaflet');
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
					`OverlayLayerControl: Added control at ${position} with ${overlayLayers.length} overlay layers`
				);
			} catch (error) {
				console.error('OverlayLayerControl: Failed to initialize control:', error);
			}
		})();

		return () => {
			if (map && leafletControl) {
				map.removeControl(leafletControl);
				leafletControl = null;
				console.log('OverlayLayerControl: Removed control from effect cleanup');
			}
		};
	});

	onDestroy(() => {
		const map = getMap();
		if (map && leafletControl) {
			map.removeControl(leafletControl);
			console.log('OverlayLayerControl: Removed control');
		}
	});
</script>

<div bind:this={controlContainer} class="leaflet-control leaflet-bar">
	<div class="bg-surface-50-950 min-w-[200px] rounded p-3 shadow-lg">
		<h3 class="text-surface-700 mb-2 text-sm font-semibold">Overlays</h3>
		{#if overlayLayers.length > 0}
			<div class="space-y-2">
				{#each overlayLayers as layer (layer)}
					<label class="hover:bg-surface-50 flex cursor-pointer items-center space-x-2 rounded p-1">
						<input
							type="checkbox"
							value={layer.id}
							checked={layer.visible}
							onchange={(e) => toggleOverlay(layer.id, e.currentTarget.checked)}
							class="text-tertiary-600 h-4 w-4 cursor-pointer"
						/>
						<span class="text-surface-800 text-sm">{layer.label || layer.id}</span>
					</label>
				{/each}
			</div>
		{:else}
			<p class="text-surface-500 text-xs">Loading overlays...</p>
		{/if}
	</div>
</div>

<style>
	:global(.leaflet-control) {
		pointer-events: auto;
	}
</style>
