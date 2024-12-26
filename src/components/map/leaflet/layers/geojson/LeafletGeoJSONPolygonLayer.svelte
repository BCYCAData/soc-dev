<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import { createPolygonStyle, createPolygonSymbol } from '$lib/leaflet/leafletlegendutility';

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
		editable: boolean;
		symbology: PolygonSymbologyOptions | GroupedSymbologyOptions;
		propertyForSymbol?: string;
		symbolMap?: Record<string, PolygonSymbologyOptions>;
		tooltipField?: string;
		tooltipOptions?: L.TooltipOptions;
	}

	let {
		geojsonData,
		layerName,
		visible = true,
		editable = false,
		staticLayer = false,
		showInLegend = true,
		symbology,
		tooltipField,
		tooltipOptions = {}
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
	let geomanInitialized = false;

	function getPolygonStyle(feature: GeoJSON.Feature): L.PathOptions {
		if ('propertyField' in symbology && symbology.groups) {
			const value = feature.properties?.[symbology.propertyField];
			const groupSymbol =
				symbology.groups.find((g) => g.value === value)?.symbol || symbology.groups[0].symbol;
			return createPolygonStyle(groupSymbol as ExtendedPolygonSymbologyOptions);
		}
		return createPolygonStyle(symbology as ExtendedPolygonSymbologyOptions);
	}

	function createGeoJSONLayer() {
		const defaultGeojsonData = {
			type: 'FeatureCollection',
			features: []
		} as GeoJSON.FeatureCollection;

		const dataToUse = geojsonData?.features?.length ? geojsonData : defaultGeojsonData;

		geoJSONLayer = leaflet.geoJSON(dataToUse, {
			style: (feature) => getPolygonStyle(feature as GeoJSON.Feature),
			onEachFeature: (feature, layer) => {
				if (tooltipField && feature.properties?.[tooltipField]) {
					layer.bindTooltip(feature.properties[tooltipField].toString(), {
						permanent: false,
						direction: 'center',
						...tooltipOptions
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
				legendInfo
			}
		}));

		if (!staticLayer) {
			layersControl.subscribe((control) => {
				if (control) {
					control.addOverlay(geoJSONLayer, layerName);
				}
			});
		}

		if (editable) {
			enableEditing();
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
		if (!map.pm?.Toolbar || geomanInitialized) return;
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
		leaflet = getLeaflet();
		map = getLeafletMap();
		layersStore = getLeafletLayers();
		layersControl = getLayersControl();
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
			disableEditing();
		}
	});
</script>
