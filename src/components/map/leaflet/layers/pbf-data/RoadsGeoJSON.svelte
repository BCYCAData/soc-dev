<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		convertLeafletBounds,
		getTilesForExtent,
		validateAndClampBounds,
		type Bounds
	} from '$lib/leaflet/geometryUtilities';
	import { fetchVectorTile, vectorTileToGeoJSON } from '$lib/server/services/geoscape.service';

	interface Props {
		leafletMapInstance: L.Map;
		onRoadsData: (data: GeoJSON.FeatureCollection) => void;
	}

	let { leafletMapInstance, onRoadsData }: Props = $props();

	let apiBounds = $state<Bounds>({
		west: 0,
		south: 0,
		east: 0,
		north: 0
	});

	let ROADS_ZOOM = 15;

	async function fetchRoads(bounds: Bounds) {
		const validBounds = validateAndClampBounds(bounds, apiBounds);
		const tileCoords = getTilesForExtent(validBounds, ROADS_ZOOM);

		const features = await Promise.all(
			tileCoords.map(async ({ x, y, z }) => {
				const tileBuffer = await fetchVectorTile('roads', z, x, y);
				const geoJson = vectorTileToGeoJSON(tileBuffer, z, x, y, 'LineString');
				return geoJson.features;
			})
		);

		const allFeatures = features.flat();

		// Group by road_pid to remove duplicates
		const uniqueFeatures = Object.values(
			allFeatures.reduce(
				(groups, feature: GeoJSON.Feature) => {
					const pid = feature.properties?.road_pid;
					if (!groups[pid]) {
						groups[pid] = feature;
					}
					return groups;
				},
				{} as Record<string, GeoJSON.Feature>
			)
		);

		onRoadsData({
			type: 'FeatureCollection',
			features: uniqueFeatures
		});
	}

	function handleMapMoveEnd() {
		if (leafletMapInstance) {
			const bounds = convertLeafletBounds(leafletMapInstance.getBounds());
			fetchRoads(bounds);
		}
	}

	onMount(async () => {
		const response = await fetch('/api/geoscape/roads/metadata');
		const roadsLayer = await response.json();
		ROADS_ZOOM = roadsLayer.center[2];

		if (roadsLayer) {
			const [west, south, east, north] = roadsLayer.bounds;
			apiBounds = { west, south, east, north };
			leafletMapInstance.on('moveend', handleMapMoveEnd);
			handleMapMoveEnd();
		}
	});

	onDestroy(() => {
		if (leafletMapInstance) {
			leafletMapInstance.off('moveend', handleMapMoveEnd);
		}
	});
</script>
