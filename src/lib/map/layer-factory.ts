import type {
	Layer,
	LeafletEvent,
	LeafletEventHandlerFnMap,
	GeoJSONOptions,
	MarkerOptions,
	PolylineOptions,
	TileLayerOptions,
	LatLngBoundsExpression,
	ImageOverlayOptions
} from 'leaflet';

import 'leaflet/dist/leaflet.css';

// ============================================================================
// LEAFLET MODULE LOADING
// ============================================================================

let leaflet: typeof import('leaflet') | null = null;
let esriLeaflet: any = null;
let esriLoaded = false;

/**
 * Load and initialize Leaflet with ESRI plugin support
 */
export async function getLeaflet() {
	if (!leaflet) {
		if (typeof window !== 'undefined') {
			leaflet = await import('leaflet');
			console.log('Leaflet loaded');
		} else {
			throw new Error('Leaflet cannot be loaded in SSR');
		}
	}

	// Load ESRI Leaflet plugin if not already loaded
	if (leaflet && !esriLoaded && typeof window !== 'undefined') {
		try {
			esriLeaflet = await import('esri-leaflet');

			// Attach ESRI to Leaflet namespace
			(leaflet as any).esri = esriLeaflet;

			esriLoaded = true;
			console.log('ESRI Leaflet plugin loaded');
		} catch (error) {
			console.warn('ESRI Leaflet plugin not available:', error);
			// ESRI is optional, continue without it
		}
	}

	return leaflet;
}

/**
 * Check if ESRI plugin is available
 */
export function isEsriAvailable(): boolean {
	return esriLoaded && esriLeaflet !== null;
}

/**
 * Get the ESRI Leaflet module
 */
