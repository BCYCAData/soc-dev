/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic Leaflet/GeoJSON/external-library data structures */
import type { Layer } from 'leaflet';
import type {
	CategoryStyle,
	LayerConfig,
	LineStyle,
	PolygonStyle,
	PointStyle as ConfigPointStyle
} from '$lib/map/layers/schemas/layer-config.types';
import {
	createPointLayerOptions,
	createLineLayerOptions,
	createPolygonLayerOptions,
	type PointStyle as HelperPointStyle,
	type LineStyle as HelperLineStyle,
	type PolygonStyle as HelperPolygonStyle
} from '$lib/map/geojson-helpers';
import { createShapeDivIcon } from '$lib/map/render/markers';
import { escapeHtml } from '$lib/map/render/template-utils';

type LeafletNS = typeof import('leaflet');

const EMPTY: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features: [] };

/** Resolve a popup/tooltip template (string | function) into `(feature) => string`. */
function resolveTemplate(
	template: string | ((feature: GeoJSON.Feature) => string) | undefined,
	property: string | undefined
): ((feature: GeoJSON.Feature) => string) | undefined {
	if (typeof template === 'function') return template;
	if (typeof template === 'string') return () => template;
	// Bound as HTML by Leaflet — escape the raw property value (XSS). Function
	// templates are the author's responsibility (escape at the call site).
	if (property) return (feature) => escapeHtml(feature.properties?.[property] ?? '');
	return undefined;
}

/** Convert a config PointStyle (possibly a shape) into a geojson-helpers
 * PointStyle, materialising a divIcon for non-circle shapes. */
function toHelperPointStyle(L: LeafletNS, ps: ConfigPointStyle | undefined): HelperPointStyle {
	if (!ps) return {};
	const { shape, size, fillColor, ...rest } = ps;
	if (shape && shape !== 'circle') {
		return {
			...rest,
			fillColor,
			icon: createShapeDivIcon(L, { shape, color: fillColor ?? '#3388ff', size })
		};
	}
	return { ...rest, fillColor };
}

/** Pick the category style for a feature given a categorized style config. */
function pickCategory(
	feature: GeoJSON.Feature,
	property: string,
	categories: Record<string, CategoryStyle>,
	fallback?: CategoryStyle
): CategoryStyle | undefined {
	const value = feature.properties?.[property];
	return categories[value as string] ?? categories[String(value)] ?? fallback;
}

/** Build the point style (function or static) for the helper from a LayerConfig. */
function resolvePointStyle(
	L: LeafletNS,
	config: LayerConfig
): HelperPointStyle | ((f: GeoJSON.Feature) => HelperPointStyle) {
	const s = config.styling;
	if (s.mode === 'categorized' && s.categorized) {
		const { property, categories, default: def } = s.categorized;
		return (feature) =>
			toHelperPointStyle(L, pickCategory(feature, property, categories, def)?.point);
	}
	if (s.mode === 'dynamic' && s.styleFn) {
		const fn = s.styleFn;
		return (feature) => toHelperPointStyle(L, fn(feature));
	}
	return toHelperPointStyle(L, s.base?.point);
}

function resolveLineStyle(
	config: LayerConfig
): HelperLineStyle | ((f: GeoJSON.Feature) => HelperLineStyle) {
	const s = config.styling;
	if (s.mode === 'categorized' && s.categorized) {
		const { property, categories, default: def } = s.categorized;
		return (feature) => pickCategory(feature, property, categories, def)?.line ?? {};
	}
	if (s.mode === 'dynamic' && s.styleFn)
		return s.styleFn as (f: GeoJSON.Feature) => HelperLineStyle;
	return s.base?.line ?? {};
}

function resolvePolygonStyle(
	config: LayerConfig
): HelperPolygonStyle | ((f: GeoJSON.Feature) => HelperPolygonStyle) {
	const s = config.styling;
	if (s.mode === 'categorized' && s.categorized) {
		const { property, categories, default: def } = s.categorized;
		return (feature) => pickCategory(feature, property, categories, def)?.polygon ?? {};
	}
	if (s.mode === 'dynamic' && s.styleFn)
		return s.styleFn as (f: GeoJSON.Feature) => HelperPolygonStyle;
	return s.base?.polygon ?? {};
}

let clusterPluginLoaded = false;
/** Lazily load Leaflet.markercluster (side-effect augments the L namespace). */
async function ensureClusterPlugin(): Promise<void> {
	if (clusterPluginLoaded) return;
	await import('leaflet.markercluster');
	await import('leaflet.markercluster/dist/MarkerCluster.css');
	await import('leaflet.markercluster/dist/MarkerCluster.Default.css');
	clusterPluginLoaded = true;
}

const isPoint = (t: string) => t === 'Point' || t === 'MultiPoint';
const isLine = (t: string) => t === 'LineString' || t === 'MultiLineString';

