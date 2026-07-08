import type { LayerConfig } from '$lib/map/layers/schemas/layer-config.types';
import type { MapProfile } from '$lib/map/profiles/types';
import { NSW_SS_BASEMAP_ATTRIBUTION, NSW_SS_DATA_ATTRIBUTION } from '$lib/map/profiles/attribution';

const NSW_STREETS_URL =
	'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}';
const NSW_AERIAL_URL =
	'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}';

/**
 * Site-overview profile (read-only): NSW streets base, scale + layers controls, no
 * legend, fixed (non-zoomable) view fitted to an extent. Mirrors the v1 `aboutMapConfig`
 * / `kyngAreasMapConfig` — used by the public About project map and the admin
 * KYNG-boundaries map.
 */
export const siteStreetsProfile: MapProfile = {
	id: 'site-streets',
	label: 'Site',
	baseLayers: [
		{
			id: 'nsw-streets',
			name: 'NSW Streets',
			url: NSW_STREETS_URL,
			attribution: NSW_SS_BASEMAP_ATTRIBUTION,
			visible: true
		}
	],
	controls: { scale: 'bottomleft', legend: false, layers: 'topright', attribution: true },
	attribution: NSW_SS_DATA_ATTRIBUTION,
	showDataCurrency: true,
	view: { zoomSnap: 0.25, zoomable: false }
};

/** Project boundary polygon for the admin KYNG-boundaries map (data from get_site_boundary). */
export const siteBoundaryLayer: LayerConfig = {
	id: 'site-boundary',
	name: 'Project Boundary',
	geometryType: 'Polygon',
	category: 'Site',
	source: { rpcFunction: 'get_site_boundary' },
	styling: {
		mode: 'static',
		base: {
			polygon: { fillColor: '#3388ff', fillOpacity: 0.15, color: '#000', weight: 1.5, opacity: 1 }
		}
	},
	interaction: {},
	display: { defaultVisible: true }
};

/**
 * Admin address-data profile: multiple basemaps (streets/aerial/OSM/satellite),
 * zoomable, scale + layers controls. Mirrors the v1 `customAddressesMapConfig`
 * (`allBaseLayers`). Live ArcGIS + Geoscape GNAF layers are mounted as MapView
 * children (see `lib/map/layers/live/`), not declarative LayerConfigs.
 */
export const addressMapProfile: MapProfile = {
	id: 'admin-addresses',
	label: 'Addresses',
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
		},
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
