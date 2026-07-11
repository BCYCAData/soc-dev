<script lang="ts">
	import Spinner from '$components/page/Spinner.svelte';

	import MapView from '$lib/map/MapView.svelte';
	import {
		propertyCaptureProfile,
		propertyBoundaryLayer,
		addressPointLayer,
		wayPointLayer
	} from '$lib/map/profiles/property-capture';
	import type { MapViewTarget, ResolvedLayer } from '$lib/map/profiles/types';
	import PropertyCaptureController, {
		type FeatureTemplate
	} from '$lib/map/capture/PropertyCaptureController.svelte';
	import CaptureLegend from '$lib/map/capture/CaptureLegend.svelte';

	interface PropertyGeometry {
		property?: GeoJSON.Feature | null;
		address_point?: GeoJSON.Feature | null;
		way_point?: GeoJSON.Feature | null;
		bounds?: [[number, number], [number, number]] | null;
		centre?: [number, number] | null;
	}

	interface Props {
		propertyId: string;
		propertyGeometry: PropertyGeometry;
		templates: FeatureTemplate[];
		featuresByTemplate: Record<string, GeoJSON.FeatureCollection>;
	}

	let { propertyId, propertyGeometry, templates, featuresByTemplate }: Props = $props();

	function toFC(feature?: GeoJSON.Feature | null): GeoJSON.FeatureCollection | null {
		if (!feature?.geometry) return null;
		return { type: 'FeatureCollection', features: [feature] };
	}

	const view = $derived<MapViewTarget>({
		extent: propertyGeometry.bounds ?? null,
		center: propertyGeometry.centre ?? undefined
	});

	const contextLayers = $derived<ResolvedLayer[]>([
		{ config: propertyBoundaryLayer, data: toFC(propertyGeometry.property) },
		{ config: addressPointLayer, data: toFC(propertyGeometry.address_point) },
		{ config: wayPointLayer, data: toFC(propertyGeometry.way_point) }
	]);

	let mapReady = $state(false);
</script>

<MapView
	profile={propertyCaptureProfile}
	{view}
	layers={contextLayers}
	editable
	onReady={() => (mapReady = true)}
>
	<PropertyCaptureController {propertyId} {templates} {featuresByTemplate} ready={mapReady} />
	<CaptureLegend {templates} {featuresByTemplate} {contextLayers} ready={mapReady} />
	{#if !mapReady}
		<div class="spinner-overlay">
			<Spinner size="100" />
		</div>
	{/if}
</MapView>

<style>
	.spinner-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.7);
		z-index: 1200;
	}
</style>
