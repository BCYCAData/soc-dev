<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';

	import type L from 'leaflet';
	import type * as EsriLeaflet from 'esri-leaflet';
	import type { Writable } from 'svelte/store';
	import type { LayerInfo, LegendInfo } from '$lib/leaflet/types';
	import type { FeatureCollection } from 'geojson';

	interface Props {
		url: string;
		name: string;
		visible?: boolean;
		where?: string;
		minZoom?: number;
		maxZoom?: number;
		style?: Record<string, any>;
		onFeatureClick?: (feature: GeoJSON.Feature) => void;
		popupTemplate?: (properties: any) => string;
	}

	let {
		url,
		name,
		visible = true,
		where,
		minZoom,
		maxZoom,
		style,
		onFeatureClick,
		popupTemplate
	}: Props = $props();

	//@ts-ignore
	let isLoading = $state(false);
	//@ts-ignore
	let loadingMessage = $state('');

	const { getLeaflet, getLeafletMap, getLeafletLayers, getLayersControl, getEsriLeaflet } =
		getContext<{
			getLeaflet: () => typeof L;
			getLeafletMap: () => L.Map;
			getLeafletLayers: () => Writable<Record<string, LayerInfo>>;
			getLayersControl: () => Writable<L.Control.Layers>;
			getEsriLeaflet: () => typeof EsriLeaflet;
		}>('leafletContext');

	let leaflet = $state<typeof L>();
	let esriLeaflet = $state<typeof EsriLeaflet>();
	let featureLayer = $state<EsriLeaflet.FeatureLayer>();
	let map = $state<L.Map>();
	let layersControl = $state<L.Control.Layers>();
	let layersStore: Writable<Record<string, LayerInfo>>;

	const getDefaultLegendInfo = (): LegendInfo => ({
		items: [
			{
				symbol: '#000000',
				description: name
			}
		]
	});

	let offset = 0;
	const pageSize = 100;
	let allFeatures: GeoJSON.Feature[] = [];
	let loadedFeatureIds = new Set<string>();
	let geoJsonLayer: L.GeoJSON | undefined;
	let idField: string;

	async function loadFeatures(mapBounds: L.LatLngBounds, featureLayer: EsriLeaflet.FeatureLayer) {
		isLoading = true;
		offset = 0;
		allFeatures = [];
		loadedFeatureIds.clear();
		featureLayer
			.query()
			.bboxIntersects(mapBounds)
			.count((error: Error | null, count: number) => {
				if (count > 0) {
					loadNextBatch(count);
				} else {
					isLoading = false;
				}
			});

		const loadNextBatch = async (totalCount: number) => {
			loadingMessage = `Loading property ${allFeatures.length + 1} of ${totalCount}`;

			featureLayer
				.query()
				.returnGeometry(true)
				.bboxIntersects(mapBounds)
				.offset(offset)
				.limit(pageSize)
				.run((error: Error | null, featureCollection: FeatureCollection) => {
					if (error) {
						console.log('ArcGISFeatureServerLayer Query error:', error);
						isLoading = false;
						return;
					}

					if (!featureCollection || !featureCollection.features.length || !map) {
						isLoading = false;
						return;
					}

					const newFeatures = featureCollection.features.filter((feature) => {
						const id = feature.properties ? feature.properties[idField].toString() : '';
						if (!loadedFeatureIds.has(id)) {
							loadedFeatureIds.add(id);
							return true;
						}
						return false;
					});

					allFeatures = [...allFeatures, ...newFeatures];

					if (allFeatures.length < totalCount) {
						offset += pageSize;
						loadNextBatch(totalCount);
					} else {
						updateGeoJsonLayer();
						isLoading = false;
					}
				});
		};
	}

	function updateGeoJsonLayer() {
		const fullCollection: FeatureCollection = {
			type: 'FeatureCollection',
			features: allFeatures
		};

		if (!geoJsonLayer) {
			geoJsonLayer = leaflet?.geoJSON(fullCollection, {
				style: {
					color: '#FF0000',
					weight: 0.5,
					opacity: 1,
					fillColor: '#FF0000',
					fillOpacity: 0.1
				},
				onEachFeature: (feature, layer) => {
					if (popupTemplate) {
						const featureProperties = feature.properties;
						layer.bindPopup(popupTemplate(featureProperties));
					}
				}
			});
			if (map && geoJsonLayer) {
				geoJsonLayer.addTo(map);
			}
		} else {
			geoJsonLayer.clearLayers();
			geoJsonLayer.addData(fullCollection);
		}
	}

	onMount(async () => {
		leaflet = getLeaflet();
		esriLeaflet = getEsriLeaflet();
		map = getLeafletMap();

		const controlStore = getLayersControl();
		controlStore.subscribe((value) => {
			if (value) layersControl = value;
		});

		layersStore = getLeafletLayers();

		const layer = esriLeaflet.featureLayer({
			url,
			where,
			minZoom,
			maxZoom
		});

		layer.metadata((error: Error | null, metadata: any) => {
			idField = metadata.objectIdField;

			map?.once('resize', () => {
				if (map) {
					const mapBounds = map.getBounds();
					loadFeatures(mapBounds, layer);
				}
			});

			map?.on('moveend', () => {
				if (map && featureLayer) {
					offset = 0;
					const newBounds = map.getBounds();
					loadFeatures(newBounds, featureLayer);
				}
			});

			layersStore.subscribe((layers) => {
				const layerInfo = layers[name];
				if (map && layerInfo && geoJsonLayer) {
					if (layerInfo.visible) {
						geoJsonLayer.addTo(map);
					} else {
						geoJsonLayer.remove();
					}
				}
			});
			map?.invalidateSize();
		});

		featureLayer = layer;

		if (style) {
			layer.setStyle(style);
		}

		layer.on('click', (e: any) => {
			if (onFeatureClick) {
				onFeatureClick(e.layer.feature);
			}
		});

		if (visible) {
			layer.addTo(map);
		}

		if (layersControl) {
			layersControl.addOverlay(layer, name);
		}

		layersStore.update((layers) => ({
			...layers,
			[name]: {
				layer: layer,
				visible,
				editable: false,
				showInLegend: true,
				legendInfo: getDefaultLegendInfo()
			}
		}));
	});

	onDestroy(() => {
		if (featureLayer && map) {
			featureLayer.remove();
		}
		if (layersControl && featureLayer) {
			layersControl.removeLayer(featureLayer);
		}
		layersStore.update((layers) => {
			const { [name]: removed, ...rest } = layers;
			return rest;
		});
	});
</script>

<style>
	:global(.feature-popup) {
		padding: 8px;
	}

	:global(.feature-popup div) {
		margin: 4px 0;
	}
</style>
