import type * as L from 'leaflet';
import type { Map as LeafletMap } from 'leaflet';
import type { Writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

// ============================================================================
// LAYER DESCRIPTORS & METADATA
// ============================================================================

/**
 * A record for any registered layer in the map registry
 * Used by the legacy system (Map.svelte)
 */
export interface MapLayerDescriptor {
	id: string;
	name?: string;
	group?: string;
	type?: 'tile' | 'geojson' | 'arcgis' | string;
	visible?: boolean;
	opacity?: number;
	zIndex?: number;
	leafletLayer?: L.Layer; // any Leaflet layer
}

/**
 * Layer metadata for the context-based system
 * Used by NewMap component
 */
export interface LayerMeta {
	id: string;
	label?: string;
	type: 'base' | 'overlay';
	pane?: string;
	visible: boolean;
	instance?: L.Layer;
	events?: Record<string, Function>;
	color?: string;
	category?: string;
}

/** The collection of layers stored in Map.svelte */
export type MapLayerRegistry = Record<string, MapLayerDescriptor>;

// ============================================================================
// TYPE PREDICATES
// ============================================================================

/**
 * Type predicate for layers supporting setOpacity
 */
export function hasSetOpacity(
	layer: L.Layer
): layer is L.Layer & { setOpacity: (opacity: number) => L.Layer } {
	return 'setOpacity' in layer && typeof layer.setOpacity === 'function';
}

/**
 * Type predicate for layers supporting setZIndex
 */
export function hasSetZIndex(
	layer: L.Layer
): layer is L.Layer & { setZIndex: (zIndex: number) => L.Layer } {
	return 'setZIndex' in layer && typeof layer.setZIndex === 'function';
}

// ============================================================================
// MAP CONTEXT (for Svelte context-based architecture)
// ============================================================================

export interface MapContext {
	getMap: () => LeafletMap | null;
	registry: Writable<Record<string, LayerMeta>>;
	registerLayer: (layer: LayerMeta) => void;
	unregisterLayer: (id: string) => void;
	updateLayer: (id: string, patch: Partial<LayerMeta>) => void;
	setLayerInstance: (id: string, instance: L.Layer) => void;
}

export const MAP_CONTEXT_KEY = Symbol('MapContext');

export function setMapContext(ctx: MapContext) {
	setContext<MapContext>(MAP_CONTEXT_KEY, ctx);
}

export function getMapContext(): MapContext {
	const ctx = getContext<MapContext>(MAP_CONTEXT_KEY);
	if (!ctx) throw new Error('getMapContext() called outside of a <NewMap> context.');
	return ctx;
}
