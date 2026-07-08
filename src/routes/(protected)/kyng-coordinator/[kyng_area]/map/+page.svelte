<script lang="ts">
	import { page } from '$app/state';
	import Spinner from '$components/page/Spinner.svelte';

	import MapView from '$lib/map/MapView.svelte';
	import {
		kyngMapProfile,
		kyngAreaLayer,
		kyngPropertyAreasLayer,
		kyngProwayLinesLayer,
		kyngWayPointsLayer,
		kyngAddressPointsLayer
	} from '$lib/map/profiles/kyng';
	import type { AddressSearchEntry, MapViewTarget, ResolvedLayer } from '$lib/map/profiles/types';
	import { buildKyngAddressSearchEntries } from '$lib/map/search/kyng-address-search';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const kyngGeoJsonData = $derived(data.kyngGeoJsonData);

	function getPropertyString(
		properties: GeoJSON.GeoJsonProperties | null | undefined,
		key: string
	): string {
		const value = properties?.[key];
		return value === null || value === undefined ? '' : String(value);
	}

	function enrichWayPointsWithAddressPointProps(
		wayPoints: GeoJSON.FeatureCollection | null,
		addressPoints: GeoJSON.FeatureCollection | null
	): GeoJSON.FeatureCollection | null {
		if (!wayPoints?.features?.length || !addressPoints?.features?.length) return wayPoints;

		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- transient local lookup, not reactive state
		const addressPointByOid = new Map<string, GeoJSON.GeoJsonProperties>();
		for (const feature of addressPoints.features) {
			const oid = getPropertyString(feature.properties, 'Address Point OID');
			if (!oid) continue;
			addressPointByOid.set(oid, feature.properties ?? {});
		}

		return {
			...wayPoints,
			features: wayPoints.features.map((feature) => {
				const waypointAddressPointOid = getPropertyString(feature.properties, 'Address Point OID');
				const addressPointProps = addressPointByOid.get(waypointAddressPointOid);
				if (!addressPointProps) return feature;
				return {
					...feature,
					properties: {
						...feature.properties,
						...addressPointProps
					}
				};
			})
		};
	}

	// View: explicit lat/lng/zoom search params win; otherwise fit the area bounds.
	const view = $derived.by<MapViewTarget>(() => {
		const lat = page.url.searchParams.get('lat');
		const lng = page.url.searchParams.get('lng');
		const zoom = page.url.searchParams.get('zoom');
		if (lat && lng && zoom) {
			return { center: [Number(lat), Number(lng)], zoom: Number(zoom) };
		}
		return { extent: kyngGeoJsonData.bounds as [[number, number], [number, number]] };
	});

	const layers = $derived<ResolvedLayer[]>([
		{ config: kyngAreaLayer, data: kyngGeoJsonData.kyngArea },
		{ config: kyngPropertyAreasLayer, data: kyngGeoJsonData.propertyAreas },
		{ config: kyngProwayLinesLayer, data: kyngGeoJsonData.prowayLines },
		{
			config: kyngWayPointsLayer,
			data: enrichWayPointsWithAddressPointProps(
				kyngGeoJsonData.wayPoints,
				kyngGeoJsonData.addressPoints
			)
		},
		{ config: kyngAddressPointsLayer, data: kyngGeoJsonData.addressPoints }
	]);

	const addressSearchEntries = $derived.by<AddressSearchEntry[]>(() =>
		buildKyngAddressSearchEntries({
			propertyAreas: kyngGeoJsonData.propertyAreas,
			addressPoints: kyngGeoJsonData.addressPoints
		})
	);

	let mapLoaded = $state(false);
</script>

<svelte:head>
	<title>Kyng Map</title>
</svelte:head>

{#if kyngGeoJsonData}
	<div class="map-container mx-auto flex w-5/6 flex-col">
		<MapView
			profile={kyngMapProfile}
			{view}
			{layers}
			addressSearch={{
				entries: addressSearchEntries,
				placeholder: 'Search property address',
				minQueryLength: 2,
				maxResults: 12,
				noResultsText: 'No matching property address'
			}}
			onReady={() => (mapLoaded = true)}
		>
			{#if !mapLoaded}
				<div class="spinner-overlay">
					<Spinner size="50" />
				</div>
			{/if}
		</MapView>
	</div>
{/if}

<style>
	.map-container {
		height: 95%;
		min-height: 400px;
		position: relative;
	}

	.spinner-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: color-mix(in srgb, var(--color-surface-50) 70%, transparent);
		z-index: 1000;
	}

	:global(.dark) .spinner-overlay {
		background-color: color-mix(in srgb, var(--color-surface-950) 70%, transparent);
	}
</style>
