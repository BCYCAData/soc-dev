<script lang="ts">
	import type { PageData } from './$types';
	import MapView from '$lib/map/MapView.svelte';
	import {
		kyngBoundaryEditorProfile,
		kyngBoundariesLayer
	} from '$lib/map/profiles/kyng-boundary-editor';
	import type { ResolvedLayer } from '$lib/map/profiles/types';
	import KyngBoundaryEditorController, {
		type KyngEditSession
	} from '$lib/map/kyng-editor/KyngBoundaryEditorController.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let boundaries = $derived(data?.boundaries ?? null);
	let activeSession = $derived((data?.activeSession ?? null) as KyngEditSession | null);

	let layers = $derived<ResolvedLayer[]>(
		boundaries ? [{ config: kyngBoundariesLayer, data: boundaries }] : []
	);

	/** Leaflet bounds [[S,W],[N,E]] over every boundary feature. */
	function collectionExtent(
		fc: GeoJSON.FeatureCollection | null
	): [[number, number], [number, number]] | null {
		if (!fc?.features?.length) return null;
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
		for (const f of fc.features) {
			if (f.geometry && 'coordinates' in f.geometry) {
				walk((f.geometry as { coordinates: unknown }).coordinates);
			}
		}
		if (minLat === Infinity) return null;
		return [
			[minLat, minLng],
			[maxLat, maxLng]
		];
	}

	let extent = $derived(collectionExtent(boundaries));
	let mapReady = $state(false);
</script>

<article class="grid h-full grid-rows-[1fr] gap-2 overflow-hidden">
	<section class="mx-auto flex h-[calc(100vh-220px)] w-full flex-col overflow-hidden px-4">
		{#if boundaries}
			<MapView
				profile={kyngBoundaryEditorProfile}
				view={{ extent }}
				{layers}
				editable
				onReady={() => (mapReady = true)}
				class="h-full"
			>
				<KyngBoundaryEditorController ready={mapReady} {boundaries} {activeSession} />
			</MapView>
		{:else}
			<p class="text-surface-500 mt-4 text-center">Unable to load map data</p>
		{/if}
	</section>
</article>
