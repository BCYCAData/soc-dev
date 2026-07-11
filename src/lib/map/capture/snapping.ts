/* eslint-disable @typescript-eslint/no-explicit-any -- Leaflet.Editable/GeometryUtil dynamic types */

export interface SnapOptions {
	/** Snap radius, in `toleranceUnit` units. */
	tolerance?: number;
	/** 'px' = constant screen feel at any zoom; 'm' = constant ground distance. */
	toleranceUnit?: 'px' | 'm';
	/** Prefer a target's actual vertex over the nearest edge point when both are in range. */
	preferVertices?: boolean;
}

/**
 * Vertex snapping for Leaflet.Editable drawing/editing, using Leaflet.GeometryUtil
 * (`docs/gis-mapping-strategy.md` — Leaflet.Editable + GeometryUtil). While a vertex is
 * being drawn or dragged, snap it to the closest point on any snap layer within tolerance.
 *
 * `getSnapLayers` and `getSnapOptions` are called per move so the caller can vary the
 * targets and behaviour live (e.g. return `[]` to disable snapping, or exclude the shape
 * currently being edited). GeometryUtil must be loaded (`import 'leaflet-geometryutil'`)
 * before calling this.
 *
 * Returns a disposer that removes the listeners.
 */
export function enableSnapping(
	L: typeof import('leaflet'),
	map: any,
	getSnapLayers: () => any[],
	getSnapOptions: () => SnapOptions = () => ({})
): () => void {
	const GU = (L as any).GeometryUtil;
	if (!GU?.closestLayerSnap) return () => {};

	const snap = (e: any) => {
		if (!e?.latlng) return;
		const layers = getSnapLayers();
		if (!layers.length) return;
		const { tolerance = 12, toleranceUnit = 'px', preferVertices = true } = getSnapOptions();
		// GeometryUtil only understands pixel tolerances, so a metre radius is
		// converted at the cursor per event: project the point, step 1px east,
		// and measure that pixel's ground length (correct for any lat/zoom).
		let tolerancePx = tolerance;
		if (toleranceUnit === 'm') {
			const p = map.latLngToContainerPoint(e.latlng);
			const mPerPx = map.distance(e.latlng, map.containerPointToLatLng(p.add([1, 0])));
			tolerancePx = mPerPx > 0 ? tolerance / mPerPx : tolerance;
		}
		const closest = GU.closestLayerSnap(map, layers, e.latlng, tolerancePx, preferVertices);
		if (closest?.latlng) {
			// Mutate the event latlng in place — Leaflet.Editable reads it back to place the vertex.
			e.latlng.lat = closest.latlng.lat;
			e.latlng.lng = closest.latlng.lng;
			if (e.vertex?.setLatLng) e.vertex.setLatLng(e.latlng);
		}
	};

	map.on('editable:drawing:move', snap);
	map.on('editable:vertex:drag', snap);
	return () => {
		map.off('editable:drawing:move', snap);
		map.off('editable:vertex:drag', snap);
	};
}
