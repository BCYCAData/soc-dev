<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic Leaflet/GeoJSON/external-library data structures */
	import { onDestroy } from 'svelte';
	import { getMapContext } from '$lib/map/map-types';
	import { getLeaflet } from '$lib/map/layer-factory';
	import type { Control as LeafletControl } from 'leaflet';

	let { position = 'topright', collapsible = true } = $props<{
		position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
		collapsible?: boolean;
	}>();

	const { registry, updateLayer, getMap } = getMapContext();

	// Get base and overlay layers
	const baseLayers = $derived(Object.values($registry).filter((layer) => layer.type === 'base'));
	const overlayLayers = $derived(
		Object.values($registry).filter((layer) => layer.type === 'overlay')
	);

	let controlContainer: HTMLDivElement = $state()!;
	let leafletControl: LeafletControl | null = null;
	let L: typeof import('leaflet') | null = null;
	let isExpanded = $derived(!collapsible);

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
			console.log(`LayerControl: Switched to base layer ${layerId}`);
		}
	}

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
			console.log(`LayerControl: Toggled overlay ${layerId} to ${visible}`);
		}
	}

	// Initialize control when map, container, AND layers are ready
	$effect(() => {
		const map = getMap();
		const hasLayers = baseLayers.length > 0 || overlayLayers.length > 0;
		if (!map || !controlContainer || leafletControl || !hasLayers) {
			return;
		}

		(async () => {
			try {
				const leaflet = await getLeaflet();
				L = (leaflet as any).default || leaflet;

				if (!L) {
					console.error('LayerControl: Failed to load Leaflet');
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
					`LayerControl: Added control at ${position} with ${baseLayers.length} base + ${overlayLayers.length} overlay layers`
				);
			} catch (error) {
				console.error('LayerControl: Failed to initialize control:', error);
			}
		})();

		return () => {
			if (map && leafletControl) {
				map.removeControl(leafletControl);
				leafletControl = null;
				console.log('LayerControl: Removed control from effect cleanup');
			}
		};
	});

	onDestroy(() => {
		const map = getMap();
		if (map && leafletControl) {
			map.removeControl(leafletControl);
			console.log('LayerControl: Removed control');
		}
	});
</script>

<div bind:this={controlContainer} class="leaflet-control leaflet-bar">
	<div class="bg-surface-50-950 min-w-[200px] rounded shadow-lg">
		{#if collapsible}
			<button
				onclick={() => (isExpanded = !isExpanded)}
				class="hover:bg-surface-50 flex w-full items-center justify-between p-3"
			>
				<span class="text-surface-700 text-sm font-semibold">Layers</span>
				<svg
					class="h-4 w-4 transition-transform {isExpanded ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>
		{/if}

		{#if isExpanded}
			<div class="border-surface-200 border-t p-3">
				{#if baseLayers.length > 0}
					<div class="mb-3">
						<h3 class="text-surface-500 mb-2 text-xs font-semibold uppercase">Base Layers</h3>
						<div class="space-y-2">
							{#each baseLayers as layer (layer)}
								<label
									class="hover:bg-surface-50 flex cursor-pointer items-center space-x-2 rounded p-1"
								>
									<input
										type="radio"
										name="base-layer"
										value={layer.id}
										checked={layer.visible}
										onchange={() => switchBaseLayer(layer.id)}
										class="text-tertiary-600 h-4 w-4 cursor-pointer"
									/>
									<span class="text-surface-800 text-sm">{layer.label}</span>
								</label>
							{/each}
						</div>
					</div>
				{/if}

				{#if overlayLayers.length > 0}
					<div>
						<h3 class="text-surface-500 mb-2 text-xs font-semibold uppercase">Overlays</h3>
						<div class="space-y-2">
							{#each overlayLayers as layer (layer)}
								<label
									class="hover:bg-surface-50 flex cursor-pointer items-center space-x-2 rounded p-1"
								>
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
					</div>
				{/if}

				{#if baseLayers.length === 0 && overlayLayers.length === 0}
					<p class="text-surface-500 text-xs">Loading layers...</p>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	:global(.leaflet-control) {
		pointer-events: auto;
	}
</style>
