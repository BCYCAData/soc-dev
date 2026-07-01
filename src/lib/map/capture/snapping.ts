/* eslint-disable @typescript-eslint/no-explicit-any -- Leaflet.Editable/GeometryUtil dynamic types */

/**
 * Vertex snapping for Leaflet.Editable drawing/editing, using Leaflet.GeometryUtil
 * (`docs/gis-mapping-strategy.md` — Leaflet.Editable + GeometryUtil). While a vertex is
 * being drawn or dragged, snap it to the closest point on any snap layer within `tolerancePx`.
 *
 * `getSnapLayers` is called per move so the caller can vary the targets (e.g. return `[]`
 * to disable snapping, or exclude the shape currently being edited). GeometryUtil must be
 * loaded (`import 'leaflet-geometryutil'`) before calling this.
 *
 * Returns a disposer that removes the listeners.
 */
export function enableSnapping(
	L: typeof import('leaflet'),
	map: any,
	getSnapLayers: () => any[],
	tolerancePx = 12
): () => void {
	const GU = (L as any).GeometryUtil;
	if (!GU?.closestLayerSnap) return () => {};

	const snap = (e: any) => {
		if (!e?.latlng) return;
		const layers = getSnapLayers();
		if (!layers.length) return;
		const closest = GU.closestLayerSnap(map, layers, e.latlng, tolerancePx, true);
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
