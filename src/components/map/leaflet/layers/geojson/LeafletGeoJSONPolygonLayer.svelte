<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import { createPolygonSymbol } from '$lib/leaflet/leafletlegendutility';
	import { createTooltipContent } from '$lib/leaflet/spatialutilities.svelte';

	import type { Writable } from 'svelte/store';
	import type L from 'leaflet';
	import type {
		PolygonSymbologyOptions,
		ExtendedPolygonSymbologyOptions,
		GroupedSymbologyOptions,
		LegendInfo,
		LayerInfo
	} from '$lib/leaflet/types';

	interface Props {
		geojsonData: GeoJSON.FeatureCollection;
		layerName: string;
		visible: boolean;
		staticLayer: boolean;
		showInLegend: boolean;
		order?: number;
		editable: boolean;
		symbology: PolygonSymbologyOptions | GroupedSymbologyOptions;
		propertyForSymbol?: string;
		symbolMap?: Record<string, PolygonSymbologyOptions>;
		tooltipField?: string;
		tooltipOptions?: L.TooltipOptions;
		template_id?: string;
		interactive?: boolean;
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
		tooltipField,
		tooltipOptions = {},
		template_id,
		interactive = true
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

	function getPolygonStyle(feature: GeoJSON.Feature): L.PathOptions {
		if ('propertyField' in symbology && symbology.groups) {
			const value = feature.properties?.[symbology.propertyField];
			const groupSymbol =
				symbology.groups.find((g) => g.value === value)?.symbol || symbology.groups[0].symbol;
			return groupSymbol as L.PathOptions;
		}
		return symbology as L.PathOptions;
	}

	function createGeoJSONLayer() {
		const defaultGeojsonData = {
			type: 'FeatureCollection',
			features: []
		} as GeoJSON.FeatureCollection;

		const dataToUse = geojsonData?.features?.length ? geojsonData : defaultGeojsonData;

		geoJSONLayer = leaflet.geoJSON(dataToUse, {
			interactive: interactive,
			style: (feature) => getPolygonStyle(feature as GeoJSON.Feature),
			onEachFeature: (feature, layer) => {
				if (tooltipField && feature.properties?.[tooltipField]) {
					layer.bindTooltip(feature.properties[tooltipField].toString(), {
						permanent: false,
						direction: 'center',
						...tooltipOptions
					});
				} else if (editable && feature.properties) {
					const tooltipContent = createTooltipContent(feature, template_id);
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
				interactive,
				originalStyle: symbology,
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
			// Handel editing
		}
	}

	function createLegendInfo(): LegendInfo {
		if ('propertyField' in symbology && symbology.groups) {
			return {
				items: [
					{
						groupName: symbology.propertyField,
						items: symbology.groups.map((group) => ({
							symbol: createPolygonSymbol(group.symbol as ExtendedPolygonSymbologyOptions),
							description: String(group.value)
						}))
					}
				]
			};
		}

		return {
			items: [
				{
					symbol: createPolygonSymbol(symbology as ExtendedPolygonSymbologyOptions),
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
			if (editable) {
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
