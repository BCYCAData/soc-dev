<script lang="ts">
	import { onMount } from 'svelte';
	import Spinner from '$components/page/Spinner.svelte';
	import { featureTemplates } from '$lib/leaflet/spatialutilities.svelte';
	import {
		addresspointOptions,
		myPropertyMapConfig,
		propertyOptions,
		waypointOptions
	} from '$lib/leaflet/mapconfig';

	import {
		getLineSymbology,
		getPointSymbology,
		getPolygonSymbology
	} from '$lib/leaflet/symbol/leaflet-template-symbol';

	import type { Feature, Geometry, GeoJsonProperties } from 'geojson';
	import type { FeatureTemplate } from '$lib/leaflet/spatial';
	import type { PageData as BasePageData } from './$types';
	import type { Component } from 'svelte';
	import type {
		ControlInfo,
		GroupedSymbologyOptions,
		LineGroupedSymbologyOptions,
		LineSymbologyOptions,
		PointSymbologyOptions,
		PolygonSymbologyOptions
	} from '$lib/leaflet/types';

	interface Attribute {
		feature_id: string;
		field_id: string;
		value: any;
	}

	interface SpatialFeature extends Feature<Geometry, GeoJsonProperties> {
		id: string;
		template_id: string;
		geom: GeoJSON.Geometry;
	}

	interface ExtendedPageData extends BasePageData {
		propertyGeometryData: Array<{
			centre: [number, number];
			bounds: [[number, number], [number, number]];
			property: GeoJSON.FeatureCollection;
			address_point: GeoJSON.FeatureCollection;
			way_point: GeoJSON.FeatureCollection;
		}>;
		featureTemplates: Record<string, any>;
		spatialFeatures: Record<string, any>;
		featureAttributes: Record<string, any>;
	}

	interface BaseLayerProps {
		geojsonData: GeoJSON.FeatureCollection;
		layerName: string;
		visible: boolean;
		staticLayer: boolean;
		showInLegend: boolean;
		order: number;
		template_id?: string;
		editable: boolean;
		interactive?: boolean;
		tooltipTemplate?: (feature: Feature<Geometry, GeoJsonProperties>) => string;
	}

	interface PolygonLayerProps extends BaseLayerProps {
		symbology: PolygonSymbologyOptions | GroupedSymbologyOptions;
	}

	interface LineLayerProps extends BaseLayerProps {
		symbology: LineSymbologyOptions | LineGroupedSymbologyOptions;
	}

	interface PointLayerProps extends BaseLayerProps {
		symbology: PointSymbologyOptions | GroupedSymbologyOptions;
	}

	interface MapProps {
		onMapReady?: () => void;
		onMapInstance?: (map: L.Map) => void;
		centre?: L.LatLngExpression | [number, number] | undefined;
		initialExtent?: L.LatLngBoundsExpression | [[number, number], [number, number]] | undefined;
		zoom?: number | undefined;
		minZoom?: number | undefined;
		maxZoom?: number | undefined;
		zoomable?: boolean;
		zoomSnap?: number;
		attributionControl?: ControlInfo;
		layersControl?: ControlInfo;
		editControl?: ControlInfo;
		width?: string;
		height?: string;
		baseLayers?: Array<{ name: string; url: string; attribution: string }>;
		children?: import('svelte').Snippet;
	}

	interface ControlProps {
		position: L.ControlPosition;
	}

	interface Props {
		data: ExtendedPageData;
	}
	let { data }: Props = $props();

	const propertyGeometryData = data.propertyGeometryData[0];

	let LeafletMap = $state<Component<MapProps>>();
	let LeafletGeoJSONPolygonLayer = $state<Component<PolygonLayerProps>>();
	let LeafletGeoJSONLineLayer = $state<Component<LineLayerProps>>();
	let LeafletGeoJSONPointLayer = $state<Component<PointLayerProps>>();
	let LeafletScaleControl = $state<Component<ControlProps>>();
	let LeafletLegendControl = $state<Component<ControlProps>>();

	type CategoryOrder = {
		[key in 'asset' | 'operational' | 'hazard']: number;
	};

	type CategoryGroups = {
		[key: string]: FeatureTemplate[];
	};

	const BASE_LAYER_ORDERS: Record<string, number> = {
		'Property Boundary Layer': 10,
		'Addresspoint Layer': 20,
		'Waypoint Layer': 30
	};

	const CATEGORY_BASE_ORDERS: CategoryOrder = {
		asset: 100,
		hazard: 200,
		operational: 400
	};

	function getTemplateLayerOrder(category: keyof CategoryOrder, indexInCategory: number): number {
		return CATEGORY_BASE_ORDERS[category] + indexInCategory;
	}

	const templatesByCategory = Object.values(data.featureTemplates).reduce<CategoryGroups>(
		(acc, template) => {
			const typedTemplate = template as FeatureTemplate;
			if (!acc[typedTemplate.category]) {
				acc[typedTemplate.category] = [];
			}
			acc[typedTemplate.category].push(typedTemplate);
			return acc;
		},
		{}
	);

	function transformFeaturesToGeoJSON(
		features: Record<string, SpatialFeature>,
		attributes: Record<string, Attribute>
	) {
		if (!features || !attributes) {
			return {};
		}
		const featuresByTemplate: Record<string, GeoJSON.FeatureCollection> = {};
		Object.values(features).forEach((feature) => {
			if (!featuresByTemplate[feature.template_id]) {
				featuresByTemplate[feature.template_id] = {
					type: 'FeatureCollection',
					features: []
				};
			}

			const featureAttributes = Object.values(attributes)
				.filter((attr) => attr.feature_id === feature.id)
				.reduce(
					(acc, attr) => ({
						...acc,
						[attr.field_id]: attr.value
					}),
					{}
				);

			featuresByTemplate[feature.template_id].features.push({
				type: 'Feature',
				geometry: feature.geom,
				properties: {
					id: feature.id,
					...featureAttributes
				}
			});
		});
		return featuresByTemplate;
	}

	let featuresByTemplate = $state<Record<string, GeoJSON.FeatureCollection>>({});

	$effect(() => {
		const spatialFeatures = data?.spatialFeatures;
		const featureAttributes = data?.featureAttributes;
		if (spatialFeatures && featureAttributes) {
			featuresByTemplate = transformFeaturesToGeoJSON(spatialFeatures, featureAttributes);
		} else {
			featuresByTemplate = {};
		}
	});

	let mapLoaded = $state(false);

	function handleMapLoaded() {
		mapLoaded = true;
	}

	onMount(async () => {
		[
			LeafletMap,
			LeafletGeoJSONPolygonLayer,
			LeafletGeoJSONLineLayer,
			LeafletGeoJSONPointLayer,
			LeafletScaleControl,
			LeafletLegendControl
		] = await Promise.all([
			import('$components/map/leaflet/Leafletmap.svelte').then((m) => m.default),
			import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPolygonLayer.svelte').then(
				(m) => m.default
			),
			import('$components/map/leaflet/layers/geojson/LeafletGeoJSONLineLayer.svelte').then(
				(m) => m.default
			),
			import('$components/map/leaflet/layers/geojson/LeafletGeoJSONPointLayer.svelte').then(
				(m) => m.default
			),
			import('$components/map/leaflet/controls/LeafletScaleControl.svelte').then((m) => m.default),
			import('$components/map/leaflet/controls/LeafletLegendControl.svelte').then((m) => m.default)
		]);
	});
	$effect(() => {
		Object.assign(featureTemplates, data.featureTemplates);
	});
