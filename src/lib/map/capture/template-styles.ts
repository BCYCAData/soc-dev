import type { CircleMarkerOptions, LatLng, Layer, PathOptions } from 'leaflet';

import type { Database } from '$lib/db.types';
import type {
	LineStyle,
	MarkerShape,
	PointStyle,
	PolygonStyle
} from '$lib/map/layers/schemas/layer-config.types';
import type { LegendSymbol } from '$lib/map/render/build-layer';
import { createShapeDivIcon } from '$lib/map/render/markers';

type LeafletNS = typeof import('leaflet');

/**
 * Styling for capture feature templates: a code default derived from the
 * template's (category, geometry_type) deep-merged with an optional admin-set
 * override stored as jsonb on `feature_templates.style` (see migration
 * 20260710000000_feature_template_styles.sql and docs/design/gis-mapping.md).
 *
 * Pure TS with no runtime Leaflet import (Leaflet is passed in), so the module
 * is safe to import from server actions (validation) and the client
 * (rendering, admin preview) alike.
 */

export type FeatureCategory = Database['public']['Enums']['feature_category'];
export type TemplateGeometry = Database['public']['Enums']['geometry_type'];

/** Constrained, whitelisted subsets of the v2 style types — the DB jsonb shape.
 * Only the key matching the template's geometry_type is honoured. */
export interface TemplateStyleOverride {
	point?: Pick<
		PointStyle,
		'fillColor' | 'fillOpacity' | 'color' | 'weight' | 'opacity' | 'radius' | 'shape' | 'size'
	>;
	line?: Pick<LineStyle, 'color' | 'weight' | 'opacity' | 'dashArray'>;
	polygon?: Pick<PolygonStyle, 'fillColor' | 'fillOpacity' | 'color' | 'weight' | 'opacity'>;
}

/** Identical to LegendSymbol by design — the resolver output IS the contract
 * the (future) dynamic legend consumes. */
export type ResolvedTemplateStyle = LegendSymbol;

/** Structural input — satisfied by FeatureTemplate and admin-page template rows.
 * `category` stays `string` and `style` `unknown` so stale or malformed data
 * degrades to defaults instead of crashing; the sanitiser is the gate. */
export interface TemplateStyleSource {
	category: string;
	geometry_type: TemplateGeometry;
	style?: unknown;
}

/** Keyed off the generated DB enum: extending `feature_category` breaks
 * `npm run check` here after a type regen until a colour is assigned. */
export const CATEGORY_COLORS: Record<FeatureCategory, string> = {
	asset: '#2196F3',
	operational: '#4CAF50',
	hazard: '#F44336'
};

export const FALLBACK_COLOR = '#3388ff';

export const MARKER_SHAPES: readonly MarkerShape[] = ['circle', 'square', 'diamond', 'triangle'];

/** Dash presets offered by the admin editor ('' = solid, key omitted). */
export const LINE_DASH_PRESETS = [
	{ label: 'Solid', value: '' },
	{ label: 'Dashed', value: '8 6' },
	{ label: 'Dotted', value: '2 6' }
] as const;

/** Default style per category × geometry — pixel-parity with the original
 * hard-wired `templateLeafletStyle` (weight 3, opacity 0.8, fill 0.4, radius 6). */
export function defaultTemplateStyle(
	category: string,
	geometry: TemplateGeometry
): ResolvedTemplateStyle {
	const c = CATEGORY_COLORS[category as FeatureCategory] ?? FALLBACK_COLOR;
	switch (geometry) {
		case 'point':
			return {
				kind: 'point',
				point: {
					shape: 'circle',
					radius: 6,
					fillColor: c,
					fillOpacity: 0.4,
					color: c,
					weight: 3,
					opacity: 0.8
				}
			};
		case 'line':
			return { kind: 'line', line: { color: c, weight: 3, opacity: 0.8 } };
		case 'polygon':
			return {
				kind: 'polygon',
				polygon: { fillColor: c, fillOpacity: 0.4, color: c, weight: 3, opacity: 0.8 }
			};
	}
}

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const DASH_RE = /^\d+(?: \d+)*$/;

type Validator = (v: unknown) => boolean;
const num =
	(min: number, max: number): Validator =>
	(v) =>
		typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
const hex: Validator = (v) => typeof v === 'string' && HEX_RE.test(v);

const OVERRIDE_KEYS: Record<TemplateGeometry, Record<string, Validator>> = {
	point: {
		fillColor: hex,
		color: hex,
		fillOpacity: num(0, 1),
		opacity: num(0, 1),
		weight: num(0, 10),
		radius: num(2, 20),
		size: num(6, 32),
		shape: (v) => typeof v === 'string' && (MARKER_SHAPES as readonly string[]).includes(v)
	},
	line: {
		color: hex,
		weight: num(1, 10),
		opacity: num(0, 1),
		dashArray: (v) => typeof v === 'string' && DASH_RE.test(v)
	},
	polygon: {
		fillColor: hex,
		color: hex,
		fillOpacity: num(0, 1),
		opacity: num(0, 1),
		weight: num(0, 10)
	}
};

