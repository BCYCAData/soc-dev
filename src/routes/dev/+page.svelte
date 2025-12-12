<script lang="ts">
	import NewMap from '$components/leaflet/NewMap.svelte';
	import BaseLayerGroup from '$components/leaflet/layers/BaseLayerGroup.svelte';
	import OverlayLayerGroup from '$components/leaflet/layers/OverlayLayerGroup.svelte';
	import { createPointLayerOptions } from '$lib/map/geojson-helpers';
	import { geoJSON } from '$lib/map/layer-factory';
	import type { BaseLayerConfig, OverlayLayerConfig } from '$lib/map/layer-factory';

	// Option 1: Use individual controls
	// import BaseLayerControl from '$components/leaflet/controls/BaseLayerControl.svelte';
	// import OverlayLayerControl from '$components/leaflet/controls/OverlayLayerControl.svelte';

	// Option 2: Use combined control
	import LayerControl from '$components/leaflet/controls/LayerControl.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let projectAddressPointData = $derived(data?.projectAddressPointData);

	const baseLayers: BaseLayerConfig[] = [
		{
			id: 'osm',
			label: 'OpenStreetMap',
			visible: false,
			factory: (L) =>
				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '© OpenStreetMap contributors'
				})
		},
		{
			id: 'carto',
			label: 'Carto Light',
			visible: true,
			factory: (L) =>
				L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
					attribution: '© CartoDB'
				})
		}
	];

	let activeLayerId = $state('carto');

	let centre = $derived(projectAddressPointData?.centre as [number, number]);

	let overlays = $state<OverlayLayerConfig[]>([]);

	onMount(async () => {
		const allOptions = await createPointLayerOptions(
			{
				radius: 5,
				fillColor: '#3388ff',
				fillOpacity: 0.6,
				color: '#ffffff',
				weight: 2,
				opacity: 1
			},
			{
				tooltip: (feature) => {
					const props = feature.properties as any;
					return `
						<strong>Address Point</strong><br>
						ID: ${props.id}<br>
						OID: ${props.addresspointoid}
					`;
				},
				popup: (feature) => {
					const props = feature.properties as any;
					return `
						<div style="min-width: 200px;">
							<h3 style="margin: 0 0 8px 0; font-size: 14px;">Address Point Details</h3>
							<table style="width: 100%; font-size: 12px;">
								<tr><td><strong>ID:</strong></td><td>${props.id}</td></tr>
								<tr><td><strong>OID:</strong></td><td>${props.addresspointoid}</td></tr>
								<tr><td><strong>End Date:</strong></td><td>${props.enddate}</td></tr>
							</table>
						</div>
					`;
				}
			}
		);

		const registeredOptions = await createPointLayerOptions(
			{
				radius: 7,
				fillColor: '#ff6b35',
				fillOpacity: 0.8,
				color: '#ffffff',
				weight: 2,
				opacity: 1
			},
			{
				tooltip: (feature) => {
					const props = feature.properties as any;
					return `
						<strong>Registered Address</strong><br>
						Type: ${props.addresspointtype}
					`;
				},
				popup: (feature) => {
					const props = feature.properties as any;
					return `
						<div style="min-width: 200px;">
							<h3 style="margin: 0 0 8px 0; font-size: 14px;">Registered Address</h3>
							<p><strong>Type:</strong> ${props.addresspointtype}</p>
						</div>
					`;
				}
			}
		);

		overlays = [
			{
				id: 'batlow',
				label: 'Batlow Marker',
				type: 'marker' as const,
				data: [-35.52, 148.15],
				options: { title: 'Batlow' },
				visible: true
			},
			{
				id: 'young',
				label: 'Young Marker',
				type: 'marker' as const,
				data: [-34.31, 148.3],
				options: { title: 'Young' },
				visible: true
			},
			geoJSON('all-address-points', projectAddressPointData.allAddresspoints, {
				label: `All Address Points (${projectAddressPointData.allAddresspoints.features.length})`,
				visible: true,
				...allOptions
			}),
			geoJSON('registered-address-points', projectAddressPointData.registeredAddresspoints, {
				label: `Registered Points (${projectAddressPointData.registeredAddresspoints.features.length})`,
				visible: true,
				...registeredOptions
			})
		];
	});
</script>

<div class="map-wrapper">
	<NewMap center={centre} zoom={11.5}>
		<BaseLayerGroup layers={baseLayers} bind:activeLayerId />
		<OverlayLayerGroup {overlays} />

		<!-- Option 1: Separate controls -->
		<!-- <BaseLayerControl position="topright" />
		<OverlayLayerControl position="topright" /> -->

		<!-- Option 2: Combined control (collapsible) -->
		<LayerControl position="topright" collapsible={true} />
	</NewMap>
</div>

<style>
	.map-wrapper {
		height: 500px;
	}
</style>
