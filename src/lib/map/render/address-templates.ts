/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic GeoJSON property bags */
import { escapeHtml } from '$lib/map/render/template-utils';

/**
 * Popup/tooltip templates for the admin address-data map (NSW GURAS property theme +
 * Geoscape GNAF address points). Ported from v1 `leafletdatatemplates.ts` for the v2
 * stack (Phase 6). All interpolated values are HTML-escaped — feature properties come
 * from external services (XSS).
 */

const propertyTypeLookup: Record<number, string> = {
	1: 'Property',
	2: 'Crown',
	3: 'National Park',
	4: 'State Forest',
	5: 'Other',
	6: 'Incomplete'
};

const addressTypeLookup: Record<number, string> = {
	1: 'Primary',
	2: 'Secondary',
	3: 'Alternate'
};

/** NSW GURAS property-theme feature popup. */
export function gurasPropertyPopUpTemplate(p: any): string {
	const propertyTypeLabel = propertyTypeLookup[p?.propertytype] || 'Unknown';
	const addressTypeLabel = addressTypeLookup[p?.principaladdresstype] || 'Unknown';
	return `<div class="feature-popup">
		<div><strong>Address:</strong> ${escapeHtml(p?.address)}</div>
		<div><strong>Property Type:</strong> ${escapeHtml(propertyTypeLabel)}</div>
		<div><strong>PrincipalAddressSiteOID:</strong> ${escapeHtml(p?.principaladdresssiteoid)}</div>
		<div><strong>Principal Address Type:</strong> ${escapeHtml(addressTypeLabel)}</div>
	</div>`;
}

/** GNAF address-point hover tooltip. */
export function gnafAddressTooltipTemplate(feature: GeoJSON.Feature): string {
	const p = feature.properties ?? {};
	return `
		Address ID: ${escapeHtml(p.ADDRESS_DETAIL_PID)}<br>
		Geocode Type: ${escapeHtml(p.GEOCODE_TYPE)}<br>
		Street Number: ${escapeHtml(p.street_number)}
		<p>Click to see if there are multiple addresses</p>
	`;
}

/** Popup listing several GNAF addresses colocated at one point. */
export function gnafMultiFeaturePopupTemplate(features: GeoJSON.Feature[]): string {
	const items = features
		.map((feature) => {
			const p = feature.properties ?? {};
			return `
				<div class="feature-item">
					<strong>${escapeHtml(p.street_number)}</strong>
					<div>ID: ${escapeHtml(p.ADDRESS_DETAIL_PID)}</div>
					<div>Type: ${escapeHtml(p.GEOCODE_TYPE)}</div>
				</div>`;
		})
		.join('');
	return `<div class="multi-feature-popup"><h4>Addresses at this location:</h4>${items}</div>`;
}
