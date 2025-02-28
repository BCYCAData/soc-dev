<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import { createPointSymbol } from '$lib/leaflet/leafletlegendutility';
	import { generateMarkerHtml } from '$lib/leaflet/symbol/leafletstylemanagement';

	import type { Writable } from 'svelte/store';
	import type L from 'leaflet';
	import type {
		PointSymbologyOptions,
		GroupedSymbologyOptions,
		CustomMarkerOptions,
		LeafletMarkerOptions,
		LegendInfo,
		LayerInfo,
		CustomDivIconOptions,
		ExtendedPointSymbologyOptions,
		ExtendedPolygonSymbologyOptions,
		LineSymbologyOptions,
		PolygonSymbologyOptions
	} from '$lib/leaflet/types';

	type LayerStyle =
		| L.PathOptions
		| CustomMarkerOptions
		| LeafletMarkerOptions
		| ExtendedPointSymbologyOptions
		| ExtendedPolygonSymbologyOptions
		| LineSymbologyOptions
		| PolygonSymbologyOptions;

	import '../../css/leaflet-popup.css';

	interface Props {
		geojsonData: GeoJSON.FeatureCollection;
		layerName: string;
		visible: boolean;
		staticLayer: boolean;
		showInLegend: boolean;
		order?: number;
		editable: boolean;
		symbology: PointSymbologyOptions | GroupedSymbologyOptions;
		propertyForSymbol?: string;
		symbolMap?: Record<string, PointSymbologyOptions>;
		tooltipTemplate?: (feature: GeoJSON.Feature) => string;
		multiFeaturePopupTemplate?: (features: GeoJSON.Feature[]) => string;
		template_id?: string;
	}

	let {
		geojsonData,
		layerName,
		visible = true,
		editable = false,
		staticLayer = false,
		showInLegend = true,
		order,
		symbology,
		tooltipTemplate,
		multiFeaturePopupTemplate,
		template_id
	}: Props = $props();

	const { getLeaflet, getLeafletMap, getLeafletLayers, getLayersControl } = getContext<{
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
		getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
		getLayersControl: () => Writable<L.Control.Layers | null>;
	}>('leafletContext');

	let leaflet: typeof L = getLeaflet();
	let map: L.Map = getLeafletMap();
	let layersStore: Writable<Record<string, LayerInfo>> = getLeafletLayers();
	let layersControl: Writable<L.Control.Layers | null> = getLayersControl();
	let geoJSONLayer: L.GeoJSON;

	function createPopupContent(features: GeoJSON.Feature[]): string {
		if (multiFeaturePopupTemplate) {
			return multiFeaturePopupTemplate(features);
		}
		return '';
	}

	function findNearbyFeatures(clickedPoint: L.LatLng, radius: number): GeoJSON.Feature[] {
		if (!geoJSONLayer) return [];

		const uniqueFeatures = new Map<string, GeoJSON.Feature>();

		geoJSONLayer.eachLayer((layer) => {
			const marker = layer as L.Marker;
			if (marker.getLatLng) {
				const layerPoint = map.latLngToLayerPoint(marker.getLatLng());
				const clickPoint = map.latLngToLayerPoint(clickedPoint);
				const distance = layerPoint.distanceTo(clickPoint);

				if (distance <= radius) {
					const feature = (marker as any).feature;
					if (feature?.properties?.ADDRESS_DETAIL_PID) {
						uniqueFeatures.set(feature.properties.ADDRESS_DETAIL_PID, feature);
					}
				}
			}
		});

		return Array.from(uniqueFeatures.values());
	}

	function createShapedMarker(latlng: L.LatLng, options: LeafletMarkerOptions): L.Marker | null {
		if (!leaflet) return null;

		const markerStyle: LayerStyle = {
			type: 'custom',
			options: {
				type: 'divIcon',
				options: {
					fillColor: options.color,
					color: '#000',
					radius: (options.options as CustomDivIconOptions).iconSize?.[0] / 2,
					weight: 1,
					fillOpacity: 0.8,
					iconSize: [
						(options.options as CustomDivIconOptions).iconSize?.[0] || 10,
						(options.options as CustomDivIconOptions).iconSize?.[1] || 10
					]
				},
				markerShape: options.markerShape,
				color: options.color
			}
		};

		const markerHtml = generateMarkerHtml(markerStyle);
		const divIconOptions = options.options as CustomDivIconOptions;
		console.log('Creating shaped marker:', {
			options,
			markerStyle,
			markerHtml
		});

		return leaflet.marker(latlng, {
			icon: leaflet.divIcon({
				html: markerHtml,
				className: divIconOptions?.className || 'custom-marker',
				iconSize: divIconOptions?.iconSize || [10, 10],
				iconAnchor: divIconOptions?.iconAnchor || [5, 5]
			})
		});
	}

	function createTextLabel(
		feature: GeoJSON.Feature,
		latlng: L.LatLng,
		options: L.DivIconOptions
	): L.Marker | null {
		if (!leaflet) return null;

		const labelText = feature.properties?.[options.html as string] || '';

		return leaflet.marker(latlng, {
			icon: leaflet.divIcon({
				...options,
				html: labelText,
				className: 'text-scale-label'
			})
		});
	}

	function createPointLayer(feature: GeoJSON.Feature, latlng: L.LatLng): L.Layer | null {
		console.log('Creating point with symbology:', {
			templateId: template_id,
			providedSymbology: symbology,
			featureProps: feature.properties
		});
		if (!symbology) return null;
		let layer: L.Layer | null = null;

		// Use template_id from props if it exists
		// if (template_id && feature.properties?.id) {
		// 	layer = createSymbolizedLayer(symbology, feature, latlng);
		// } else
		if ('propertyField' in symbology && symbology.groups) {
			const value = feature.properties?.[symbology.propertyField];
			const groupSymbol =
				symbology.groups.find((g) => g.value === value)?.symbol || symbology.groups[0]?.symbol;
			layer = groupSymbol ? createSymbolizedLayer(groupSymbol, feature, latlng) : null;
		} else {
			layer = createSymbolizedLayer(symbology, feature, latlng);
		}

		if (layer && feature.properties && tooltipTemplate && !editable) {
			layer.bindTooltip(tooltipTemplate(feature), {
				permanent: false,
				direction: 'top',
				className: 'gnaf-tooltip'
			});
		} else if (layer && editable && feature.properties) {
			const defaultTooltip = `${layerName} ID: ${feature.properties.name}`;
			layer.bindTooltip(tooltipTemplate ? tooltipTemplate(feature) : defaultTooltip, {
				permanent: false,
				direction: 'top',
				className: 'editable-feature-tooltip'
			});
		}

		if (layer) {
			layer.on('click', (e: L.LeafletMouseEvent) => {
				const nearbyFeatures = findNearbyFeatures(e.latlng, 10);

				if (nearbyFeatures.length > 1) {
					const popup = leaflet
						.popup({
							autoPan: false
						})
						.setLatLng(e.latlng)
						.setContent(createPopupContent(nearbyFeatures));

					popup.openOn(map);
				}
			});
		}

		return layer;
	}

	function createSymbolizedLayer(
		symbolOptions: PointSymbologyOptions,
		feature: GeoJSON.Feature,
		latlng: L.LatLng
	): L.Layer | null {
		if (!leaflet || !symbolOptions) return null;

		if (symbolOptions.type === 'custom') {
			const customOptions = symbolOptions.options as CustomMarkerOptions;
			console.log('Applying symbol:', {
				symbolOptions,
				resultingStyle: customOptions // inside the if (symbolOptions.type === 'custom') block
			});
			if (customOptions.markerShape) {
				return createShapedMarker(latlng, {
					type: 'divIcon',
					markerShape: customOptions.markerShape,
					color: customOptions.fillColour,
					options: {
						className: 'custom-marker',
						iconSize: [customOptions.size || 12, customOptions.size || 12],
						iconAnchor: [
							customOptions.size ? customOptions.size / 2 : 6,
							customOptions.size ? customOptions.size / 2 : 6
						]
					}
				});
			}
			return leaflet.circleMarker(latlng, {
				radius: (customOptions.size || 12) / 2,
				fillColor: customOptions.fillColour,
				color: customOptions.strokeColour,
				weight: customOptions.strokeWidth,
				opacity: customOptions.strokeOpacity,
				fillOpacity: customOptions.fillOpacity
			});
		}

		const leafletOptions = symbolOptions.options as LeafletMarkerOptions;
		if (!leafletOptions?.type) return leaflet.marker(latlng);

		switch (leafletOptions.type) {
			case 'circleMarker':
				return leaflet.circleMarker(latlng, leafletOptions.options as L.CircleMarkerOptions);
			case 'divIcon':
				return leafletOptions.markerShape
					? createShapedMarker(latlng, leafletOptions)
					: leaflet.marker(latlng, {
							icon: leaflet.divIcon(leafletOptions.options as L.DivIconOptions)
						});
			case 'textLabel':
				return createTextLabel(feature, latlng, leafletOptions.options as L.DivIconOptions);
			default:
				return leaflet.marker(latlng);
		}
	}

	function createLegendInfo(): LegendInfo {
		if (!symbology) return { items: [] };

		if ('propertyField' in symbology && symbology.groups) {
			return {
				items: [
					{
						groupName: '',
						items: symbology.groups
							.map((group) => {
								const symbol = group.symbol as ExtendedPointSymbologyOptions;
								const pointSymbol = symbol
									? createPointSymbol(symbol, undefined, layerName) // Use layerName instead of template_id
									: null;
								return pointSymbol
									? {
											symbol: pointSymbol,
											description: String(group.value)
										}
									: null;
							})
							.filter((item): item is NonNullable<typeof item> => item !== null)
					}
				]
			};
		}

		const pointSymbol = createPointSymbol(
			symbology as ExtendedPointSymbologyOptions,
			undefined,
			layerName // Use layerName instead of template_id
		);
		return {
			items: pointSymbol
				? [
						{
							symbol: pointSymbol,
							description: layerName
						}
					]
				: []
		};
	}

	function createGeoJSONLayer() {
		if (!leaflet || !map) return;

		const defaultGeojsonData = {
			type: 'FeatureCollection',
			features: []
		} as GeoJSON.FeatureCollection;

		const dataToUse = geojsonData?.features?.length ? geojsonData : defaultGeojsonData;

		geoJSONLayer = leaflet.geoJSON(dataToUse, {
			pointToLayer: (feature, latlng) => {
				const layer = createPointLayer(feature, latlng);
				if (layer && feature.properties?.label) {
					layer.bindTooltip(feature.properties.label, {
						permanent: true,
						direction: 'right',
						className: 'custom-label'
					});
				}
				return layer || new leaflet.Marker(latlng);
			}
		});

		geoJSONLayer.addTo(map);
		if (symbology && layersStore) {
			const legendInfo = createLegendInfo();
			layersStore.update((layers) => ({
				...layers,
				[layerName]: {
					layer: geoJSONLayer,
					visible,
					editable,
					showInLegend,
					legendInfo,
					template_id,
					originalStyle: symbology, // Use the original symbology directly
					order
				}
			}));
		}

		if (!staticLayer && layersControl) {
			layersControl.subscribe((control) => {
				if (control && geoJSONLayer) {
					control.addOverlay(geoJSONLayer, layerName);
				}
			});
		}
		if (!visible) {
			map.removeLayer(geoJSONLayer);
		}
	}

	onMount(() => {
		if (leaflet && map) {
			createGeoJSONLayer();

			if (editable) {
				// setupSnapping();
			}
		}
	});

	$effect(() => {
		if (geoJSONLayer && geojsonData?.features) {
			geoJSONLayer.clearLayers();
			geoJSONLayer.addData(geojsonData);
		}
	});

	onDestroy(() => {
		if (geoJSONLayer) {
			geoJSONLayer.remove();

			if (layersStore) {
				layersStore.update((layers) => {
					const { [layerName]: _, ...rest } = layers;
					return rest;
				});
			}

			if (!staticLayer && layersControl) {
				layersControl.subscribe((control) => {
					if (control) {
						control.removeLayer(geoJSONLayer);
					}
				});
			}
		}
	});
</script>
