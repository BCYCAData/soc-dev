<script lang="ts">
	import type { FeatureGroup, LatLngExpression, Map } from 'leaflet';
	import { onMount, onDestroy } from 'svelte';

	import type { AddressPointType, MapObject, MapTileLayerObject } from '$lib/types';

	import 'leaflet/dist/leaflet.css';

	export let mapObject: MapObject;
	export let mapTileLayer: MapTileLayerObject;
	export let allPoints: AddressPointType[];
	export let registeredPoints: AddressPointType[];

	let map: Map;
	let featureGroup: FeatureGroup;
	let registeredGroup;

	onMount(async () => {
		const leaflet = await import('leaflet');
		map = leaflet.map(mapObject.divId, {
			center: new leaflet.LatLng(mapObject.centre[0], mapObject.centre[1], 0),
			zoomSnap: mapObject.zoomSnap,
			zoom: mapObject.zoom,
			maxBounds: mapObject.maxBounds,
			zoomControl: mapObject.zoomControl,
			doubleClickZoom: mapObject.doubleClickZoom,
			scrollWheelZoom: mapObject.scrollWheelZoom
		});
		if (!mapObject.dragging) {
			map.dragging.disable();
		}
		leaflet.tileLayer(mapTileLayer.url, mapTileLayer.layerOptions).addTo(map);

		if (allPoints.length > 0) {
			let features = [];
			let g = allPoints;
			for (let j = 0; j < g.length; j++) {
				let p = g[j].geom.coordinates;
				let lon = p[0];
				let lat = p[1];
				let marker = new leaflet.CircleMarker(new leaflet.LatLng(lat, lon, 0));
				marker.setStyle({ color: '#a5a5a5', weight: 0, radius: 2, fillOpacity: 0.5 });
				features.push(marker);
			}
			featureGroup = leaflet.featureGroup(features);
			map.addLayer(featureGroup);
			features = [];
			g = registeredPoints;
			for (let j = 0; j < g.length; j++) {
				let p = g[j].geom.coordinates;
				let lon = p[0];
				let lat = p[1];
				let markerLocation: LatLngExpression = new leaflet.LatLng(lat, lon, 0);
				let marker = new leaflet.CircleMarker(markerLocation);
				marker.setStyle({ color: '#f97316', weight: 0, radius: 3, fillOpacity: 0.9 });
				features.push(marker);
			}
			registeredGroup = leaflet.featureGroup(features);
			map.addLayer(registeredGroup);
		}
		if (featureGroup.getBounds().isValid()) {
			map.fitBounds(featureGroup.getBounds());
		}
	});

	onDestroy(async () => {
		if (map) {
			map.remove();
		}
	});
</script>

<div class="w-full h-full z-0" id={mapObject.divId}>
	{#if mapObject.mapTiler}
		<a href="https://www.maptiler.com" style="position:absolute;left:10px;bottom:10px;z-index:999;">
			<img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" />
		</a>
	{/if}
</div>
