import type { OverlayLayerConfig } from './layer-factory';
import {
	createPointLayerOptions,
	createLineLayerOptions,
	createPolygonLayerOptions,
	type PointStyle,
	type LineStyle,
	type PolygonStyle,
	type HoverConfig
} from './geojson-helpers';
import type { SymbologyPreset } from './symbology-presets';

// ============================================================================
// ENHANCED GEOJSON OVERLAY HELPERS WITH SYMBOLOGY SUPPORT
// ============================================================================

/**
 * Configuration for GeoJSON point layers with symbology support
 */
export interface PointLayerConfig {
	id: string;
	data: GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.MultiPoint>;
	
	// Symbology options (mutually exclusive priority: preset > style > defaults)
	preset?: SymbologyPreset;
	style?: PointStyle | ((feature: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>) => PointStyle);
	hover?: HoverConfig<PointStyle>;
	
	// Interaction callbacks
	tooltip?: (feature: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>) => string;
	popup?: (feature: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>) => string;
	onclick?: (feature: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>, latlng: L.LatLngExpression) => void;
	
	// Layer metadata
	label?: string;
	visible?: boolean;
	pane?: string;
}

/**
 * Configuration for GeoJSON line layers with symbology support
 */
export interface LineLayerConfig {
	id: string;
	data: GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString>;
	
	preset?: SymbologyPreset;
	style?: LineStyle | ((feature: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>) => LineStyle);
	hover?: HoverConfig<LineStyle>;
	
	tooltip?: (feature: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>) => string;
	popup?: (feature: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>) => string;
	onclick?: (feature: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>, latlng: L.LatLngExpression) => void;
	
	label?: string;
	visible?: boolean;
	pane?: string;
}

/**
 * Configuration for GeoJSON polygon layers with symbology support
 */
export interface PolygonLayerConfig {
	id: string;
	data: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
	
	preset?: SymbologyPreset;
	style?: PolygonStyle | ((feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>) => PolygonStyle);
	hover?: HoverConfig<PolygonStyle>;
	
	tooltip?: (feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>) => string;
	popup?: (feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>) => string;
	onclick?: (feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>, latlng: L.LatLngExpression) => void;
	
	label?: string;
	visible?: boolean;
	pane?: string;
}

// ============================================================================
// ENHANCED FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a GeoJSON point layer with symbology support
 * Returns an OverlayLayerConfig that can be used with OverlayLayerGroup
 * 
 * @example
 * // With preset
 * const layer = await pointGeoJSON({
 *   id: 'hospitals',
 *   data: hospitalData,
 *   preset: symbologyPresets.criticalInfrastructure,
 *   tooltip: (f) => f.properties.name
 * });
 * 
 * // With custom style
 * const layer = await pointGeoJSON({
 *   id: 'sensors',
 *   data: sensorData,
 *   style: { color: 'red', radius: 8 },
 *   popup: (f) => `<h3>${f.properties.name}</h3>`
 * });
 * 
 * // With dynamic style function
 * const layer = await pointGeoJSON({
 *   id: 'markers',
 *   data: markerData,
 *   style: (feature) => ({
 *     color: feature.properties.active ? 'green' : 'gray',
 *     radius: feature.properties.size
 *   })
 * });
 */
export async function pointGeoJSON(config: PointLayerConfig): Promise<OverlayLayerConfig> {
	const { id, data, preset, style, hover, tooltip, popup, onclick, label, visible, pane } = config;
	
	// Determine final style: preset takes priority
	const finalStyle = preset?.point || style || {};
	
	// Create GeoJSON options using the helper
	const options = await createPointLayerOptions(finalStyle, {
		tooltip,
		popup,
		onClick: onclick,
		hover
	});
	
	return {
		id,
		type: 'geojson',
		label: label || id,
		visible: visible ?? true,
		data,
		options,
		pane
	};
}

/**
 * Create a GeoJSON line layer with symbology support
 * Returns an OverlayLayerConfig that can be used with OverlayLayerGroup
 * 
 * @example
 * const roadLayer = await lineGeoJSON({
 *   id: 'roads',
 *   data: roadData,
 *   preset: symbologyPresets.transportation,
 *   tooltip: (f) => f.properties.name,
 *   hover: { style: { weight: 6 } }
 * });
 */
