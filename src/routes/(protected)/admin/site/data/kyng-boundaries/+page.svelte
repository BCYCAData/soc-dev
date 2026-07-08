<script lang="ts">
	import type { PageData } from './$types';
	import MapView from '$lib/map/MapView.svelte';
	import { siteStreetsProfile, siteBoundaryLayer } from '$lib/map/profiles/site';
	import type { ResolvedLayer } from '$lib/map/profiles/types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let boundary = $derived(data?.boundaryGeometry ?? null);

	// Wrap the boundary geometry (EPSG:4326) as a FeatureCollection for the engine.
	let layers = $derived<ResolvedLayer[]>(
		boundary
			? [
					{
						config: siteBoundaryLayer,
						data: {
							type: 'FeatureCollection',
							features: [{ type: 'Feature', geometry: boundary, properties: {} }]
						}
					}
				]
			: []
	);

	/** Leaflet bounds [[S,W],[N,E]] from a GeoJSON geometry's coordinates. */
	function geometryExtent(
		geom: GeoJSON.Geometry | null
	): [[number, number], [number, number]] | null {
		if (!geom || !('coordinates' in geom)) return null;
		let minLat = Infinity,
			minLng = Infinity,
			maxLat = -Infinity,
			maxLng = -Infinity;
		const walk = (c: unknown): void => {
			if (typeof (c as number[])[0] === 'number' && (c as number[]).length >= 2) {
				const [lng, lat] = c as number[];
				if (lng < minLng) minLng = lng;
				if (lng > maxLng) maxLng = lng;
				if (lat < minLat) minLat = lat;
				if (lat > maxLat) maxLat = lat;
			} else if (Array.isArray(c)) {
				for (const child of c) walk(child);
			}
		};
		walk((geom as { coordinates: unknown }).coordinates);
		if (minLat === Infinity) return null;
		return [
			[minLat, minLng],
			[maxLat, maxLng]
		];
	}

	let extent = $derived(geometryExtent(boundary));
</script>

<article class="grid h-full grid-rows-[auto_auto_auto_1fr] gap-4 overflow-hidden">
	<section
		class="mx-auto flex h-[calc(100vh-400px)] w-full max-w-3xl flex-col overflow-hidden px-4"
	>
		{#if boundary}
			<MapView profile={siteStreetsProfile} view={{ extent }} {layers} class="h-full" />
		{:else}
			<p class="text-surface-500 mt-4 text-center">Unable to load map data</p>
		{/if}
	</section>
</article>
