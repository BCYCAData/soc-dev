<script lang="ts">
	import { getContext, onDestroy } from 'svelte';
	import type L from 'leaflet';
	import { LEAFLET_CONTEXT_KEY, type LeafletContext } from '$lib/map/createLeafletMap';
	import {
		convertLeafletBounds,
		getTilesForExtent,
		validateAndClampBounds,
		type Bounds
	} from '$lib/map/render/tile-math';
	import { escapeHtml } from '$lib/map/render/template-utils';
	import { gnafAddressTooltipTemplate } from '$lib/map/render/address-templates';
	import { DISTANCE_THRESHOLD, OFFSET_DISTANCE } from '$lib/constants';

	interface Props {
		/** Gate: true once MapView has created the map. */
		ready: boolean;
		visible?: boolean;
	}

	let { ready, visible = true }: Props = $props();

	const ctx = getContext<LeafletContext>(LEAFLET_CONTEXT_KEY);
	const layerId = 'gnaf-addresses';

	let initialized = false;
	let apiBounds: Bounds = { west: 0, south: 0, east: 0, north: 0 };
	let gnafZoom = 15;
	let group: L.LayerGroup | undefined;
	let mapRef: L.Map | undefined;
	let LRef: typeof L | undefined;

	async function fetchAddressPoints(bounds: Bounds) {
		if (!LRef || !group) return;
		const validBounds = validateAndClampBounds(bounds, apiBounds);
		const tiles = getTilesForExtent(validBounds, gnafZoom);

		const results = await Promise.all(
			tiles.map(({ x, y, z }) =>
				fetch(`/admin/site/data/addresses?z=${z}&x=${x}&y=${y}`).then((r) => r.json())
			)
		);
		const allFeatures: GeoJSON.Feature[] = results.flatMap((r) => r.features ?? []);

		// Dedupe on ADDRESS_DETAIL_PID.
		const uniqueFeatures = Object.values(
			allFeatures.reduce(
				(groups, feature) => {
					const pid = feature.properties?.ADDRESS_DETAIL_PID;
					if (pid != null && !groups[pid]) groups[pid] = feature;
					return groups;
				},
				{} as Record<string, GeoJSON.Feature>
			)
		);

		// Group colocated points so we can fan them out (otherwise they stack).
		const colocated: Record<string, GeoJSON.Feature[]> = {};
		uniqueFeatures.forEach((feature, i) => {
			const point1 = feature.geometry as GeoJSON.Point;
			const key = `group_${i}`;
			colocated[key] = [feature];
			uniqueFeatures.forEach((other) => {
				if (feature === other) return;
				const point2 = other.geometry as GeoJSON.Point;
				const dLon = Math.abs(point1.coordinates[0] - point2.coordinates[0]);
				const dLat = Math.abs(point1.coordinates[1] - point2.coordinates[1]);
				if (dLon <= DISTANCE_THRESHOLD && dLat <= DISTANCE_THRESHOLD) colocated[key].push(other);
			});
		});

		const duplicatedGroups = Object.values(colocated).filter((g) => g.length > 1);
		const dupPids = new Set(
			duplicatedGroups.flat().map((f) => f.properties?.ADDRESS_DETAIL_PID)
		);
		const nonColocated = uniqueFeatures.filter(
			(f) => !dupPids.has(f.properties?.ADDRESS_DETAIL_PID)
		);

		// Fan colocated features out around their shared point.
		duplicatedGroups.forEach((g) => {
			g.forEach((feature, index) => {
				const angle = (2 * Math.PI * index) / g.length;
				const orig = feature.geometry as GeoJSON.Point;
				feature.geometry = {
					type: 'Point',
					coordinates: [
						orig.coordinates[0] + OFFSET_DISTANCE * Math.cos(angle),
						orig.coordinates[1] + OFFSET_DISTANCE * Math.sin(angle)
					]
				};
			});
		});

		group.clearLayers();
		for (const feature of [...duplicatedGroups.flat(), ...nonColocated]) {
			const pt = feature.geometry as GeoJSON.Point;
			const [lng, lat] = pt.coordinates;
			const marker = LRef.marker([lat, lng], {
				icon: LRef.divIcon({
					html: escapeHtml(feature.properties?.street_number ?? ''),
					className: 'text-label',
					iconSize: [20, 20],
					iconAnchor: [10, 10]
				})
			});
			marker.bindTooltip(gnafAddressTooltipTemplate(feature), { direction: 'top' });
			group.addLayer(marker);
		}
	}

	function handleMoveEnd() {
		if (mapRef) fetchAddressPoints(convertLeafletBounds(mapRef.getBounds()));
	}

	$effect(() => {
		if (!ready || initialized) return;
		const L = ctx.getLeaflet();
		const map = ctx.getLeafletMap();
		if (!L || !map) return;
		initialized = true;
		LRef = L;
		mapRef = map;
		group = L.layerGroup();
		ctx.registerLayer({
			id: layerId,
			name: 'GNAF Addresses',
			type: 'geojson',
			visible,
			leafletLayer: group
		});

		(async () => {
			const meta = await fetch('/api/geoscape/gnaf/metadata').then((r) => r.json());
			if (meta?.bounds) {
				gnafZoom = meta.center?.[2] ?? 15;
				const [west, south, east, north] = meta.bounds;
				apiBounds = { west, south, east, north };
				map.on('moveend', handleMoveEnd);
				handleMoveEnd();
			}
		})();
	});

	onDestroy(() => {
		if (mapRef) mapRef.off('moveend', handleMoveEnd);
		ctx.unregisterLayer(layerId);
	});
</script>