/**
 * Turn a declarative LayerConfig + its (4326) GeoJSON into a Leaflet layer.
 * Supports static / dynamic (styleFn) / categorized styling, SVG divIcon shape
 * markers, popup + tooltip interaction, and opt-in marker clustering.
 */
export async function buildLeafletLayer(
	L: LeafletNS,
	config: LayerConfig,
	data: GeoJSON.FeatureCollection | null
): Promise<Layer> {
	const interaction = config.interaction ?? {};
	const popup = interaction.popup?.enabled
		? resolveTemplate(interaction.popup.template, undefined)
		: undefined;
	const tooltip = interaction.tooltip?.enabled
		? resolveTemplate(interaction.tooltip.template, interaction.tooltip.property)
		: undefined;
	const hover = { enabled: interaction.hover?.enabled === true && interaction.hover?.highlight };
	// A layer with no enabled interaction must not intercept pointer events:
	// Leaflet's default interactive:true would make e.g. a filled context
	// boundary swallow clicks/hovers meant for layers stacked beneath it (the
	// property-capture features under the property boundary).
	const interactive = !!(
		interaction.popup?.enabled ||
		interaction.tooltip?.enabled ||
		interaction.sidePanel?.enabled ||
		interaction.click?.enabled ||
		interaction.hover?.enabled
	);

	let options;
	if (isPoint(config.geometryType)) {
		options = await createPointLayerOptions(resolvePointStyle(L, config) as any, {
			popup: popup as any,
			tooltip: tooltip as any,
			hover
		});
	} else if (isLine(config.geometryType)) {
		options = await createLineLayerOptions(resolveLineStyle(config) as any, {
			popup: popup as any,
			tooltip: tooltip as any,
			hover
		});
	} else {
		options = await createPolygonLayerOptions(resolvePolygonStyle(config) as any, {
			popup: popup as any,
			tooltip: tooltip as any,
			hover
		});
	}

	const geoLayer = L.geoJSON(data ?? EMPTY, { ...options, interactive });
	if (!interactive) {
		// `interactive` in the group options reaches polylines/polygons, but
		// pointToLayer-created markers/circleMarkers don't inherit it. Flipping
		// their options before the layer is added to the map is enough — Leaflet
		// wires up interactivity at add time.
		geoLayer.eachLayer((l: any) => {
			l.options.interactive = false;
		});
	}
	if (config.display?.pane) geoLayer.options.pane = config.display.pane;

	if (config.display?.cluster && isPoint(config.geometryType)) {
		await ensureClusterPlugin();
		const cluster = (L as any).markerClusterGroup();
		cluster.addLayer(geoLayer);
		return cluster as Layer;
	}

	return geoLayer;
}

export type LegendSymbol =
	| { kind: 'point'; point: ConfigPointStyle }
	| { kind: 'line'; line: LineStyle }
	| { kind: 'polygon'; polygon: PolygonStyle };

function firstCategorizedStyle(config: LayerConfig): CategoryStyle | undefined {
	const cat = config.styling.categorized?.categories;
	return cat ? Object.values(cat)[0] : undefined;
}

function dynamicLegendStyle(
	config: LayerConfig
): ReturnType<NonNullable<typeof config.styling.styleFn>> | null {
	if (!config.styling.styleFn) return null;
	return config.styling.styleFn({
		type: 'Feature',
		properties: {},
		geometry: { type: 'Point', coordinates: [0, 0] }
	});
}

export function getLegendSymbol(config: LayerConfig): LegendSymbol {
	const override = config.display?.legendSymbol;
	const firstCategory = firstCategorizedStyle(config);
	const dynamicStyle = config.styling.mode === 'dynamic' ? dynamicLegendStyle(config) : null;

	if (isPoint(config.geometryType)) {
		return {
			kind: 'point',
			point:
				override?.point ??
				firstCategory?.point ??
				(dynamicStyle as ConfigPointStyle | null) ??
				config.styling.base?.point ??
				{}
		};
	}
	if (isLine(config.geometryType)) {
		return {
			kind: 'line',
			line:
				override?.line ??
				firstCategory?.line ??
				(dynamicStyle as LineStyle | null) ??
				config.styling.base?.line ??
				{}
		};
	}
	return {
		kind: 'polygon',
		polygon:
			override?.polygon ??
			firstCategory?.polygon ??
			(dynamicStyle as PolygonStyle | null) ??
			config.styling.base?.polygon ??
			{}
	};
}

/** Best-effort legend swatch colour for a layer, derived from its static style. */
export function legendColor(config: LayerConfig): string {
	const base = config.styling.base ?? {};
	const cat = config.styling.categorized?.categories;
	const firstCat = cat ? Object.values(cat)[0] : undefined;
	return (
		base.polygon?.fillColor ??
		base.point?.fillColor ??
		base.line?.color ??
		base.polygon?.color ??
		firstCat?.point?.fillColor ??
		firstCat?.polygon?.fillColor ??
		'#3388ff'
	);
}
