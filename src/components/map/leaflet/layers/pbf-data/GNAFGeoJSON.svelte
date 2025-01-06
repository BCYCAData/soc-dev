<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import {
		convertLeafletBounds,
		getTilesForExtent,
		validateAndClampBounds,
		type Bounds
	} from '$lib/leaflet/geometryUtilities';

	import { DISTANCE_THRESHOLD, OFFSET_DISTANCE } from '$lib/constants';

	interface Props {
		leafletMapInstance: L.Map;
		onGnafData: (data: GeoJSON.FeatureCollection) => void;
	}

	let { leafletMapInstance, onGnafData }: Props = $props();

	let apiBounds = $state<Bounds>({
		west: 0,
		south: 0,
		east: 0,
		north: 0
	});

	let GNAF_ZOOM = 15;

	async function fetchAddressPoints(bounds: Bounds) {
		const validBounds = validateAndClampBounds(bounds, apiBounds);
		const tileCoords = getTilesForExtent(validBounds, GNAF_ZOOM);

		const promises = tileCoords.map(({ x, y, z }) =>
			fetch(`/admin/site/data/addresses?z=${z}&x=${x}&y=${y}`).then((res) => res.json())
		);

		const results = await Promise.all(promises);
		const allFeatures = results.flatMap((result) => result.features);

		// Group by ADDRESS_DETAIL_PID
		const uniqueFeatures = Object.values(
			allFeatures.reduce(
				(groups, feature: GeoJSON.Feature) => {
					const pid = feature.properties?.ADDRESS_DETAIL_PID;
					if (!groups[pid]) {
						groups[pid] = feature;
					}
					return groups;
				},
				{} as Record<string, GeoJSON.Feature>
			)
		) as GeoJSON.Feature[];

		// Group colocated features
		const colocatedFeatures: Record<string, GeoJSON.Feature[]> = {};

		uniqueFeatures.forEach((feature, i) => {
			const point1 = feature.geometry as GeoJSON.Point;
			const groupKey = `group_${i}`;

			if (!colocatedFeatures[groupKey]) {
				colocatedFeatures[groupKey] = [feature];
			}

			uniqueFeatures.forEach((otherFeature) => {
				if (feature !== otherFeature) {
					const point2 = otherFeature.geometry as GeoJSON.Point;
					const deltaLon = Math.abs(point1.coordinates[0] - point2.coordinates[0]);
					const deltaLat = Math.abs(point1.coordinates[1] - point2.coordinates[1]);

					if (deltaLon <= DISTANCE_THRESHOLD && deltaLat <= DISTANCE_THRESHOLD) {
						colocatedFeatures[groupKey].push(otherFeature);
					}
				}
			});
		});

		// Get duplicated groups (more than one feature)
		const duplicatedGroups = Object.values(colocatedFeatures).filter((group) => group.length > 1);

		// Get non-colocated features
		const nonColocatedFeatures = uniqueFeatures.filter(
			(feature) =>
				!duplicatedGroups
					.flat()
					.some((g) => g.properties?.ADDRESS_DETAIL_PID === feature.properties?.ADDRESS_DETAIL_PID)
		);

		// Calculate offset positions for colocated features
		duplicatedGroups.forEach((group) => {
			group.forEach((feature, index) => {
				const angle = (2 * Math.PI * index) / group.length;
				const originalPoint = feature.geometry as GeoJSON.Point;

				// Create circular offset pattern
				const offsetX = OFFSET_DISTANCE * Math.cos(angle);
				const offsetY = OFFSET_DISTANCE * Math.sin(angle);

				feature.geometry = {
					type: 'Point',
					coordinates: [
						originalPoint.coordinates[0] + offsetX,
						originalPoint.coordinates[1] + offsetY
					]
				};
			});
		});

		onGnafData({
			type: 'FeatureCollection',
			features: [...duplicatedGroups.flat(), ...nonColocatedFeatures]
		});
	}

	function handleMapMoveEnd() {
		if (leafletMapInstance) {
			const bounds = convertLeafletBounds(leafletMapInstance.getBounds());
			fetchAddressPoints(bounds);
		}
	}

	onMount(async () => {
		const response = await fetch('/api/geoscape/gnaf/metadata');
		const gnafLayer = await response.json();
		GNAF_ZOOM = gnafLayer.center[2];

		if (gnafLayer) {
			const [west, south, east, north] = gnafLayer.bounds;
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
