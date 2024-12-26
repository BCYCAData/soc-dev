<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type L from 'leaflet';
	import { createLineStyle, createLineSymbol } from '$lib/leaflet/leafletlegendutility';
	import type { LineSymbologyOptions, LegendInfo, LayerInfo } from '$lib/leaflet/types';

	interface LineGroupedSymbologyOptions {
		propertyField: string;
		groups: Array<{
			value: string | number;
			symbol: LineSymbologyOptions;
			label: string;
		}>;
	}

	interface Props {
		geojsonData: GeoJSON.FeatureCollection;
		layerName: string;
		visible: boolean;
		staticLayer: boolean;
		showInLegend: boolean;
		editable: boolean;
		symbology: LineSymbologyOptions | LineGroupedSymbologyOptions;
		propertyForSymbol?: string;
		symbolMap?: Record<string, LineSymbologyOptions>;
		tooltipField?: string;
		tooltipOptions?: L.TooltipOptions;
	}

	let {
		geojsonData,
		layerName,
		visible = true,
		staticLayer = false,
		showInLegend = true,
		editable = false,
		symbology = {},
		propertyForSymbol,
		symbolMap = {},
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

		geoJSONLayer = leaflet.geoJSON(dataToUse, {
			style: (feature) => getLineStyle(feature as GeoJSON.Feature),
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

	function enableEditing() {
		if (geoJSONLayer.pm) {
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
