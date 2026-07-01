import type { ControlPosition } from 'leaflet';
import type { LayerConfig } from '$lib/map/layers/schemas/layer-config.types';

/**
 * A base (tile) layer definition for a map profile. Kept declarative so a
 * profile can describe its basemaps without importing Leaflet.
 */
export interface BaseLayerDef {
	id: string;
	name: string;
	url: string;
	attribution?: string;
	/** Whether this base layer is shown by default. First visible base wins. */
	visible?: boolean;
	options?: Record<string, unknown>;
}

/**
 * Which native controls a profile mounts, and where. A position string enables
 * the control; `false`/omitted disables it.
 */
export interface ControlPolicy {
	scale?: ControlPosition | false;
	legend?: ControlPosition | false;
	layers?: ControlPosition | false;
	attribution?: boolean;
}

/**
 * A MapProfile expresses one map *purpose* (community view, KYNG, admin, …):
 * its basemaps, default view behaviour and control policy. The concrete data
 * and per-layer styling come from the LayerConfig[] supplied alongside it.
 */
export interface MapProfile {
	id: string;
	label?: string;
	baseLayers: BaseLayerDef[];
	controls: ControlPolicy;
	view?: {
		zoomSnap?: number;
		zoomable?: boolean;
		defaultZoom?: number;
	};
	/**
	 * Attribution for the *data* shown on this map (distinct from basemap-tile
	 * attribution, which lives on each BaseLayerDef). Added to the attribution
	 * control on init. Required by the NSW Spatial Services CC BY 4.0 licence for
	 * any map rendering cached NSW SS geometry.
	 */
	attribution?: string;
	/**
	 * When true, MapView fetches the cached-data currency ("as at" date) and
	 * appends it to `attribution`, satisfying the CC BY data-currency obligation.
	 */
	showDataCurrency?: boolean;
}

/** Runtime view target for a single map render (data-derived, per-request). */
export interface MapViewTarget {
	/** Leaflet bounds: [[south, west], [north, east]]. Takes precedence. */
	extent?: [[number, number], [number, number]] | null;
	center?: [number, number];
	zoom?: number;
}

/**
 * A LayerConfig paired with the GeoJSON it should render. Data is expected to be
 * EPSG:4326 (see gis-mapping-strategy §4.5 — 4326 over the wire, 7844 at rest).
 */
export interface ResolvedLayer {
	config: LayerConfig;
	data: GeoJSON.FeatureCollection | null;
}