</script>

<div class="flex h-full overflow-hidden">
	<div class="relative flex-grow">
		<div class="h-full">
			{#if LeafletMap && LeafletGeoJSONPolygonLayer && LeafletGeoJSONLineLayer && LeafletGeoJSONPointLayer}
				{#if !mapLoaded}
					<div class="spinner-overlay">
						<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
					</div>
				{/if}
				<div class="h-full w-full">
					<LeafletMap
						{...myPropertyMapConfig(propertyGeometryData.centre, propertyGeometryData.bounds)}
						onMapReady={handleMapLoaded}
					>
						<LeafletGeoJSONPolygonLayer
							geojsonData={propertyGeometryData.property}
							layerName="Property Boundary Layer"
							visible={true}
							editable={false}
							staticLayer={false}
							showInLegend={true}
							interactive={false}
							order={BASE_LAYER_ORDERS['Property Boundary Layer']}
							symbology={propertyOptions}
						/>

						{#each Object.entries(templatesByCategory) as [category, templates]}
							{#each templates as template, templateIndex}
								{@const typedTemplate = template as FeatureTemplate}
								{#if typedTemplate.geometry_type === 'polygon'}
									<LeafletGeoJSONPolygonLayer
										order={getTemplateLayerOrder(category as keyof CategoryOrder, templateIndex)}
										geojsonData={featuresByTemplate[typedTemplate.id] || {
											type: 'FeatureCollection',
											features: []
										}}
										layerName={typedTemplate.name}
										template_id={typedTemplate.id}
										visible={true}
										editable={true}
										staticLayer={false}
										showInLegend={true}
										symbology={getPolygonSymbology(typedTemplate.category, typedTemplate.name)}
									/>
								{:else if typedTemplate.geometry_type === 'line'}
									<LeafletGeoJSONLineLayer
										order={getTemplateLayerOrder(category as keyof CategoryOrder, templateIndex)}
										geojsonData={featuresByTemplate[typedTemplate.id] || {
											type: 'FeatureCollection',
											features: []
										}}
										layerName={typedTemplate.name}
										template_id={typedTemplate.id}
										visible={true}
										editable={true}
										staticLayer={false}
										showInLegend={true}
										symbology={getLineSymbology(typedTemplate.category, typedTemplate.name)}
										tooltipTemplate={(
											feature: Feature<Geometry, GeoJsonProperties>
										) => `Type: ${typedTemplate.name}<br>
                                        Length: ${feature.properties?.length}m<br>
                                        ID: ${feature.properties?.id}
                                    `}
									/>
								{:else if typedTemplate.geometry_type === 'point'}
									<LeafletGeoJSONPointLayer
										order={getTemplateLayerOrder(category as keyof CategoryOrder, templateIndex)}
										geojsonData={featuresByTemplate[typedTemplate.id] || {
											type: 'FeatureCollection',
											features: []
										}}
										layerName={typedTemplate.name}
										template_id={typedTemplate.id}
										visible={true}
										editable={true}
										staticLayer={false}
										showInLegend={true}
										symbology={getPointSymbology(typedTemplate.category, typedTemplate.name)}
										tooltipTemplate={(feature: Feature<Geometry, GeoJsonProperties>) => `
                                            Name: ${feature.properties?.name}<br>
                                            Type: ${typedTemplate.name}<br>
                                            ID: ${feature.properties?.id}
                                        `}
									/>
								{/if}
							{/each}
						{/each}
						<LeafletGeoJSONPointLayer
							geojsonData={propertyGeometryData.address_point}
							layerName="Addresspoint Layer"
							visible={true}
							editable={false}
							staticLayer={false}
							showInLegend={true}
							order={BASE_LAYER_ORDERS['Property Boundary Layer']}
							symbology={addresspointOptions}
						/>
						<LeafletGeoJSONPointLayer
							geojsonData={propertyGeometryData.way_point}
							layerName="Waypoint Layer"
							visible={true}
							editable={false}
							staticLayer={false}
							showInLegend={true}
							order={BASE_LAYER_ORDERS['Property Boundary Layer']}
							symbology={waypointOptions}
						/>

						<LeafletScaleControl position="bottomleft" />
						<LeafletLegendControl position="bottomright" />
					</LeafletMap>
				</div>
			{:else}
				<div class="spinner-overlay">
					<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	.h-full {
		height: 93%;
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
		background-color: rgba(255, 255, 255, 0.7);
		z-index: 1000;
	}
</style>
