export function parcelPopupTemplate(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};

	return `
    <div class="popup-content parcel-popup">
      <h3 class="popup-title">Parcel ${props.parcel_id}</h3>
      
      <div class="popup-section">
        <h4>Ownership</h4>
        <table>
          <tr>
            <td class="label">Owner:</td>
            <td>${props.owner_name || 'N/A'}</td>
          </tr>
          ${
						props.owner_address
							? `
          <tr>
            <td class="label">Address:</td>
            <td>${props.owner_address}</td>
          </tr>
          `
							: ''
					}
        </table>
      </div>
      
      <div class="popup-section">
        <h4>Property Details</h4>
        <table>
          <tr>
            <td class="label">Area:</td>
            <td>${(props.area || 0).toLocaleString()} m²</td>
          </tr>
          <tr>
            <td class="label">Zoning:</td>
            <td>${props.zoning || 'N/A'}</td>
          </tr>
          ${
						props.valuation
							? `
          <tr>
            <td class="label">Valuation:</td>
            <td>$${props.valuation.toLocaleString()}</td>
          </tr>
          `
							: ''
					}
        </table>
      </div>
    </div>
  `;
}

export function simplePopupTemplate(feature: GeoJSON.Feature, fields: string[]): string {
	const props = feature.properties || {};

	const rows = fields
		.filter((field) => props[field] !== undefined)
		.map((field) => {
			const label = field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
			const value = formatValue(props[field]);

			return `
        <tr>
          <td class="label">${label}:</td>
          <td>${value}</td>
        </tr>
      `;
		})
		.join('');

	return `
    <div class="popup-content">
      <table>${rows}</table>
    </div>
  `;
}

function formatValue(value: any): string {
	if (value === null || value === undefined) return 'N/A';
	if (typeof value === 'boolean') return value ? 'Yes' : 'No';
	if (typeof value === 'number') return value.toLocaleString();
	if (value instanceof Date) return value.toLocaleDateString();
	return String(value);
}
