import type { DivIcon } from 'leaflet';
import type { MarkerShape } from '$lib/map/layers/schemas/layer-config.types';

type LeafletNS = typeof import('leaflet');

/** SVG body generators, matching the v1 `SHAPE_TEMPLATES` geometry so ported
 * layers render identically. Coordinates span a `size`×`size` viewBox. */
const SHAPE_BODY: Record<MarkerShape, (size: number, color: string) => string> = {
	circle: (s, c) => `<circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}" fill="${c}"/>`,
	square: (s, c) => `<rect width="${s}" height="${s}" fill="${c}"/>`,
	diamond: (s, c) =>
		`<polygon points="${s / 2},0 ${s},${s / 2} ${s / 2},${s} 0,${s / 2}" fill="${c}"/>`,
	triangle: (s, c) => `<polygon points="${s / 2},0 ${s},${s} 0,${s}" fill="${c}"/>`
};

export interface ShapeMarkerSpec {
	shape: MarkerShape;
	color: string;
	size?: number;
	className?: string;
}

/**
 * Build a Leaflet divIcon containing an SVG shape filled with `color`, anchored
 * at its centre. Used for categorized point symbology (e.g. KYNG address points
 * styled square/diamond by type).
 */
export function createShapeDivIcon(L: LeafletNS, spec: ShapeMarkerSpec): DivIcon {
	const size = spec.size ?? 10;
	const body = (SHAPE_BODY[spec.shape] ?? SHAPE_BODY.square)(size, spec.color);
	const html = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${body}</svg>`;
	return L.divIcon({
		html,
		className: spec.className ?? 'mapview-shape-marker',
		iconSize: [size, size],
		iconAnchor: [size / 2, size / 2]
	});
}
