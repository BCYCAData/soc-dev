import type { LayerConfig } from '$lib/map/layers/schemas/layer-config.types';
import type { MapProfile } from '$lib/map/profiles/types';
import { NSW_SS_BASEMAP_ATTRIBUTION, NSW_SS_DATA_ATTRIBUTION } from '$lib/map/profiles/attribution';

const NSW_STREETS_URL =
	'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}';
const NSW_AERIAL_URL =
	'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}';

/**
 * Admin KYNG boundary-editor profile: zoomable streets (default) + aerial
 * basemaps, scale + layers controls. The cadastral fabric, drawn control lines
 * and proposal previews are mounted imperatively by
 * KyngBoundaryEditorController (lib/map/kyng-editor/), not as LayerConfigs.
 */
export const kyngBoundaryEditorProfile: MapProfile = {
	id: 'kyng-boundary-editor',
	label: 'KYNG Boundaries',
	baseLayers: [
		{
			id: 'nsw-streets',
			name: 'NSW Streets',
			url: NSW_STREETS_URL,
			attribution: NSW_SS_BASEMAP_ATTRIBUTION,
			visible: true
		},
		{
			id: 'nsw-aerial',
			name: 'NSW Aerial',
			url: NSW_AERIAL_URL,
			attribution: NSW_SS_BASEMAP_ATTRIBUTION
		}
	],
	controls: { scale: 'bottomleft', legend: false, layers: 'topright', attribution: true },
	attribution: NSW_SS_DATA_ATTRIBUTION,
	showDataCurrency: true,
	view: { zoomSnap: 0.25, zoomable: true }
};

/** Current KYNG boundaries (data from get_kyng_boundaries_geojson). */
export const kyngBoundariesLayer: LayerConfig = {
	id: 'kyng-boundaries',
	name: 'KYNG Boundaries',
	geometryType: 'MultiPolygon',
	category: 'KYNG',
	source: { rpcFunction: 'get_kyng_boundaries_geojson' },
	styling: {
		mode: 'static',
		base: {
			polygon: { fillColor: 'transparent', fillOpacity: 0, color: 'magenta', weight: 2.5 }
		}
	},
	interaction: {
		tooltip: { enabled: true, property: 'kyng' }
	},
	display: { defaultVisible: true }
};
