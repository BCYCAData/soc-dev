import type { LayerConfig } from '$lib/map/layers/schemas/layer-config.types';
import type { MapProfile } from '$lib/map/profiles/types';
import { NSW_SS_BASEMAP_ATTRIBUTION, NSW_SS_DATA_ATTRIBUTION } from '$lib/map/profiles/attribution';
import { escapeHtml } from '$lib/map/render/template-utils';
import { generateUniqueColorForKey } from '$lib/map/render/color';

const NSW_AERIAL_URL =
	'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}';
const NSW_STREETS_URL =
	'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}';

/**
 * KYNG coordinator map profile — aerial (default) + street basemaps, mirroring
 * the v1 `streetAerialBaseLayer` + `kyngCoordinatorKyngAreaMapConfig`.
 */
export const kyngMapProfile: MapProfile = {
	id: 'kyng',
	label: 'KYNG Coordinator',
	baseLayers: [
		{
			id: 'nsw-aerial',
			name: 'Air Photo',
			url: NSW_AERIAL_URL,
			attribution: NSW_SS_BASEMAP_ATTRIBUTION,
			visible: true
		},
		{
			id: 'nsw-streets',
			name: 'Streets',
			url: NSW_STREETS_URL,
			attribution: NSW_SS_BASEMAP_ATTRIBUTION
		}
	],
	controls: { scale: 'bottomleft', legend: 'bottomright', layers: 'topright', attribution: true },
	attribution: NSW_SS_DATA_ATTRIBUTION,
	showDataCurrency: true,
	view: { zoomSnap: 0.25, zoomable: true, defaultZoom: 13 }
};

// ── Layer configs (data supplied from get_kyngs_geojson) ──
// Styling mirrors the v1 kyng* symbology in $lib/leaflet/mapconfig.ts.

/** KYNG area boundary — transparent fill, magenta outline (v1 kyngAreaGeoJsonOptions). */
export const kyngAreaLayer: LayerConfig = {
	id: 'kyng-area',
	name: 'KYNG Area',
	geometryType: 'Polygon',
	category: 'KYNG',
	source: { rpcFunction: 'get_kyngs_geojson' },
	styling: {
		mode: 'static',
		base: { polygon: { fillColor: 'transparent', fillOpacity: 0, weight: 5, color: 'magenta' } }
	},
	interaction: {},
	display: { defaultVisible: true }
};

/** Property areas — unique fill colour per Principal Address Site OID
 * (v1 getPropertyAreaStyle + kyngPropertyAreasGeoJsonOptions). */
export const kyngPropertyAreasLayer: LayerConfig = {
	id: 'kyng-property-areas',
	name: 'Property Areas',
	geometryType: 'Polygon',
	category: 'KYNG',
	source: { rpcFunction: 'get_kyngs_geojson' },
	styling: {
		mode: 'dynamic',
		styleFn: (feature) => ({
			fillColor: generateUniqueColorForKey(
				feature.properties?.['Principal Address Site OID']?.toString() ?? 'default',
				[]
			),
			fillOpacity: 0.3,
			weight: 1,
			color: 'black'
		})
	},
	interaction: {},
	display: { defaultVisible: true }
};

/** Proway lines — steelblue (v1 kyngProwayGeoJsonOptions, width→weight). */
export const kyngProwayLinesLayer: LayerConfig = {
	id: 'kyng-proway-lines',
	name: 'Proway Lines',
	geometryType: 'LineString',
	category: 'KYNG',
	source: { rpcFunction: 'get_kyngs_geojson' },
	styling: {
		mode: 'static',
		base: { line: { color: 'steelblue', weight: 1, lineCap: 'round', lineJoin: 'round' } }
	},
	interaction: {},
	display: { defaultVisible: false }
};

/** Way points — red circle markers (v1 kyngWayPointsGeoJsonOptions). */
export const kyngWayPointsLayer: LayerConfig = {
	id: 'kyng-way-points',
	name: 'Way Points',
	geometryType: 'Point',
	category: 'KYNG',
	source: { rpcFunction: 'get_kyngs_geojson' },
	styling: {
		mode: 'static',
		base: { point: { radius: 3, fillColor: 'red', color: 'black', weight: 1, fillOpacity: 1 } }
	},
	interaction: {},
	display: { defaultVisible: false }
};

/** Address points — grouped divIcon shapes by Address Point Type
 * (v1 kyngAddresspointsGeoJsonOptions): Property=blue square, Building=green
 * diamond, Default/other=black diamond. */
export const kyngAddressPointsLayer: LayerConfig = {
	id: 'kyng-address-points',
	name: 'Address Points',
	geometryType: 'Point',
	category: 'KYNG',
	source: { rpcFunction: 'get_kyngs_geojson' },
	styling: {
		mode: 'categorized',
		categorized: {
			property: 'Address Point Type',
			categories: {
				Property: {
					point: { shape: 'square', fillColor: 'blue', size: 9 },
					label: 'Property Address'
				},
				Building: {
					point: { shape: 'diamond', fillColor: 'green', size: 8 },
					label: 'Building Address'
				},
				Default: { point: { shape: 'diamond', fillColor: 'black', size: 10 }, label: 'Address' }
			},
			// v1 falls back to the first group (Property) for unknown values.
			default: { point: { shape: 'square', fillColor: 'blue', size: 9 } }
		}
	},
	interaction: {
		tooltip: {
			enabled: true,
			template: (feature) => {
				const p = feature.properties ?? {};
				// Values come from cached NSW SS data — escape before interpolating into
				// tooltip HTML (XSS defense-in-depth).
				return `
					<strong>${escapeHtml(p['Address'] ?? '')}</strong><br>
					<i>Type: </i> ${escapeHtml(p['Address Type'] ?? 'N/A')}<br>
					<i>Principal Address Type: </i> ${escapeHtml(p['Principal Address Type'] ?? 'N/A')}<br>
					<i>Address Point Type: </i> ${escapeHtml(p['Address Point Type'] ?? 'N/A')}
				`;
			}
		}
	},
	display: { defaultVisible: true }
};

/** Ordered layer set for a KYNG map (polygons → lines → points, top-most last). */
export const kyngLayers = [
	kyngAreaLayer,
	kyngPropertyAreasLayer,
	kyngProwayLinesLayer,
	kyngWayPointsLayer,
	kyngAddressPointsLayer
];
