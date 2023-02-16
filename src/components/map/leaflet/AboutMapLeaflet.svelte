<script lang="ts">
	import type { FeatureGroup, LatLngExpression, Map } from 'leaflet';
	import type { MapDataJSON, MapObject, MapTileLayerObject } from '$lib/types';

	import { onMount, onDestroy } from 'svelte';

	export let mapObject: MapObject;
	export let mapLayers: MapDataJSON;
	export let mapTileLayer: MapTileLayerObject;

	let map: Map;
	let featureGroup: FeatureGroup;
	let registeredGroup;

	onMount(async () => {
		const leaflet = await import('leaflet');
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
		if (!mapObject.dragging) {
			map.dragging.disable();
		}
		leaflet.tileLayer(mapTileLayer.url, mapTileLayer.layerOptions).addTo(map);

		if ((mapLayers.jsonLayers.length = 2)) {
			let features = [];
			let g = mapLayers.jsonLayers[0];
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
			g = mapLayers.jsonLayers[1];
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
		} else if ((mapLayers.jsonLayers.length = 3)) {
			let features = [];
			let g = mapLayers.jsonLayers[0];
		}

		map.on('resize', function () {
			map.setMinZoom(0);
			map.setMaxZoom(20);
			map.fitBounds(featureGroup.getBounds());
			map.invalidateSize();
			map.setMinZoom(map.getZoom());
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
	{#if mapObject.mapTiler}
		<a href="https://www.maptiler.com" style="position:absolute;left:10px;bottom:10px;z-index:999;">
			<img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" />
		</a>
	{/if}
</div>
