import type { CategoryStyle, LayerConfig } from '$lib/map/layers/schemas/layer-config.types';
import type { MapProfile } from '$lib/map/profiles/types';
import { NSW_SS_BASEMAP_ATTRIBUTION, NSW_SS_DATA_ATTRIBUTION } from '$lib/map/profiles/attribution';

// NSW Spatial Services street basemap — same base as the community profile.
const NSW_STREETS_URL =
	'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}';

/**
 * Emergency service map profile (admin, read-only). Renders selected
 * properties with their RFS-relevant details and captured feature layers so
 * emergency admins can brief responders. Data comes from
 * `get_rfs_user_map_data_for_porperties` via the service-map route load.
 */
export const emergencyServiceMapProfile: MapProfile = {
	id: 'emergency-service',
	label: 'Emergency Service',
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

const escapeHtml = (value: unknown): string =>
	String(value ?? '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');

type ResidentInfo = {
	name?: string;
	mobile?: string;
	survival_plan?: string;
	plan_to_leave?: string;
};

/** Shared popup for property boundaries and address points. */
const propertyPopup = (feature: GeoJSON.Feature): string => {
	const p = (feature.properties ?? {}) as Record<string, unknown>;
	const residents = (Array.isArray(p.residents) ? p.residents : []) as ResidentInfo[];
	const residentRows = residents
		.map(
			(r) =>
				`<li>${escapeHtml(r.name)} — ${escapeHtml(r.mobile)}<br/><em>${escapeHtml(r.plan_to_leave)}</em></li>`
		)
		.join('');
	return `
		<div style="min-width:220px">
			<strong>${escapeHtml(p.address)}</strong>
			<p style="margin:4px 0">${escapeHtml(p.identification)}</p>
			<p style="margin:4px 0"><strong>Phone:</strong> ${escapeHtml(p.phone || 'Not supplied')}</p>
			<p style="margin:4px 0"><strong>Truck access:</strong> ${escapeHtml(p.truck_access)}</p>
			<p style="margin:4px 0"><strong>Vulnerable residents:</strong> ${escapeHtml(p.vulnerable)}</p>
			${residentRows ? `<p style="margin:4px 0 0"><strong>Residents:</strong></p><ul style="margin:0;padding-left:16px">${residentRows}</ul>` : ''}
		</div>`;
};

/** Selected property boundaries. */
export const emergencyPropertyLayer: LayerConfig = {
	id: 'emergency-properties',
	name: 'Property Boundaries',
	geometryType: 'Polygon',
	category: 'Emergency',
	source: { rpcFunction: 'get_rfs_user_map_data_for_porperties' },
	styling: {
		mode: 'static',
		base: {
			polygon: {
				fillColor: '#dc2626',
				fillOpacity: 0.15,
				color: '#dc2626',
				weight: 2,
				opacity: 0.9
			}
		}
	},
	interaction: {
		popup: { enabled: true, template: propertyPopup, maxWidth: 320 }
	},
	display: { defaultVisible: true }
};

/** Address points for the selected properties. */
export const emergencyAddressPointLayer: LayerConfig = {
	id: 'emergency-address-points',
	name: 'Address Points',
	geometryType: 'Point',
	category: 'Emergency',
	source: { rpcFunction: 'get_rfs_user_map_data_for_porperties' },
	styling: {
		mode: 'static',
		base: {
			point: {
				radius: 6,
				fillColor: '#dc2626',
				color: '#7f1d1d',
				weight: 1,
				fillOpacity: 0.9
			}
		}
	},
	interaction: {
		popup: { enabled: true, template: propertyPopup, maxWidth: 320 }
	},
	display: { defaultVisible: true }
};

/** Responder way points (property access) for the selected properties. */
export const emergencyWayPointLayer: LayerConfig = {
	id: 'emergency-way-points',
	name: 'Way Points',
	geometryType: 'Point',
	category: 'Emergency',
	source: { rpcFunction: 'get_rfs_user_map_data_for_porperties' },
	styling: {
		mode: 'static',
		base: {
			point: {
				radius: 5,
				fillColor: '#2563eb',
				color: '#1e3a8a',
				weight: 1,
				fillOpacity: 0.9
			}
		}
	},
	interaction: {
		tooltip: { enabled: true, property: 'address' }
	},
	display: { defaultVisible: true }
};

const FEATURE_LAYER_STYLES: Record<'Point' | 'LineString' | 'Polygon', CategoryStyle> = {
	Point: {
		point: { radius: 5, fillColor: '#9333ea', color: '#581c87', weight: 1, fillOpacity: 0.85 }
	},
	LineString: {
		line: { color: '#0891b2', weight: 3, opacity: 0.9 }
	},
	Polygon: {
		polygon: { fillColor: '#ca8a04', fillOpacity: 0.25, color: '#a16207', weight: 2, opacity: 0.9 }
	}
};

const featurePopup = (feature: GeoJSON.Feature): string => {
	const p = (feature.properties ?? {}) as Record<string, unknown>;
	const attributes = (p.attributes ?? {}) as Record<string, unknown>;
	const rows = Object.entries(attributes)
		.map(([k, v]) => `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</li>`)
		.join('');
	return `
		<div style="min-width:180px">
			<strong>${escapeHtml(p.name || 'Feature')}</strong>
			${rows ? `<ul style="margin:4px 0 0;padding-left:16px">${rows}</ul>` : ''}
		</div>`;
};

/**
 * Layer config for one captured-feature group. `key` is the
 * `<category>_<geometryType>` grouping produced by the RPC.
 */
export function emergencyFeatureLayer(
	key: string,
	category: string,
	geometryType: 'Point' | 'LineString' | 'Polygon'
): LayerConfig {
	return {
		id: `emergency-features-${key.toLowerCase().replaceAll(' ', '-')}`,
		name: `${category} (${geometryType === 'LineString' ? 'lines' : geometryType.toLowerCase() + 's'})`,
		geometryType,
		category: 'Property Features',
		source: { rpcFunction: 'get_rfs_user_map_data_for_porperties' },
		styling: {
			mode: 'static',
			base: FEATURE_LAYER_STYLES[geometryType]
		},
		interaction: {
			popup: { enabled: true, template: featurePopup, maxWidth: 280 }
		},
		display: { defaultVisible: true }
	};
}
