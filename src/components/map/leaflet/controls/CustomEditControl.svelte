<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { mapContext } from '$lib/map/map';

	import type { Map, ControlPosition, PM } from 'leaflet';

	const { getMap } = getContext(mapContext) as { getMap: () => Map };
	const map: Map = getMap();

	onMount(async () => {
		if (map.pm.Toolbar) {
			const addHazardPoint: (PM.ACTION_NAMES | PM.Action)[] = [
				// uses the default 'cancel' action
				'cancel',
				// creates a new action that has text, no click event
				// { text: 'Custom text, no click' },
				// creates a new action with text and a click event
				{
					text: 'click me',
					onClick: () => {
						map.pm.setPathOptions(
							{ color: 'orange' },
							{
								ignoreShapes: ['Circle', 'Rectangle']
							}
						);
					}
				}
			];
			map.pm.Toolbar.copyDrawControl('drawCircleMarker', {
				name: 'HazardPoint',
				block: 'custom',
				title: 'Add Hazard Point',
				actions: addHazardPoint
			});
		}
	});
</script>
