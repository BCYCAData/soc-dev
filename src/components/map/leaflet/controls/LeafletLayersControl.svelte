<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import { controlLayersStore } from '$stores/leaflet';

	import type L from 'leaflet';
	import { type ControlPosition } from 'leaflet';

	export let position: ControlPosition = 'topright';

	const leaflet = (getContext('leaflet') as { getLeaflet: () => typeof L }).getLeaflet();
	const leafletMap = (getContext('leafletMap') as { getLeafletMap: () => L.Map }).getLeafletMap();

	let layersControl: L.Control.Layers;
	let legendContent = '';
	let legend;

	onMount(() => {
		layersControl = leaflet.control.layers({}, {}, { position: position }).addTo(leafletMap);
		controlLayersStore.subscribe(({ baseMaps, overlayMaps }) => {
			for (const base of baseMaps) {
				layersControl.addBaseLayer(base.layer, base.name);
			}
			for (const overlay of overlayMaps) {
				layersControl.addOverlay(overlay.layer, overlay.name);
			}
		});
		// leafletMap.on('overlayadd overlayremove', (event) => {
		// 	updateLegend();
		// });
		// updateLegend();
		// const LegendControl = leaflet.Control.extend({
		// 	options: {
		// 		position: 'bottomright'
		// 	},

		// 	onAdd: function (leafletMap: L.Map) {
		// 		const div = leaflet.DomUtil.create('div', 'info legend');
		// 		div.innerHTML = `
		// 		<strong style="margin-bottom: 3px;">Legend</strong>
		// 		<p class="legend_heading">Address Point<span style="font-size: 10px"> & Number</span></p>
		// 		<div class="legend-item">
		// 			<span class="legend-color" style="background: blue"></span>
		// 			<span>Property</span>
		// 		</div>
		// 		<div class="legend-item">
		// 			<span class="legend-color" style="background: green"></span>
		// 			<span>Building</span>
		// 		</div>
		// `;
		// 		return div;
		// 	}
		// });

		// const legend = new LegendControl();
		// legend.addTo(leafletMap);
	});

	// function updateLegend() {
	// 	legendContent = '';
	// 	leafletMap.eachLayer((layer) => {
	// 		if (layer.options && layer.options.color) {
	// 			legendContent += `<div>${layer.options.color}: ${leafletMap.hasLayer(layer) ? 'Visible' : 'Hidden'}</div>`;
	// 		}
	// 	});
	// }

	onDestroy(() => {
		layersControl.remove();
	});
</script>