export function getEsri() {
	if (!isEsriAvailable()) {
		throw new Error('ESRI Leaflet plugin not loaded. Install with: npm install esri-leaflet');
	}
	return esriLeaflet;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type OverlayType = 'geojson' | 'marker' | 'polyline' | 'custom';

export interface OverlayConfig {
	id: string;
	type: OverlayType;
	data?: any;
	options?: any;
	pane?: string;
	events?: Record<string, Function>;
	factory?: (L: any) => Layer; // Factory function for custom layers
}

/**
 * Base layer configuration using factory pattern
 */
export interface BaseLayerConfig {
	id: string;
	label?: string;
	visible: boolean;
	factory: (L: any) => Layer;
}

/**
 * Overlay layer configuration (extends OverlayConfig)
 */
export interface OverlayLayerConfig {
	id: string;
	type: 'geojson' | 'marker' | 'polyline' | 'custom';
	label?: string;
	visible: boolean;
	data?: any;
	options?: any;
	pane?: string;
	events?: Record<string, Function>;
	factory?: (L: any) => Layer;
}

// ============================================================================
// LOW-LEVEL CREATION FUNCTIONS
// ============================================================================

/**
 * Create a tile layer
 */
export async function createTileLayer(url: string, options?: any) {
	const L = await getLeaflet();
	return L.tileLayer(url, options);
}

/**
 * Create overlay layers (marker, geojson, polyline, or custom)
 */
export async function createOverlay(config: OverlayConfig): Promise<Layer | null> {
	const L = await getLeaflet();
	const { type, data, options = {}, pane, events = {}, factory } = config;

	if (pane) {
		(options as any).pane = pane;
	}

	let layer: Layer | null = null;

	// Use factory if provided (for custom/ESRI layers)
	if (type === 'custom' && factory) {
		try {
			layer = factory(L);
			console.log(`Created custom overlay using factory`);
		} catch (error) {
			console.error(`Factory failed for custom overlay:`, error);
			return null;
		}
	} else {
		// Standard overlay types
		switch (type) {
			case 'geojson':
				if (!data) {
					console.warn('GeoJSON overlay requires data');
					return null;
				}
				layer = L.geoJSON(data, options as GeoJSONOptions);
				break;
			case 'marker':
				if (!data) {
					console.warn('Marker overlay requires data');
					return null;
				}
				layer = L.marker(data, options as MarkerOptions);
				break;
			case 'polyline':
				if (!data) {
					console.warn('Polyline overlay requires data');
					return null;
				}
				layer = L.polyline(data, options as PolylineOptions);
				break;
			default:
				console.warn(`Unsupported overlay type: ${type}`);
				return null;
		}
	}

	if (!layer) {
		return null;
	}

	// Bind events with correct typing
	for (const [eventName, handler] of Object.entries(events)) {
		layer.on(eventName as keyof LeafletEventHandlerFnMap, handler as (event: LeafletEvent) => void);
	}

	return layer;
}

/**
 * Create a custom pane for layer z-index management
 */
export async function createPane(map: L.Map, name: string, zIndex: number) {
	if (!map.getPane(name)) {
		map.createPane(name);
		const pane = map.getPane(name);
		if (pane) pane.style.zIndex = String(zIndex);
	}
}

// ============================================================================
// BASE LAYER HELPERS
// ============================================================================

/**
 * Create a standard tile layer (OSM, CartoDB, etc.)
 */
export function tileLayer(
	id: string,
	url: string,
	options?: TileLayerOptions & { label?: string; visible?: boolean }
): BaseLayerConfig {
	return {
		id,
		label: options?.label || id,
		visible: options?.visible ?? false,
		factory: (L) => L.tileLayer(url, options)
	};
}

/**
 * Create a WMS tile layer
 */
export function wmsLayer(
	id: string,
	url: string,
	options?: L.WMSOptions & { label?: string; visible?: boolean }
): BaseLayerConfig {
	return {
		id,
		label: options?.label || id,
		visible: options?.visible ?? false,
		factory: (L) => L.tileLayer.wms(url, options)
	};
}

/**
 * Create an image overlay layer (can be used as base)
 */
export function imageOverlay(
	id: string,
	imageUrl: string,
	bounds: LatLngBoundsExpression,
	options?: ImageOverlayOptions & { label?: string; visible?: boolean }
): BaseLayerConfig {
	return {
		id,
		label: options?.label || id,
		visible: options?.visible ?? false,
		factory: (L) => L.imageOverlay(imageUrl, bounds, options)
	};
}

// ============================================================================
// ESRI BASE LAYER HELPERS
// ============================================================================

/**
 * ESRI Basemap Layer (base layer)
 * Available basemaps: Streets, Topographic, NationalGeographic, Oceans, Gray,
 * DarkGray, Imagery, ImageryClarity, ImageryFirefly, ShadedRelief, Terrain
 */
export function esriBasemap(
	id: string,
	basemap: string,
	options?: { label?: string; visible?: boolean; [key: string]: any }
): BaseLayerConfig {
	return {
		id,
		label: options?.label || id,
		visible: options?.visible ?? false,
		factory: (L) => {
			if (!L.esri) {
				throw new Error('ESRI Leaflet plugin not loaded. Install: npm install esri-leaflet');
			}
			return L.esri.basemapLayer(basemap, options);
		}
	};
}

/**
 * ESRI Tiled Map Layer (can be base or overlay)
 */
export function esriTiledMapLayer(
	id: string,
	url: string,
	options?: { label?: string; visible?: boolean; asBase?: boolean; [key: string]: any }
): BaseLayerConfig | OverlayLayerConfig {
	const factory = (L: any) => {
		if (!L.esri) {
			throw new Error('ESRI Leaflet plugin not loaded');
		}
		return L.esri.tiledMapLayer({ url, ...options });
	};

	if (options?.asBase) {
		return {
			id,
			label: options?.label || id,
			visible: options?.visible ?? false,
			factory
		};
	}

	return {
		id,
		type: 'custom',
		label: options?.label || id,
		visible: options?.visible ?? false,
		factory
	};
}

// ============================================================================
// ESRI OVERLAY LAYER HELPERS
// ============================================================================

/**
 * ESRI Feature Layer (overlay)
 * Vector features from ArcGIS Feature Service
 */
export function esriFeatureLayer(
	id: string,
	url: string,
	options?: {
		label?: string;
		visible?: boolean;
		pane?: string;
		style?: (feature: any) => any;
		onEachFeature?: (feature: any, layer: any) => void;
		where?: string;
		[key: string]: any;
	}
): OverlayLayerConfig {
	return {
		id,
		type: 'custom',
		label: options?.label || id,
		visible: options?.visible ?? false,
		pane: options?.pane,
		factory: (L) => {
			if (!L.esri) {
				throw new Error('ESRI Leaflet plugin not loaded');
			}
			return L.esri.featureLayer({ url, ...options });
		}
	};
}

/**
 * ESRI Dynamic Map Layer (overlay)
 * Multi-layer map service with dynamic rendering
 */
export function esriDynamicMapLayer(
	id: string,
	url: string,
	options?: {
		label?: string;
		visible?: boolean;
		pane?: string;
		opacity?: number;
		layers?: number[];
		[key: string]: any;
	}
): OverlayLayerConfig {
	return {
		id,
		type: 'custom',
		label: options?.label || id,
		visible: options?.visible ?? false,
		pane: options?.pane,
		factory: (L) => {
			if (!L.esri) {
				throw new Error('ESRI Leaflet plugin not loaded');
			}
			return L.esri.dynamicMapLayer({ url, ...options });
		}
	};
}

/**
 * ESRI Image Map Layer (overlay)
 * Raster imagery from ArcGIS Image Service
 */
export function esriImageMapLayer(
	id: string,
	url: string,
	options?: {
		label?: string;
		visible?: boolean;
		pane?: string;
		opacity?: number;
		renderingRule?: any;
		mosaicRule?: any;
		[key: string]: any;
	}
): OverlayLayerConfig {
	return {
		id,
		type: 'custom',
		label: options?.label || id,
		visible: options?.visible ?? false,
		pane: options?.pane,
		factory: (L) => {
			if (!L.esri) {
				throw new Error('ESRI Leaflet plugin not loaded');
			}
			return L.esri.imageMapLayer({ url, ...options });
		}
	};
}

// ============================================================================
// STANDARD OVERLAY HELPERS
// ============================================================================

/**
 * Create a marker overlay
 */
export function marker(
	id: string,
	latlng: [number, number],
	options?: { label?: string; visible?: boolean; pane?: string; [key: string]: any }
): OverlayLayerConfig {
	return {
		id,
		type: 'marker',
		label: options?.label || id,
		visible: options?.visible ?? false,
		data: latlng,
		options,
		pane: options?.pane
	};
}

/**
 * Create a GeoJSON overlay
 */
export function geoJSON(
	id: string,
	data: any,
	options?: { label?: string; visible?: boolean; pane?: string; [key: string]: any }
): OverlayLayerConfig {
	return {
		id,
		type: 'geojson',
		label: options?.label || id,
		visible: options?.visible ?? false,
		data,
		options,
		pane: options?.pane
	};
}

/**
 * Create a polyline overlay
 */
export function polyline(
	id: string,
	latlngs: [number, number][],
	options?: { label?: string; visible?: boolean; pane?: string; [key: string]: any }
): OverlayLayerConfig {
	return {
		id,
		type: 'polyline',
		label: options?.label || id,
		visible: options?.visible ?? false,
		data: latlngs,
		options,
		pane: options?.pane
	};
}

// ============================================================================
// CUSTOM LAYER HELPER
// ============================================================================

/**
 * Create a custom layer using a factory function
 * Use this for any layer type not covered by the helpers above
 */
export function customLayer(
	id: string,
	factory: (L: any) => Layer,
	options: {
		label?: string;
		visible?: boolean;
		pane?: string;
		asBase: true;
	}
): BaseLayerConfig;
export function customLayer(
	id: string,
	factory: (L: any) => Layer,
	options?: {
		label?: string;
		visible?: boolean;
		pane?: string;
		asBase?: false;
	}
): OverlayLayerConfig;
export function customLayer(
	id: string,
	factory: (L: any) => Layer,
	options?: {
		label?: string;
		visible?: boolean;
		pane?: string;
		asBase?: boolean;
	}
): BaseLayerConfig | OverlayLayerConfig {
	if (options?.asBase) {
		return {
			id,
			label: options?.label || id,
			visible: options?.visible ?? false,
			factory
		};
	}

	return {
		id,
		type: 'custom',
		label: options?.label || id,
		visible: options?.visible ?? false,
		factory,
		pane: options?.pane
	};
}
