import type { LayerConfig } from '$lib/map/layers/schemas/layer-config.types';
import type { MapProfile } from '$lib/map/profiles/types';
import { NSW_SS_BASEMAP_ATTRIBUTION, NSW_SS_DATA_ATTRIBUTION } from '$lib/map/profiles/attribution';

const NSW_STREETS_URL =
	'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}';
const NSW_AERIAL_URL =
	'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}';

/**
 * Property data-capture profile — mirrors v1 `myPropertyMapConfig` (multiple
 * basemaps, no legend; editing UI is supplied by PropertyCaptureController).
 */
export const propertyCaptureProfile: MapProfile = {
	id: 'property-capture',
	label: 'Property Capture',
	baseLayers: [
		{ id: 'nsw-streets', name: 'NSW Streets', url: NSW_STREETS_URL, attribution: NSW_SS_BASEMAP_ATTRIBUTION, visible: true },
		{ id: 'nsw-aerial', name: 'NSW Aerial', url: NSW_AERIAL_URL, attribution: NSW_SS_BASEMAP_ATTRIBUTION },
		{
			id: 'osm',
			name: 'OpenStreetMap',
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			attribution: '© OpenStreetMap contributors'
		},
		{
			id: 'satellite',
			name: 'Satellite',
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			attribution: 'Esri, Maxar, Earthstar Geographics, and the GIS User Community'
		}
	],
	controls: { scale: 'bottomleft', legend: false, layers: 'topright', attribution: true },
	attribution: NSW_SS_DATA_ATTRIBUTION,
	showDataCurrency: true,
	view: { zoomSnap: 0.25, zoomable: true }
};

// ── Read-only context layers (data from get_property_geometry) ──

/** Property boundary — v1 `propertyOptions` (translucent yellow). */
export const propertyBoundaryLayer: LayerConfig = {
	id: 'property-boundary',
	name: 'Property Boundary',
	geometryType: 'Polygon',
	category: 'Context',
	source: { rpcFunction: 'get_property_geometry' },
	styling: {
		mode: 'static',
		base: { polygon: { fillColor: '#eee908', fillOpacity: 0.2, color: '#000', weight: 1, opacity: 1 } }
	},
	interaction: {},
	display: { defaultVisible: true }
};

/** Address point — v1 `addresspointOptions` (orange diamond). */
export const addressPointLayer: LayerConfig = {
	id: 'address-point',
	name: 'Address Point',
	geometryType: 'Point',
	category: 'Context',
	source: { rpcFunction: 'get_property_geometry' },
	styling: { mode: 'static', base: { point: { shape: 'diamond', fillColor: '#f97316', size: 12 } } },
	interaction: {},
	display: { defaultVisible: true }
};

/** Way point — v1 `waypointOptions` (grey diamond). */
export const wayPointLayer: LayerConfig = {
	id: 'way-point',
	name: 'Way Point',
	geometryType: 'Point',
	category: 'Context',
	source: { rpcFunction: 'get_property_geometry' },
	styling: { mode: 'static', base: { point: { shape: 'diamond', fillColor: '#a5a5a5', size: 12 } } },
	interaction: {},
	display: { defaultVisible: true }
};

// ── Feature category styling (asset / operational / hazard) ──
// Colours from v1 `featureStyles` in $lib/leaflet/mapconfig.ts.

export type TemplateCategory = 'asset' | 'operational' | 'hazard';

export const CATEGORY_COLORS: Record<TemplateCategory, string> = {
	asset: '#2196F3',
	operational: '#4CAF50',
	hazard: '#F44336'
};

/** Leaflet path/point options for a captured feature, coloured by its template category. */
export function templateLeafletStyle(category: string) {
	const color = CATEGORY_COLORS[category as TemplateCategory] ?? '#3388ff';
	return {
		color,
		weight: 3,
		opacity: 0.8,
		fillColor: color,
		fillOpacity: 0.4,
		radius: 6
	};
}
