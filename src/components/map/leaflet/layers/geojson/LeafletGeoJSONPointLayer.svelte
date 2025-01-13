<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import { createPointSymbol } from '$lib/leaflet/leafletlegendutility';

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
		MarkerShape
	} from '$lib/leaflet/types';

	import '../../css/leaflet-popup.css';

	interface Props {
		geojsonData: GeoJSON.FeatureCollection;
		layerName: string;
		visible: boolean;
		staticLayer: boolean;
		showInLegend: boolean;
		editable: boolean;
		symbology: PointSymbologyOptions | GroupedSymbologyOptions;
		propertyForSymbol?: string;
		symbolMap?: Record<string, PointSymbologyOptions>;
		tooltipTemplate?: (feature: GeoJSON.Feature) => string;
		multiFeaturePopupTemplate?: (features: GeoJSON.Feature[]) => string;
	}

	let {
		geojsonData,
		layerName,
		visible = true,
		editable = false,
		staticLayer = false,
		showInLegend = true,
		symbology,
		tooltipTemplate,
		multiFeaturePopupTemplate
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
	let geomanInitialized = false;

	function createPopupContent(features: GeoJSON.Feature[]): string {
		if (multiFeaturePopupTemplate) {
			return multiFeaturePopupTemplate(features);
		}
		return '';
		// 	return `
		//     <div class="multi-feature-popup">
		//         <h4>Addresses at this location:</h4>
		//         ${features
		// 						.map(
		// 							(feature) => `
		//             <div class="feature-item">
		//                 <strong>${feature.properties?.street_number}</strong>
		//                 <div>ID: ${feature.properties?.ADDRESS_DETAIL_PID}</div>
		//                 <div>Type: ${feature.properties?.GEOCODE_TYPE}</div>
		//             </div>
		//         `
		// 						)
		// 						.join('')}
		//     </div>
		// `;
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

		const markerHtml = generateMarkerHtml(options);
		const divIconOptions = options?.options as CustomDivIconOptions;

		return leaflet.marker(latlng, {
			icon: leaflet.divIcon({
				html: markerHtml,
				className: divIconOptions?.className || 'custom-marker',
				iconSize: divIconOptions?.iconSize || [10, 10],
				iconAnchor: divIconOptions?.iconAnchor || [5, 5]
			})
		});
	}

	function generateMarkerHtml(options: LeafletMarkerOptions): string {
		if (!options) return '';

		const divIconOptions = options.options as CustomDivIconOptions;
		const shape = (options.markerShape || 'circle') as MarkerShape;
		const color = options.color || '#3388ff';
		const size = (divIconOptions?.iconSize?.[0] || 10) + 'px';

		const shapeStyles: Record<MarkerShape, string> = {
			text: '',
			circle: 'border-radius: 50%;',
			square: '',
			star: 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);',
			triangle: 'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);',
			'triangle-down': 'clip-path: polygon(0% 0%, 100% 0%, 50% 100%);',
			wye: 'clip-path: polygon(50% 0%, 15% 100%, 85% 100%);',
			diamond: 'transform: rotate(45deg);',
			'concentric-circle': `border-radius: 50%; box-shadow: 0 0 0 2px white, 0 0 0 3px ${color};`,
			'concentric-square': `box-shadow: 0 0 0 2px white, 0 0 0 3px ${color};`,
			'concentric-triangle': `clip-path: polygon(50% 0%, 0% 100%, 100% 100%); box-shadow: 0 0 0 2px white, 0 0 0 3px ${color};`,
			'concentric-diamond': `transform: rotate(45deg); box-shadow: 0 0 0 2px white, 0 0 0 3px ${color};`
		};

		return `<div style="
            width: ${size};
            height: ${size};
            background-color: ${color};
            border: 1px solid #000;
            ${shapeStyles[shape] || ''}
        "></div>`;
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
		if (!symbology) return null;

		let layer: L.Layer | null = null;

		if ('propertyField' in symbology && symbology.groups) {
			const value = feature.properties?.[symbology.propertyField];
			const groupSymbol =
				symbology.groups.find((g) => g.value === value)?.symbol || symbology.groups[0]?.symbol;
			layer = groupSymbol ? createSymbolizedLayer(groupSymbol, feature, latlng) : null;
		} else {
			layer = createSymbolizedLayer(symbology, feature, latlng);
		}

		if (layer && feature.properties && tooltipTemplate) {
			// 	const tooltipContent = `
			//     Address ID: ${feature.properties.ADDRESS_DETAIL_PID}<br>
			//     Geocode Type: ${feature.properties.GEOCODE_TYPE}<br>
			//     Street Number: ${feature.properties.street_number}
			// 	<p>Click to see if there are multiple addresses</p>
			// `;
			layer.bindTooltip(tooltipTemplate(feature), {
				permanent: false,
				direction: 'top',
				className: 'gnaf-tooltip'
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
			return leaflet.circleMarker(latlng, {
				radius: customOptions?.size || 1,
				fillColor: customOptions?.fillColour,
				color: customOptions?.strokeColour,
				weight: customOptions?.strokeWidth,
				opacity: customOptions?.strokeOpacity,
				fillOpacity: customOptions?.fillOpacity
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
								const pointSymbol = symbol ? createPointSymbol(symbol) : null;
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

		const pointSymbol = createPointSymbol(symbology as ExtendedPointSymbologyOptions);
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
					legendInfo
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
	}

	function enableEditing() {
		if (geoJSONLayer?.pm) {
			geoJSONLayer.pm.enable({
				allowSelfIntersection: false
			});
		}
	}

	function disableEditing() {
		if (geoJSONLayer?.pm) {
			geoJSONLayer.pm.disable();
		}
	}

	function setupGeomanControls() {
		if (!map?.pm?.Toolbar || geomanInitialized) return;

		const actions = ['add', 'edit', 'delete'] as const;
		actions.forEach((action) => {
			const controlName = `${layerName}-${action}`;
			const existingButtons = map.pm.Toolbar.getButtons();

			if (!existingButtons[controlName]) {
				map.pm.Toolbar.createCustomControl({
					name: controlName,
					block: 'custom',
					title: `${action.charAt(0).toUpperCase() + action.slice(1)} ${layerName}`,
					onClick: () => handleGeomanAction(action),
					toggle: true,
					className: `custom-geoman-${action}-icon`
				});
			}
		});
	}

	function handleGeomanAction(action: 'add' | 'edit' | 'delete') {
		if (!geoJSONLayer?.pm) return;

		switch (action) {
			case 'add':
			case 'delete':
				geoJSONLayer.pm.enable();
				break;
			case 'edit':
				enableEditing();
				break;
		}
	}

	onMount(() => {
		if (leaflet && map) {
			createGeoJSONLayer();
			if (editable) {
				setupGeomanControls();
				geomanInitialized = true;
			}
		}
	});

	$effect(() => {
		if (geoJSONLayer) {
			if (editable) {
				enableEditing();
			} else {
				disableEditing();
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

			disableEditing();
		}
	});
</script>
