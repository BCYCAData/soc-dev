<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getMapContext } from '$lib/map/map-types';
	import { getLeaflet } from '$lib/map/layer-factory';

	import type { GeoJSON, GeoJSONOptions, CircleMarkerOptions, LatLngExpression } from 'leaflet';

	interface PointStyle {
		radius?: number;
		fillColor?: string;
		fillOpacity?: number;
		color?: string;
		weight?: number;
		opacity?: number;
	}

	interface Props {
		data: GeoJSON.FeatureCollection<GeoJSON.Point>;
		name: string;
		visible?: boolean;
		style?: PointStyle;
		onFeatureClick?: (feature: GeoJSON.Feature<GeoJSON.Point>, latlng: LatLngExpression) => void;
		tooltip?: (feature: GeoJSON.Feature<GeoJSON.Point>) => string;
		popup?: (feature: GeoJSON.Feature<GeoJSON.Point>) => string;
	}

	let { data, name, visible = true, style = {}, onFeatureClick, tooltip, popup }: Props = $props();

	const { getMap } = getMapContext();
	let L: typeof import('leaflet');
	let map: L.Map | null = null;
	let layer = $state<GeoJSON | null>(null);

	// Default point style
	const defaultStyle: CircleMarkerOptions = $derived({
		radius: 6,
		fillColor: '#3388ff',
		fillOpacity: 0.7,
		color: '#ffffff',
		weight: 2,
		opacity: 1,
		...style
	});

	// Create GeoJSON options with point-to-layer styling
	const geoJsonOptions: GeoJSONOptions = {
		pointToLayer: (feature, latlng) => {
			return L.circleMarker(latlng, defaultStyle);
		},
		onEachFeature: (feature: GeoJSON.Feature<GeoJSON.Point>, layer: L.Layer) => {
			// Add tooltip if provided
			if (tooltip) {
				layer.bindTooltip(tooltip(feature), {
					sticky: true,
					direction: 'top'
				});
			}

			// Add popup if provided
			if (popup) {
				layer.bindPopup(popup(feature));
			}

			// Add click handler if provided
			if (onFeatureClick) {
				layer.on('click', (e: L.LeafletMouseEvent) => {
					onFeatureClick(feature, e.latlng);
				});
			}

			// Add hover effects
			layer.on('mouseover', () => {
				if (layer instanceof L.CircleMarker) {
					layer.setStyle({
						radius: (defaultStyle.radius || 6) + 2,
						fillOpacity: 0.9,
						weight: 3
					});
				}
			});

			layer.on('mouseout', () => {
				if (layer instanceof L.CircleMarker) {
					layer.setStyle(defaultStyle);
				}
			});
		}
	};

	onMount(async () => {
		L = await getLeaflet();
		map = getMap();
		if (!map) {
			console.error('GeoJSONPointLayer: Map not found');
			return;
		}
		layer = L.geoJSON(data, geoJsonOptions);
		if (visible) {
			layer.addTo(map);
		}
		console.log(`GeoJSONPointLayer: Layer "${name}" created with ${data.features.length} points`);
	});

	// Reactively handle visibility
	$effect(() => {
		if (!layer || !map) return;
		if (visible) {
			if (!map.hasLayer(layer)) {
				layer.addTo(map);
				console.log(`GeoJSONPointLayer: Layer "${name}" added to map`);
			}
		} else {
			if (map.hasLayer(layer)) {
				map.removeLayer(layer);
				console.log(`GeoJSONPointLayer: Layer "${name}" removed from map`);
			}
		}
	});

	// Reactively handle data updates
	$effect(() => {
		if (layer && data) {
			layer.clearLayers();
			layer.addData(data);
			console.log(`GeoJSONPointLayer: Layer "${name}" updated with ${data.features.length} points`);
		}
	});

	onDestroy(() => {
		if (layer && map && map.hasLayer(layer)) {
			map.removeLayer(layer);
			layer = null;
			console.log(`GeoJSONPointLayer: Layer "${name}" destroyed`);
		}
	});
</script>
