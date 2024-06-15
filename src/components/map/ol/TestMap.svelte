<!-- Map {
            controls: Collection<Control> | Control[] | undefined, 
            pixelRatio: number | undefined,
            interactions: Collection<Interaction> | Interaction[] | undefined
            keyboardEventTarget:HTMLElement | Document | string | undefined,
            layers:BaseLayer[] | Collection<BaseLayer> | LayerGroup | undefined,
            maxTilesLoading: number | undefined ,
            moveTolerance: number | undefined,
            overlays: Collection<Overlay> | Array<Overlay> | undefined,
            target: HTMLElement | string | undefined,
            view:  View | undefined
} -->

<script lang="ts">
	// Import necessary dependencies
	import { onMount } from 'svelte';

	import Map from 'ol/Map';
	import { VectorTile, Tile } from 'ol/layer.js';
	import View from 'ol/View';
	import { fromLonLat } from 'ol/proj';

	import { applyStyle } from 'ol-mapbox-style';

	import 'ol/ol.css';
	import XYZ from 'ol/source/XYZ';

	export let divId = 'map-container';
	export let centre = [152.2985, -31.9514];
	export let zoom = 6;

	let map: Map | null;

	const setupMap = (node: HTMLDivElement, _id: string) => {
		map = new Map({
			target: _id,
			layers: [],
			view: new View({
				center: fromLonLat(centre),
				zoom
			})
		});
		const tile = new Tile({
			source: new XYZ({
				url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}'
			})
		});
		map.addLayer(tile);
		const layer = new VectorTile({ declutter: true });
		applyStyle(
			layer,
			'https://portal.spatial.nsw.gov.au/vectortileservices/rest/services/Hosted/NSW_BaseMap_VectorTile_Terrain/VectorTileServer/resources/styles/root.json'
		);
		map.addLayer(layer);
		return {
			destroy() {
				if (map) {
					map.setTarget(undefined);
					map = null;
				}
			}
		};
	};

	// onMount(() => {
	// 	const map = new Map({
	// 		view: new View({
	// 			center: fromLonLat([152.2985, -31.9514]),
	// 			zoom: 6
	// 		}),
	// 		layers: [],
	// 		target: 'map-container'
	// 	});
	// 	const layer = new VectorTile({ declutter: true });
	// 	applyStyle(
	// 		layer,
	// 		'https://portal.spatial.nsw.gov.au/vectortileservices/rest/services/Hosted/NSW_BaseMap_VectorTile_Terrain/VectorTileServer/resources/styles/root.json'
	// 	);
	// 	map.addLayer(layer);
	// });
</script>

<div id={divId} use:setupMap={divId} />

<style>
	#map-container {
		width: 100%;
		height: 100%; /* Set your desired map height */
	}
</style>
