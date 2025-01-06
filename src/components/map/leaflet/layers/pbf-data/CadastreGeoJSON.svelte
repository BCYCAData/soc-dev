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
		onCadastreData: (data: GeoJSON.FeatureCollection) => void;
	}

	let { leafletMapInstance, onCadastreData }: Props = $props();

	let apiBounds = $state<Bounds>({
		west: 0,
		south: 0,
		east: 0,
		north: 0
	});

	let CADASTRE_ZOOM = 15;

	async function fetchCadastrePolygons(bounds: Bounds) {
		const validBounds = validateAndClampBounds(bounds, apiBounds);
		const tileCoords = getTilesForExtent(validBounds, CADASTRE_ZOOM);

		const features = await Promise.all(
			tileCoords.map(async ({ x, y, z }) => {
				const tileBuffer = await fetchVectorTile('cadastre', z, x, y);
				const geoJson = vectorTileToGeoJSON(tileBuffer, z, x, y, 'Polygon');
				return geoJson.features;
			})
		);

		const allFeatures = features.flat();

		// Group by cadastre_pid to remove duplicates
		const uniqueFeatures = Object.values(
			allFeatures.reduce(
				(groups, feature: GeoJSON.Feature) => {
					const pid = feature.properties?.cadastre_pid;
					if (!groups[pid]) {
						groups[pid] = feature;
					}
					return groups;
				},
				{} as Record<string, GeoJSON.Feature>
			)
		);

		onCadastreData({
			type: 'FeatureCollection',
			features: uniqueFeatures
		});
	}

	function handleMapMoveEnd() {
		if (leafletMapInstance) {
			const bounds = convertLeafletBounds(leafletMapInstance.getBounds());
			fetchCadastrePolygons(bounds);
		}
	}

	onMount(async () => {
		const response = await fetch('/api/geoscape/cadastre/metadata');
		const cadastreLayer = await response.json();
		CADASTRE_ZOOM = cadastreLayer.center[2];

		if (cadastreLayer) {
			const [west, south, east, north] = cadastreLayer.bounds;
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
