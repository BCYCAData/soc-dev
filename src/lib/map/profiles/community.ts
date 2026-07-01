import type { LayerConfig } from '$lib/map/layers/schemas/layer-config.types';
import type { MapProfile } from '$lib/map/profiles/types';
import { NSW_SS_BASEMAP_ATTRIBUTION, NSW_SS_DATA_ATTRIBUTION } from '$lib/map/profiles/attribution';

// NSW Spatial Services street basemap — matches the v1 `streetBaseLayer`.
const NSW_STREETS_URL =
	'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}';

/**
 * Community visualisation profile (read-only). Used by every
 * personal-profile/my-community/{community}/map route. Reproduces the v1
 * `myCommunity*MapConfig`: NSW streets base, scale + legend + layers controls.
 */
export const communityMapProfile: MapProfile = {
	id: 'community',
	label: 'Community',
	baseLayers: [
		{
			id: 'nsw-streets',
			name: 'NSW Streets',
			url: NSW_STREETS_URL,
			attribution: NSW_SS_BASEMAP_ATTRIBUTION,
			visible: true
		}
	],
	controls: {
		scale: 'bottomleft',
		legend: 'bottomright',
		layers: 'topright',
		attribution: true
	},
	attribution: NSW_SS_DATA_ATTRIBUTION,
	showDataCurrency: true,
	view: {
		zoomSnap: 0.25,
		zoomable: true
	}
};

// ── Layer configs (data supplied per-route from get_community_data) ──
// Styling mirrors the v1 symbology in $lib/leaflet/mapconfig.ts for parity.

/** Community boundary polygon — v1 `communityFillOptions`. */
export const communityAreaLayer: LayerConfig = {
	id: 'community-area',
	name: 'Community Area',
	geometryType: 'Polygon',
	category: 'Community',
	source: { rpcFunction: 'get_community_data' },
	styling: {
		mode: 'static',
		base: {
			polygon: {
				fillColor: '#3388ff',
				fillOpacity: 0.3,
				color: '#000',
				weight: 1,
				opacity: 1
			}
		}
	},
	interaction: {},
	display: { defaultVisible: true }
};

/** All project address points — v1 `projectAddresspointsOptions` (grey). */
export const projectAddressPointsLayer: LayerConfig = {
	id: 'project-address-points',
	name: 'Project Address Points',
	geometryType: 'Point',
	category: 'Community',
	source: { rpcFunction: 'get_community_data' },
	styling: {
		mode: 'static',
		base: {
			point: {
				radius: 3,
				fillColor: '#a5a5a5',
				weight: 0,
				fillOpacity: 0.8
			}
		}
	},
	interaction: {},
	// Dense layer (~520 points) — cluster for performance/readability.
	display: { defaultVisible: true, cluster: true }
};

/** Registered address points — v1 `registeredAddresspointsOptions` (orange). */
export const registeredAddressPointsLayer: LayerConfig = {
	id: 'registered-address-points',
	name: 'Registered Address Points',
	geometryType: 'Point',
	category: 'Community',
	source: { rpcFunction: 'get_community_data' },
	styling: {
		mode: 'static',
		base: {
			point: {
				radius: 4,
				fillColor: '#f97316',
				weight: 0,
				fillOpacity: 0.8
			}
		}
	},
	interaction: {},
	display: { defaultVisible: true }
};

/** Ordered layer set for a community map (rendered bottom → top). */
export const communityLayers = [
	communityAreaLayer,
	projectAddressPointsLayer,
	registeredAddressPointsLayer
];