/**
 * Whitelist-validate a raw override against the template's geometry. Shared by
 * the admin action (authoritative, surfaces `errors`) and `resolveTemplateStyle`
 * (defensive, ignores `errors`). Keys under other geometries are dropped
 * silently (stale after a geometry change); unknown/invalid keys within the
 * matching geometry are dropped with an error. Empty result → `null`.
 */
export function sanitizeTemplateStyleOverride(
	raw: unknown,
	geometry: TemplateGeometry
): { override: TemplateStyleOverride | null; errors: string[] } {
	const errors: string[] = [];
	if (raw == null) return { override: null, errors };
	if (typeof raw !== 'object' || Array.isArray(raw)) {
		return { override: null, errors: ['style must be an object'] };
	}
	const block = (raw as Record<string, unknown>)[geometry];
	if (block == null) return { override: null, errors };
	if (typeof block !== 'object' || Array.isArray(block)) {
		return { override: null, errors: [`style.${geometry} must be an object`] };
	}
	const spec = OVERRIDE_KEYS[geometry];
	const clean: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(block as Record<string, unknown>)) {
		const validate = spec[key];
		if (!validate) {
			errors.push(`style.${geometry}.${key} is not an allowed key`);
			continue;
		}
		if (value == null) continue;
		if (!validate(value)) {
			errors.push(`style.${geometry}.${key} has an invalid value`);
			continue;
		}
		clean[key] = value;
	}
	if (Object.keys(clean).length === 0) return { override: null, errors };
	return { override: { [geometry]: clean } as TemplateStyleOverride, errors };
}

/** Code default merged with the (re-sanitised) override, scoped to the
 * template's geometry. Styles are flat objects, so a per-key spread is the
 * whole deep-merge. */
export function resolveTemplateStyle(t: TemplateStyleSource): ResolvedTemplateStyle {
	const def = defaultTemplateStyle(t.category, t.geometry_type);
	const { override } = sanitizeTemplateStyleOverride(t.style, t.geometry_type);
	if (!override) return def;
	switch (def.kind) {
		case 'point':
			return { kind: 'point', point: { ...def.point, ...override.point } };
		case 'line':
			return { kind: 'line', line: { ...def.line, ...override.line } };
		case 'polygon':
			return { kind: 'polygon', polygon: { ...def.polygon, ...override.polygon } };
	}
}

/** Leaflet path options for `L.geoJSON`'s `style:` and circle markers — the
 * schema keys map 1:1 onto PathOptions (shape/size are divIcon concerns). */
export function templateToLeafletOptions(
	resolved: ResolvedTemplateStyle
): PathOptions & { radius?: number } {
	switch (resolved.kind) {
		case 'point': {
			const { shape: _shape, size: _size, ...path } = resolved.point;
			return path;
		}
		case 'line':
			return { ...resolved.line };
		case 'polygon':
			return { ...resolved.polygon };
	}
}

/** `pointToLayer` body: circle → circleMarker; other shapes → SVG divIcon
 * marker (same rendering path as categorized LayerConfig points). */
export function templatePointToLayer(
	L: LeafletNS,
	resolved: ResolvedTemplateStyle,
	latlng: LatLng
): Layer {
	if (resolved.kind === 'point' && resolved.point.shape && resolved.point.shape !== 'circle') {
		const { shape, size, fillColor } = resolved.point;
		return L.marker(latlng, {
			icon: createShapeDivIcon(L, { shape, color: fillColor ?? FALLBACK_COLOR, size: size ?? 12 })
		});
	}
	return L.circleMarker(latlng, templateToLeafletOptions(resolved) as CircleMarkerOptions);
}

/** The dynamic legend's entry point for capture rows (see CaptureLegend.svelte). */
export function templateLegendSymbol(t: TemplateStyleSource): LegendSymbol {
	return resolveTemplateStyle(t);
}

/** Delta between an edited full style and the code default — the admin editor
 * stores only what differs, so un-overridden keys keep tracking future default
 * changes. `null` means "no override" (Reset to default). */
export function diffFromDefault(
	edited: PointStyle | LineStyle | PolygonStyle,
	category: string,
	geometry: TemplateGeometry
): TemplateStyleOverride | null {
	const def = defaultTemplateStyle(category, geometry);
	const defStyle: Record<string, unknown> =
		def.kind === 'point'
			? { ...def.point }
			: def.kind === 'line'
				? { ...def.line }
				: { ...def.polygon };
	const spec = OVERRIDE_KEYS[geometry];
	const delta: Record<string, unknown> = {};
	for (const key of Object.keys(spec)) {
		const value = (edited as Record<string, unknown>)[key];
		if (value == null || value === '') continue;
		if (value !== defStyle[key]) delta[key] = value;
	}
	if (Object.keys(delta).length === 0) return null;
	return { [geometry]: delta } as TemplateStyleOverride;
}
