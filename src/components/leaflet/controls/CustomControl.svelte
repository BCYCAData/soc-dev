<script lang="ts">
	import { onMount, onDestroy, type Snippet } from 'svelte';
	import L from 'leaflet';
	import type { ControlPosition, Control } from 'leaflet';
	import { getMapContext } from '$lib/map/map-types';

	let {
		position = 'topright',
		visible = true,
		className = 'leaflet-custom-control',
		children
	} = $props<{
		position?: ControlPosition;
		visible?: boolean;
		className?: string;
		children?: Snippet;
	}>();

	let control = $state<Control | null>(null);
	let container = $state<HTMLDivElement | null>(null);

	const { getMap } = getMapContext();
	let map: L.Map | null = null;

	onMount(async () => {
		map = getMap();
		console.log('OverlayLayerGroup map:', map);
		const Custom = L.Control.extend({
			onAdd() {
				container = L.DomUtil.create('div', className);
				return container;
			},
			onRemove() {
				if (container?.parentNode) {
					container.parentNode.removeChild(container);
				}
			}
		});

		control = new Custom({ position });
		if (visible && map) control.addTo(map);
	});

	// Reactively handle visibility
	$effect(() => {
		if (!map || !control) return;
		if (visible) {
			control.addTo(map);
		} else {
			control.remove();
		}
	});

	//  Cleanup on destroy
	onDestroy(() => {
		if (control) {
			control.remove();
			control = null;
		}
		container = null;
	});
</script>

{#if container}
	<!--  Use @render to inject Svelte content into the Leaflet control -->
	{@render children?.()}
{/if}
