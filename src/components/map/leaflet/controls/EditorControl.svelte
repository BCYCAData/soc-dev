<script lang="ts">
	import { getContext, onDestroy, onMount } from 'svelte';
	import { mapContext } from '$lib/map/map';

	import type { ControlPosition, Map } from 'leaflet';

	export let position: ControlPosition = 'topleft';

	const { getMap } = getContext(mapContext) as { getMap: () => Map };
	const map: Map = getMap();

	onMount(async () => {
		if (!map.pm.Toolbar) {
			map.pm.addControls({
				position: position,
				cutPolygon: true
			});
		} else if (!map.pm.controlsVisible()) {
			map.pm.toggleControls();
		}
	});

	onDestroy(() => {
		map.pm.removeControls();
	});
</script>

{#if map && map.pm.Toolbar}
	<slot />
{/if}
