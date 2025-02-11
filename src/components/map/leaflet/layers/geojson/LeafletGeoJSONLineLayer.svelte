<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type L from 'leaflet';
	import { createLineStyle, createLineSymbol } from '$lib/leaflet/leafletlegendutility';
	import type {
		LineSymbologyOptions,
		LegendInfo,
		LayerInfo,
		LineGroupedSymbologyOptions
	} from '$lib/leaflet/types';

	interface Props {
		geojsonData: GeoJSON.FeatureCollection;
		layerName: string;
		visible: boolean;
		staticLayer: boolean;
		showInLegend: boolean;
		order?: number;
		editable: boolean;
		symbology: LineSymbologyOptions | LineGroupedSymbologyOptions;
		propertyForSymbol?: string;
		symbolMap?: Record<string, LineSymbologyOptions>;
		tooltipField?: string;
		tooltipOptions?: L.TooltipOptions;
		tooltipTemplate?: (feature: GeoJSON.Feature) => string;
		template_id?: string;
	}

	let {
		geojsonData,
		layerName,
		visible = true,
		staticLayer = false,
		showInLegend = true,
		order,
		editable = false,
		symbology = {},
		propertyForSymbol,
		symbolMap = {},
		tooltipField,
		tooltipOptions = {},
		template_id
	}: Props = $props();

	const { getLeaflet, getLeafletMap, getLeafletLayers, getLayersControl } = getContext<{
		getLeaflet: () => typeof L;
		getLeafletMap: () => L.Map;
		getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
		getLayersControl: () => Writable<L.Control.Layers | null>;
	}>('leafletContext');

	let leaflet: typeof L;
	let map: L.Map;
	let layersStore: Writable<Record<string, LayerInfo>>;
	let layersControl: Writable<L.Control.Layers | null>;
	let geoJSONLayer: L.GeoJSON;

	function getLineStyle(feature: GeoJSON.Feature): L.PathOptions {
		if ('propertyField' in symbology && 'groups' in symbology) {
			const value = feature.properties?.[symbology.propertyField];
			const groupSymbol =
				symbology.groups.find((g: { value: unknown }) => g.value === value)?.symbol ||
				symbology.groups[0].symbol;
			return createLineStyle(groupSymbol as LineSymbologyOptions);
		}

		if (propertyForSymbol && feature.properties?.[propertyForSymbol]) {
			const styleKey = feature.properties[propertyForSymbol];
			return createLineStyle({
				...(symbology as LineSymbologyOptions),
				...symbolMap[styleKey]
			});
		}

		return createLineStyle(symbology as LineSymbologyOptions);
	}

	function createGeoJSONLayer() {
		const defaultGeojsonData = {
			type: 'FeatureCollection',
			features: []
		} as GeoJSON.FeatureCollection;

		const dataToUse = geojsonData?.features?.length ? geojsonData : defaultGeojsonData;

		const lineStyle: L.PathOptions = {
			color: (symbology as LineSymbologyOptions).color,
			weight: (symbology as LineSymbologyOptions).width,
			opacity: (symbology as LineSymbologyOptions).opacity
		};

		geoJSONLayer = leaflet.geoJSON(dataToUse, {
			style: (feature) => getLineStyle(feature as GeoJSON.Feature),
			onEachFeature: (feature, layer) => {
				if (tooltipField && feature.properties?.[tooltipField]) {
					layer.bindTooltip(feature.properties[tooltipField].toString(), {
						permanent: false,
						direction: 'center',
						...tooltipOptions
					});
				} else if (editable && feature.properties) {
					const tooltipContent = `${layerName}<br>ID: ${feature.properties.id}`;
					layer.bindTooltip(tooltipContent, {
						permanent: false,
						direction: 'center',
						className: 'editable-feature-tooltip'
					});
				}
			}
		});

		geoJSONLayer.addTo(map);

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
				originalStyle: lineStyle,
				order
			}
		}));

		if (!staticLayer) {
			layersControl.subscribe((control) => {
				if (control) {
					control.addOverlay(geoJSONLayer, layerName);
				}
			});
		}
		if (!visible) {
			map.removeLayer(geoJSONLayer);
		}

		$effect(() => {
			if (!geoJSONLayer || !map) return;

			if (visible) {
				geoJSONLayer.addTo(map);
			} else {
				map.removeLayer(geoJSONLayer);
			}
		});

		if (editable) {
			// enableEditing();
		}
	}

	function createLegendInfo(): LegendInfo {
		if ('propertyField' in symbology && 'groups' in symbology) {
			return {
				items: [
					{
						groupName: symbology.propertyField,
						items: symbology.groups.map(
							(group: { value: string | number; symbol: LineSymbologyOptions; label: string }) => ({
								symbol: createLineSymbol(group.symbol as LineSymbologyOptions),
								description: String(group.value)
							})
						)
					}
				]
			};
		}
		return {
			items: [
				{
					symbol: createLineSymbol(symbology as LineSymbologyOptions),
					description: layerName
				}
			]
		};
	}

	onMount(() => {
		leaflet = getLeaflet();
		map = getLeafletMap();
		layersStore = getLeafletLayers();
		layersControl = getLayersControl();
		if (leaflet && map) {
			createGeoJSONLayer();
			if (geoJSONLayer && editable) {
				// setupSnapping();
			}
		}
	});

	$effect(() => {
		if (geoJSONLayer && geojsonData) {
			geoJSONLayer.clearLayers();
			geoJSONLayer.addData(geojsonData);
		}
	});

	onDestroy(() => {
		if (geoJSONLayer) {
			geoJSONLayer.remove();
			layersStore.update((layers) => {
				const { [layerName]: _, ...rest } = layers;
				return rest;
			});

			if (!staticLayer) {
				layersControl.subscribe((control) => {
					if (control) {
						control.removeLayer(geoJSONLayer);
					}
				});
			}
		}
	});
</script>
