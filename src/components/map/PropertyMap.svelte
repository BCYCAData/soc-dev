<script lang="ts">
	import {
		Map as LeafletMap,
		control,
		Control,
		tileLayer,
		FeatureGroup,
		geoJSON,
		CircleMarker,
		LatLng,
		featureGroup
	} from 'leaflet';
	import { TiledMapLayer } from 'esri-leaflet';
	import { vectorTileLayer } from 'esri-leaflet-vector';

	import 'leaflet/dist/leaflet.css';
	import type { MapDataJSON } from '$lib/types';

	export let mapCentre: [number, number];
	export let mapLayers: MapDataJSON;

	let waypointGroup: FeatureGroup;
	let addresspointGroup: FeatureGroup;
	let propertyGroup: FeatureGroup;

	let propertyMap: LeafletMap;

	const map = (domNode: HTMLDivElement) => {
		propertyMap = new LeafletMap(domNode);
		propertyMap.setView(mapCentre, 20);

		const hybridStreets = vectorTileLayer(
			'https://portal.spatial.nsw.gov.au/vectortileservices/rest/services/Hosted/NSW_BaseMap_VectorTile_Hybrid/VectorTileServer',
			{}
		);

		const streets = vectorTileLayer(
			'https://portal.spatial.nsw.gov.au/vectortileservices/rest/services/Hosted/NSW_BaseMap_VectorTile_Streets/VectorTileServer',
			{}
		);

		const vectorTerrain = vectorTileLayer(
			'https://portal.spatial.nsw.gov.au/vectortileservices/rest/services/Hosted/NSW_BaseMap_VectorTile_Terrain/VectorTileServer',
			{}
		).addTo(propertyMap);

		const aerial = new TiledMapLayer({
			url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer'
		}).addTo(propertyMap);

		const baseMap = new TiledMapLayer({
			url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer'
		});

		const darkBase = vectorTileLayer(
			'https://portal.spatial.nsw.gov.au/vectortileservices/rest/services/Hosted/NSW_BaseMap_VectorTile_DarkGrey/VectorTileServer',
			{}
		);

		const baseMaps = {
			Aerial: aerial,
			'Street Map': baseMap,
			'Dark Street': darkBase
		};
		const overlay = {
			hybridStreets: hybridStreets,
			streets: streets,
			vectorTerrain: vectorTerrain
		};

		// let base1 = PanelLayers(conf.base.layers, null, {
		// 	title: conf.base.title,
		// 	position: 'topright',
		// 	compact: false
		// }).addTo(propertyMap);

		// let over1 = PanelLayers(null, conf.tree.layers, {
		// 	title: conf.tree.title,
		// 	position: 'topright',
		// 	compact: false
		// }).addTo(propertyMap);
		let propertyFeature: GeoJSON.Feature = {
			type: 'Feature',
			properties: {},
			geometry: mapLayers.jsonLayers[0].geometry
		};
		let myStyle = {
			color: '#ff7800',
			weight: 1,
			opacity: 1,
			fillOpacity: 0.05
		};
		let features = [];
		const property = geoJSON(propertyFeature, {
			style: myStyle
		});
		features.push(property);
		propertyGroup = featureGroup(features);
		propertyMap.addLayer(propertyGroup);
		features = [];
		let g = mapLayers.jsonLayers[1];
		let p = g.geometry.coordinates;
		let marker = new CircleMarker(new LatLng(p[1], p[0], 0));
		marker.setStyle({ color: '#f97316', weight: 0, radius: 3, fillOpacity: 0.75 });
		features.push(marker);
		addresspointGroup = featureGroup(features);
		propertyMap.addLayer(addresspointGroup);
		features = [];
		g = mapLayers.jsonLayers[2];
		p = g.geometry.coordinates;
		marker = new CircleMarker(new LatLng(p[1], p[0], 0));
		marker.setStyle({ color: '#a5a5a5', weight: 0, radius: 3, fillOpacity: 0.75 });
		features.push(marker);
		waypointGroup = featureGroup(features);
		propertyMap.addLayer(waypointGroup);
		// propertyMap.on('resize', function () {
		propertyMap.setMinZoom(0);
		propertyMap.setMaxZoom(20);
		propertyMap.fitBounds(propertyGroup.getBounds());
		propertyMap.invalidateSize();
		// });

		const layerControl = control
			.layers(baseMaps, overlay, {
				collapsed: true
			})
			.addTo(propertyMap);
	};
</script>

<div class="h-full w-full" use:map />

<!-- <style>
	div {
		height: 100%;
		width: 100%;
	}
</style> -->
