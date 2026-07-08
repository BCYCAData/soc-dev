<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import EmptyState from '$components/page/EmptyState.svelte';
	import Spinner from '$components/page/Spinner.svelte';
	import StreetSelectInput from '$components/form/inputs/StreetSelectInput.svelte';
	import AutoCompleteSelect from '$components/form/inputs/AutoCompleteSelect.svelte';

	import MapView from '$lib/map/MapView.svelte';
	import {
		emergencyServiceMapProfile,
		emergencyPropertyLayer,
		emergencyAddressPointLayer,
		emergencyWayPointLayer,
		emergencyFeatureLayer
	} from '$lib/map/profiles/emergency';
	import type { MapViewTarget, ResolvedLayer } from '$lib/map/profiles/types';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let selectedStreet = $state('');
	let selectedValues = $state<string[]>([]);
	let targetValues = $state<string[]>([]);
	let mapLoaded = $state(false);

	const streetClassText =
		'class="border mt-0 w-full border-secondary-700 rounded bg-secondary-50 py-1 sm:text-lg"';

	// Keep the picker chips in sync with the URL-driven selection so a
	// shared/bookmarked `?ids=` link shows what is on the map.
	$effect(() => {
		if (!data.selection) return;
		const idSet = new Set(data.selection.ids);
		selectedValues = data.propertyAddressList
			.filter((p) => p.property_id.some((id) => idSet.has(id)))
			.map((p) => p.lut_text);
		targetValues = [...data.selection.ids];
	});

	const addStreetProperties = () => {
		if (!selectedStreet) return;
		const street = selectedStreet.trim().toLowerCase();
		for (const entry of data.propertyAddressList) {
			const entryStreet = entry.lut_text.split(',')[0]?.trim().toLowerCase() ?? '';
			if (entryStreet.endsWith(street) && !selectedValues.includes(entry.lut_text)) {
				selectedValues = [...selectedValues, entry.lut_text];
				targetValues = [...targetValues, ...entry.property_id];
			}
		}
	};

	const showOnMap = () => {
		mapLoaded = false;
		const base = resolve('/admin/emergency/service-map');
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- base is resolve()d; only a query string is appended
		goto(targetValues.length ? `${base}?ids=${encodeURIComponent(targetValues.join(','))}` : base);
	};

	const clearSelection = () => {
		selectedValues = [];
		targetValues = [];
		selectedStreet = '';
		mapLoaded = false;
		goto(resolve('/admin/emergency/service-map'));
	};

	const GEOMETRY_TYPES = ['Point', 'LineString', 'Polygon'] as const;
	type FeatureGeometry = (typeof GEOMETRY_TYPES)[number];

	const view = $derived<MapViewTarget>({ extent: data.selection?.mapExtent ?? null });

	const layers = $derived.by<ResolvedLayer[]>(() => {
		if (!data.selection) return [];
		return [
			{ config: emergencyPropertyLayer, data: data.selection.properties },
			...data.selection.featureLayers
				.filter((g) => (GEOMETRY_TYPES as readonly string[]).includes(g.geometryType))
				.map((g) => ({
					config: emergencyFeatureLayer(g.key, g.category, g.geometryType as FeatureGeometry),
					data: g.data
				})),
			{ config: emergencyWayPointLayer, data: data.selection.wayPoints },
			{ config: emergencyAddressPointLayer, data: data.selection.addressPoints }
		];
	});
</script>

<svelte:head>
	<title>Emergency Admin-Service Map</title>
</svelte:head>

<div class="mx-auto flex h-full w-full flex-col px-4">
	<div class="bg-secondary-300 text-secondary-900 mx-auto mt-2 w-full rounded-lg p-3">
		<h3 class="mb-2 font-semibold">
			Map registered properties with their emergency response information.
		</h3>
		<div class="flex flex-col gap-2 lg:flex-row lg:items-end">
			<div class="flex-1">
				<p class="mb-0">Add every registered property in a street</p>
				<div class="flex items-center gap-2">
					<StreetSelectInput
						streetList={data.streetList}
						nameText="service_map_street"
						requiredValue={false}
						classText={streetClassText}
						bind:selectedStreet
					/>
					<button
						type="button"
						class="btn preset-filled-secondary-500 shrink-0"
						onclick={addStreetProperties}
						disabled={!selectedStreet}
					>
						Add Street
					</button>
				</div>
			</div>
			<div class="flex-1">
				<p class="mb-0">Or pick individual properties</p>
				<AutoCompleteSelect
					listData={data.propertyAddressList}
					placeholder="Start typing an address..."
					bind:selectedValues
					bind:targetValues
				/>
			</div>
			<div class="flex shrink-0 gap-2">
				<button
					type="button"
					class="btn preset-filled-primary-500 font-semibold"
					onclick={showOnMap}
					disabled={targetValues.length === 0}
				>
					Show on Map
				</button>
				{#if data.selection}
					<button type="button" class="btn preset-tonal-surface" onclick={clearSelection}>
						Clear
					</button>
				{/if}
			</div>
		</div>
	</div>

	{#if data.selection}
		{#if data.selection.mapExtent}
			{#key data.selection.ids.join(',')}
				<div class="map-container mx-auto mt-2 flex w-full flex-col">
					<MapView
						profile={emergencyServiceMapProfile}
						{view}
						{layers}
						onReady={() => (mapLoaded = true)}
					>
						{#if !mapLoaded}
							<div class="spinner-overlay">
								<Spinner size="100" />
							</div>
						{/if}
					</MapView>
				</div>
			{/key}
		{:else}
			<div class="mx-auto mt-2 flex w-full flex-col justify-center">
				<EmptyState
					title="No mappable data"
					message="The selected properties have no recorded geometry yet, so there is nothing to place on the map."
					icon="database"
				/>
			</div>
		{/if}
	{:else}
		<div class="mx-auto mt-2 flex w-full flex-col justify-center">
			<EmptyState
				title="No properties selected"
				message="Choose a street or individual properties above, then select Show on Map to see their boundaries, access points and emergency details."
				icon="search"
			/>
		</div>
	{/if}
</div>

<style>
	.map-container {
		height: 90%;
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