export async function lineGeoJSON(config: LineLayerConfig): Promise<OverlayLayerConfig> {
	const { id, data, preset, style, hover, tooltip, popup, onclick, label, visible, pane } = config;
	
	const finalStyle = preset?.line || style || {};
	
	const options = await createLineLayerOptions(finalStyle, {
		tooltip,
		popup,
		onClick: onclick,
		hover
	});
	
	return {
		id,
		type: 'geojson',
		label: label || id,
		visible: visible ?? true,
		data,
		options,
		pane
	};
}

/**
 * Create a GeoJSON polygon layer with symbology support
 * Returns an OverlayLayerConfig that can be used with OverlayLayerGroup
 * 
 * @example
 * const zoneLayer = await polygonGeoJSON({
 *   id: 'zones',
 *   data: zoneData,
 *   style: {
 *     fillColor: '#3b82f6',
 *     fillOpacity: 0.2,
 *     color: '#1e40af',
 *     weight: 2
 *   },
 *   popup: (f) => `<h3>${f.properties.name}</h3>`
 * });
 */
export async function polygonGeoJSON(config: PolygonLayerConfig): Promise<OverlayLayerConfig> {
	const { id, data, preset, style, hover, tooltip, popup, onclick, label, visible, pane } = config;
	
	const finalStyle = preset?.polygon || style || {};
	
	const options = await createPolygonLayerOptions(finalStyle, {
		tooltip,
		popup,
		onClick: onclick,
		hover
	});
	
	return {
		id,
		type: 'geojson',
		label: label || id,
		visible: visible ?? true,
		data,
		options,
		pane
	};
}

// ============================================================================
// AUTOMATIC GEOMETRY DETECTION (CONVENIENCE)
// ============================================================================

/**
 * Automatically detect geometry type and create appropriate layer
 * Useful when you don't know the geometry type in advance
 * 
 * @example
 * const layer = await autoGeoJSON({
 *   id: 'mixed-data',
 *   data: mixedGeometryData,
 *   preset: symbologyPresets.naturalFeatures
 * });
 */
export async function autoGeoJSON(
	config: PointLayerConfig | LineLayerConfig | PolygonLayerConfig
): Promise<OverlayLayerConfig> {
	const { data } = config;
	
	// Check first feature to determine geometry type
	if (!data.features || data.features.length === 0) {
		throw new Error('GeoJSON data has no features');
	}
	
	const firstGeometry = data.features[0].geometry;
	const geometryType = firstGeometry.type;
	
	switch (geometryType) {
		case 'Point':
		case 'MultiPoint':
			return pointGeoJSON(config as PointLayerConfig);
		
		case 'LineString':
		case 'MultiLineString':
			return lineGeoJSON(config as LineLayerConfig);
		
		case 'Polygon':
		case 'MultiPolygon':
			return polygonGeoJSON(config as PolygonLayerConfig);
		
		default:
			throw new Error(`Unsupported geometry type: ${geometryType}`);
	}
}

// ============================================================================
// BACKWARD COMPATIBILITY WRAPPER
// ============================================================================

/**
 * Enhanced geoJSON helper that maintains backward compatibility
 * but adds symbology support
 * 
 * This can be used as a drop-in replacement for the original geoJSON() function
 * 
 * @example
 * // Old way (still works)
 * const layer = geoJSONEnhanced('id', data, { 
 *   label: 'My Layer',
 *   ...await createPointLayerOptions({ color: 'red' })
 * });
 * 
 * // New way (more ergonomic)
 * const layer = await geoJSONEnhanced('id', data, {
 *   label: 'My Layer',
 *   preset: symbologyPresets.criticalInfrastructure,
 *   tooltip: (f) => f.properties.name
 * });
 */
export function geoJSONEnhanced(
	id: string,
	data: any,
	options?: {
		label?: string;
		visible?: boolean;
		pane?: string;
		
		// New symbology options
		preset?: SymbologyPreset;
		style?: PointStyle | LineStyle | PolygonStyle | ((feature: any) => any);
		hover?: HoverConfig<any>;
		tooltip?: (feature: any) => string;
		popup?: (feature: any) => string;
		onclick?: (feature: any, latlng: any) => void;
		
		// Allows passing through raw GeoJSONOptions (backward compatibility)
		[key: string]: any;
	}
): OverlayLayerConfig {
	// If preset or style is provided, we'll need to create options async
	// For now, return a config that will be processed by OverlayLayerGroup
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
