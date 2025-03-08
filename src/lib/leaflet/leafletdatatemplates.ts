// Lookup mappings
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

//Template strings
export function gurasPropertyPopUpTemplate(featureProperties: any) {
	const propertyTypeLabel = propertyTypeLookup[featureProperties.propertytype] || 'Unknown';
	const addressTypeLabel = addressTypeLookup[featureProperties.principaladdresstype] || 'Unknown';
	return `<div class="feature-popup">
                <div><strong>Address:</strong> ${featureProperties.address}</div>
                <div><strong>Property Type:</strong> ${propertyTypeLabel}</div>
                <div><strong>PrincipalAddressSiteOID:</strong> ${featureProperties.principaladdresssiteoid}</div>
                <div><strong>Principal Address Type:</strong> ${addressTypeLabel}</div>
            </div>`;
}

export function gnafTooltipTemplate(featureProperties: any) {
	return `<div class="editable-feature-tooltip">
                <div><strong>Address:</strong> ${featureProperties.address}</div>
                <div><strong>Principal Address Site OID:</strong> ${featureProperties.principaladdresssiteoid}</div>
            </div>`;
}
export function gnafAddressTooltipTemplate(feature: GeoJSON.Feature): string {
	return `
        Address ID: ${feature.properties?.ADDRESS_DETAIL_PID}<br>
        Geocode Type: ${feature.properties?.GEOCODE_TYPE}<br>
        Street Number: ${feature.properties?.street_number}
        <p>Click to see if there are multiple addresses</p>
    `;
}

export function gnafMultiFeaturePopupTemplate(features: GeoJSON.Feature[]): string {
	return `
        <div class="multi-feature-popup">
            <h4>Addresses at this location:</h4>
            ${features
							.map(
								(feature) => `
                <div class="feature-item">
                    <strong>${feature.properties?.street_number}</strong>
                    <div>ID: ${feature.properties?.ADDRESS_DETAIL_PID}</div>
                    <div>Type: ${feature.properties?.GEOCODE_TYPE}</div>
                </div>
            `
							)
							.join('')}
        </div>
    `;
}
