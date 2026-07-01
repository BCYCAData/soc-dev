<script lang="ts">
	import { page } from '$app/state';

	import PropertyCaptureMap from '$lib/map/capture/PropertyCaptureMap.svelte';
	import { transformFeaturesToGeoJSON } from '$lib/map/render/transform-features';
	import type { FeatureTemplate } from '$lib/map/capture/PropertyCaptureController.svelte';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const propertyId = $derived(page.params.propertyid ?? '');
	const propertyGeometry = $derived((data.propertyGeometryData?.[0] ?? {}) as any);
	const templates = $derived(Object.values(data.featureTemplates ?? {}) as FeatureTemplate[]);
	const featuresByTemplate = $derived(
		transformFeaturesToGeoJSON(
			data.spatialFeatures as any,
			data.featureAttributes as any
		)
	);
</script>

<svelte:head>
	<title>My Property Map</title>
</svelte:head>

<div class="capture-route">
	{#if propertyGeometry.bounds || propertyGeometry.centre}
		<PropertyCaptureMap {propertyId} {propertyGeometry} {templates} {featuresByTemplate} />
	{:else}
		<p class="text-surface-500 mt-4 text-center">No property geometry available.</p>
	{/if}
</div>

<style>
	.capture-route {
		height: 93%;
		position: relative;
	}
</style>
