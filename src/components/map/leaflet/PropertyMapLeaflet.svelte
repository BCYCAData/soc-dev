<script lang="ts">
	import type { Map as LeafletMap, FeatureGroup } from 'leaflet';
	import { tiledMapLayer } from 'esri-leaflet';
	import { onMount, onDestroy } from 'svelte';

	import type { MapDataJSON, MapObject, MapTileLayerObject } from '$lib/types';

	import 'leaflet/dist/leaflet.css';

	export let mapObject: MapObject;
	export let mapLayers: MapDataJSON;

	let map: LeafletMap;
	let waypointGroup: FeatureGroup;
	let addresspointGroup: FeatureGroup;

	onMount(async () => {
		const leaflet = await import('leaflet');
		// const esrileaflet = await import('esri-leaflet');
		map = leaflet.map(mapObject.divId, {
			center: new leaflet.LatLng(mapObject.centre[0], mapObject.centre[1], 0),
			zoomSnap: mapObject.zoomSnap,
			zoom: mapObject.zoom,
			// minZoom: mapObject.minZoom,
			// maxZoom: mapObject.maxZoom,
			maxBounds: mapObject.maxBounds,
			zoomControl: mapObject.zoomControl,
			doubleClickZoom: mapObject.doubleClickZoom,
			scrollWheelZoom: mapObject.scrollWheelZoom
		});
		// if (!mapObject.dragging) {
		// 	map.dragging.disable();
		// }
		// leaflet.tileLayer.wms(mapTileLayer.url, mapTileLayer.layerOptions).addTo(map);

		let x = tiledMapLayer({
			url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer',
			useCors: false
		});
		x.addTo(map);

		// tiledMapLayer({
		// 	url: 'https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/stops/FeatureServer/0/',
		// 	useCors: false
		// }).addTo(map);

		// let wmsTileLayer = leaflet.tileLayer
		// 	.wms('https://maps.six.nsw.gov.au/arcgis/services/public/NSW_Base_Map/MapServer/WmsServer', {
		// 		layers: 'LPIMap_PlacePoint'
		// 	})
		// 	.addTo(map);

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
		const property = leaflet
			.geoJSON(propertyFeature, {
				style: myStyle
			})
			.addTo(map);
		let features = [];
		let g = mapLayers.jsonLayers[1];
		let p = g.geometry.coordinates;
		let marker = new leaflet.CircleMarker(new leaflet.LatLng(p[1], p[0], 0), {
			color: '#f97316',
			weight: 0,
			radius: 3,
			fillOpacity: 0.75
		});
		features.push(marker);
		addresspointGroup = leaflet.featureGroup(features);
		map.addLayer(addresspointGroup);
		features = [];
		g = mapLayers.jsonLayers[2];
		p = g.geometry.coordinates;
		marker = new leaflet.CircleMarker(new leaflet.LatLng(p[1], p[0], 0), {
			color: '#a5a5a5',
			weight: 0,
			radius: 3,
			fillOpacity: 0.75
		});
		features.push(marker);
		waypointGroup = leaflet.featureGroup(features);
		map.addLayer(waypointGroup);
		map.on('resize', function () {
			map.setMinZoom(0);
			map.setMaxZoom(20);
			map.fitBounds(property.getBounds());
			map.invalidateSize();
		});
	});

	onDestroy(async () => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="w-full h-full z-0" id={mapObject.divId}>
	<!-- {#if mapObject.mapTiler}
		<a href="https://www.maptiler.com" style="position:absolute;left:10px;bottom:10px;z-index:999;">
			<img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" />
		</a>
	{/if} -->
</div>
