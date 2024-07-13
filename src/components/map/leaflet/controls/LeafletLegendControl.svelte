<script lang="ts">
	import { onMount, getContext, onDestroy } from 'svelte';
	import { geoJSONLayersStore } from '$stores/leaflet';

	import type L from 'leaflet';
	import { Circle, type Control, type ControlPosition } from 'leaflet';
	import { LeafletStyleMaker } from '$lib/map/leafletStyle';

	export let position: ControlPosition = 'bottomright';

	const { getLeaflet } = getContext('leaflet') as { getLeaflet: () => typeof L };
	const { getLeafletMap } = getContext('leafletMap') as { getLeafletMap: () => L.Map };

	let layerSymbols = [];
	let leaflet: typeof L;
	let leafletMap: L.Map;
	let legendControl: Control;

	// Subscribe to changes in the geoJSONLayersStore
	const unsubscribe = geoJSONLayersStore.subscribe((layers) => {
		// Reset the layerSymbols array
		layerSymbols = [];

		// Iterate over the layers and extract the symbols
		for (const layerKey in layers) {
			const layer = layers[layerKey];
			const layerSymbol = layer;
			console.log('layerSymbol', layerSymbol); // Assuming the symbol is stored in the 'icon' property of the layer options
			layerSymbols.push(layerSymbol);
		}
	});

	// import { ShapeGenerator, generateRectangleStyle } from '$lib/map/cssShapes';

	// // const shapes = {
	// // 	square: { width: 100, height: 100, borderColor: '#000', fillColor: '#f00' },
	// // 	circle: { width: 80, height: 80, borderColor: '#00f', fillColor: '#0f0', borderWidth: 2 },
	// // 	triangle: { width: 120, height: 100, borderColor: '#ff0', fillColor: '#f0f' },
	// // 	diamond: { width: 90, height: 90, borderColor: '#0ff', fillColor: '#00f' },
	// // 	rectangle: { width: 120, height: 60, borderColor: '#999', fillColor: '#ccc' }
	// // };

	// // const css = ShapeGenerator.generateCSS(shapes);
	// const square = generateRectangleStyle(  100,  100,  '#000',  '#f00')
	// console.log(square);
	const borderStyle = LeafletStyleMaker.createBorderStyle();
	const areaStyle = LeafletStyleMaker.createAreaStyle();
	const styleMaker = new LeafletStyleMaker(undefined, borderStyle, areaStyle);
	console.log(styleMaker.getStyle());

	onMount(async () => {
		leaflet = getLeaflet();
		leafletMap = getLeafletMap();

		const LegendControl = leaflet.Control.extend({
			options: {
				position: position
			},

			onAdd: function () {
				const div = leaflet.DomUtil.create('div', 'info legend');
				div.innerHTML = `
                    <strong style="margin-bottom: 3px;">Legend</strong>
                    <p class="legend_heading">Address Point&nbsp;<span style="font-size: 10px">& Number</span></p>
                    <div class="legend-item">
                    <span class="legend-box" style="background: blue"></span>
                    <span>Property (Numbered)</span>
                    </div>
                    <div class="legend-item">
                    <span class="legend-box" style="background: green"></span>
                    <span>Building (Numbered)</span>
                    </div>
                    <div class="legend-item">
                    <span class="legend-box" style="transform: rotate(45deg)  scale(0.8); background: blue"></span>
                    <span>Property</span>
                    </div>
                    <div class="legend-item">
                    <span class="legend-box" style="transform: rotate(45deg)  scale(0.8); background: green"></span>
                    <span>Building</span>
                    </div>
                `;
				return div;
			}
		});

		legendControl = new LegendControl();
		legendControl.addTo(leafletMap);
	});

	onDestroy(() => {
		if (leafletMap && legendControl) {
			leafletMap.removeControl(legendControl);
		}
		unsubscribe;
	});
</script>
