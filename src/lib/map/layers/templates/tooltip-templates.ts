// src/lib/layers/templates/tooltip-templates.ts

import {
	formatArea,
	formatDistance,
	formatCurrency,
	formatFieldName,
	toTitleCase
} from '$lib/utils/formatters';

/**
 * Tooltip templates for map features
 * Tooltips should be concise - typically showing 1-3 key pieces of info
 */

// ============================================================================
// PARCEL TOOLTIPS
// ============================================================================

/**
 * Default parcel tooltip - shows ID and area
 */
export function parcelTooltip(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const id = props.parcel_id || 'Unknown';
	const area = formatArea(props.area);

	return `<strong>Parcel ${id}</strong><br>${area}`;
}

/**
 * Parcel tooltip with owner
 */
export function parcelTooltipWithOwner(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const id = props.parcel_id || 'Unknown';
	const owner = props.owner_name || 'Unknown Owner';

	return `<strong>Parcel ${id}</strong><br>${owner}`;
}

/**
 * Parcel tooltip with zoning
 */
export function parcelTooltipWithZoning(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const id = props.parcel_id || 'Unknown';
	const zoning = toTitleCase(props.zoning) || 'N/A';

	return `<strong>Parcel ${id}</strong><br>Zoning: ${zoning}`;
}

/**
 * Parcel tooltip with valuation
 */
export function parcelTooltipWithValue(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const id = props.parcel_id || 'Unknown';
	const valuation = props.valuation ? formatCurrency(props.valuation, false) : 'N/A';

	return `<strong>Parcel ${id}</strong><br>Value: ${valuation}`;
}

// ============================================================================
// ROAD TOOLTIPS
// ============================================================================

/**
 * Default road tooltip - shows name
 */
export function roadTooltip(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Unnamed Road';

	return `<strong>${name}</strong>`;
}

/**
 * Road tooltip with type
 */
export function roadTooltipWithType(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Unnamed Road';
	const type = toTitleCase(props.road_type) || 'Road';

	return `<strong>${name}</strong><br>${type}`;
}

/**
 * Road tooltip with surface and condition
 */
export function roadTooltipWithCondition(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Unnamed Road';
	const surface = toTitleCase(props.surface) || 'Unknown';
	const condition = toTitleCase(props.surface_condition) || 'Unknown';

	return `<strong>${name}</strong><br>${surface} - ${condition}`;
}

/**
 * Road tooltip with length
 */
export function roadTooltipWithLength(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Unnamed Road';
	const length = formatDistance(props.length);

	return `<strong>${name}</strong><br>Length: ${length}`;
}

// ============================================================================
// POINT OF INTEREST TOOLTIPS
// ============================================================================

/**
 * Default POI tooltip - shows name
 */
export function poiTooltip(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Point of Interest';

	return `<strong>${name}</strong>`;
}

/**
 * POI tooltip with category
 */
export function poiTooltipWithCategory(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Point of Interest';
	const category = toTitleCase(props.category) || 'Other';

	return `<strong>${name}</strong><br><em>${category}</em>`;
}

/**
 * POI tooltip with address
 */
export function poiTooltipWithAddress(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Point of Interest';
	const address = props.address || props.suburb || 'No address';

	return `<strong>${name}</strong><br>${address}`;
}

/**
 * POI tooltip with opening hours
 */
export function poiTooltipWithHours(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Point of Interest';
	const hours = props.hours || 'Hours not available';

	return `<strong>${name}</strong><br>🕒 ${hours}`;
}

// ============================================================================
// BUILDING TOOLTIPS
// ============================================================================

/**
 * Default building tooltip - shows name or type
 */
export function buildingTooltip(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || toTitleCase(props.building_type) || 'Building';

	return `<strong>${name}</strong>`;
}

/**
 * Building tooltip with type and storeys
 */
export function buildingTooltipWithStoreys(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Building';
	const storeys = props.storeys || 'Unknown';
	const type = toTitleCase(props.building_type) || 'Building';

	return `<strong>${name}</strong><br>${type} - ${storeys} storey${storeys !== 1 ? 's' : ''}`;
}

/**
 * Building tooltip with area
 */
export function buildingTooltipWithArea(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Building';
	const area = formatArea(props.footprint_area || props.total_floor_area);

	return `<strong>${name}</strong><br>${area}`;
}

/**
 * Building tooltip with year built
 */
export function buildingTooltipWithYear(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Building';
	const year = props.construction_year || 'Year unknown';

	return `<strong>${name}</strong><br>Built: ${year}`;
}

/**
 * Building tooltip with condition
 */
export function buildingTooltipWithCondition(feature: GeoJSON.Feature): string {
	const props = feature.properties || {};
	const name = props.name || 'Building';
	const condition = toTitleCase(props.condition) || 'Unknown';

	return `<strong>${name}</strong><br>Condition: ${condition}`;
}

// ============================================================================
// GENERIC TOOLTIPS
// ============================================================================

/**
 * Simple tooltip - shows a single property value
 */
export function simpleTooltip(propertyKey: string) {
	return (feature: GeoJSON.Feature): string => {
		const props = feature.properties || {};
		const value = props[propertyKey];

		if (value === null || value === undefined) {
			return 'No data';
		}

		return String(value);
	};
}

/**
 * Simple tooltip with label
 */
export function labeledTooltip(propertyKey: string, label?: string) {
	return (feature: GeoJSON.Feature): string => {
		const props = feature.properties || {};
		const value = props[propertyKey];
		const displayLabel = label || formatFieldName(propertyKey);

		if (value === null || value === undefined) {
			return `<strong>${displayLabel}</strong><br>N/A`;
		}

		return `<strong>${displayLabel}</strong><br>${value}`;
	};
}

/**
 * Multi-field tooltip - shows multiple properties
 */
export function multiFieldTooltip(fields: string[]) {
	return (feature: GeoJSON.Feature): string => {
		const props = feature.properties || {};

		const lines = fields
			.filter((field) => props[field] !== null && props[field] !== undefined)
			.map((field) => {
				const label = formatFieldName(field);
				const value = props[field];
				return `${label}: ${value}`;
			});

		if (lines.length === 0) {
			return 'No data';
		}

		return lines.join('<br>');
	};
}

/**
 * Conditional tooltip - shows different content based on property value
 */
export function conditionalTooltip(
	propertyKey: string,
	tooltipMap: Record<string, (feature: GeoJSON.Feature) => string>,
	defaultTooltip: (feature: GeoJSON.Feature) => string
) {
	return (feature: GeoJSON.Feature): string => {
		const props = feature.properties || {};
		const value = props[propertyKey];

		const tooltipFn = tooltipMap[value] || defaultTooltip;
		return tooltipFn(feature);
	};
}

// ============================================================================
// TOOLTIP WITH ICONS
// ============================================================================

/**
 * Tooltip with emoji icon
 */
export function tooltipWithIcon(
	icon: string,
	text: string | ((feature: GeoJSON.Feature) => string)
) {
	return (feature: GeoJSON.Feature): string => {
		const content = typeof text === 'function' ? text(feature) : text;
		return `${icon} ${content}`;
	};
}

/**
 * Tooltip with status indicator
 */
export function tooltipWithStatus(
	nameProperty: string,
	statusProperty: string,
	statusColors?: Record<string, string>
) {
	return (feature: GeoJSON.Feature): string => {
		const props = feature.properties || {};
		const name = props[nameProperty] || 'Unknown';
		const status = props[statusProperty];

		if (!status) {
			return `<strong>${name}</strong>`;
		}

		const color = statusColors?.[status] || '#999';
		const statusDot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:4px;"></span>`;

		return `${statusDot}<strong>${name}</strong><br><em>${toTitleCase(status)}</em>`;
	};
}

// ============================================================================
// CUSTOM TOOLTIP BUILDERS
// ============================================================================

/**
 * Create a custom tooltip with HTML template
 */
export function createCustomTooltip(template: (props: Record<string, any>) => string) {
	return (feature: GeoJSON.Feature): string => {
		return template(feature.properties || {});
	};
}

/**
 * Create a tooltip that shows different fields based on zoom level
 * Note: This requires passing the current zoom level, typically done in the interaction manager
 */
export function createZoomDependentTooltip(
	zoomLevels: Array<{ maxZoom: number; tooltip: (feature: GeoJSON.Feature) => string }>
) {
	return (feature: GeoJSON.Feature, currentZoom?: number): string => {
		if (currentZoom === undefined) {
			// Fallback to most detailed (last) tooltip if zoom not provided
			return zoomLevels[zoomLevels.length - 1].tooltip(feature);
		}

		// Find the appropriate tooltip for the current zoom level
		for (const level of zoomLevels) {
			if (currentZoom <= level.maxZoom) {
				return level.tooltip(feature);
			}
		}

		// Default to the most detailed view
		return zoomLevels[zoomLevels.length - 1].tooltip(feature);
	};
}

// ============================================================================
// TOOLTIP EXAMPLES WITH CATEGORY-BASED ICONS
// ============================================================================

/**
 * POI tooltip with category-specific icons
 */
export const poiTooltipWithIcon = (feature: GeoJSON.Feature): string => {
	const props = feature.properties || {};
	const name = props.name || 'Point of Interest';
	const category = props.category;

	const iconMap: Record<string, string> = {
		park: '🌳',
		school: '🏫',
		hospital: '🏥',
		library: '📚',
		community: '🏛️',
		sports: '⚽',
		cultural: '🎭',
		religious: '⛪',
		government: '🏛️',
		emergency: '🚨',
		other: '📍'
	};

	const icon = iconMap[category] || '📍';

	return `${icon} <strong>${name}</strong>`;
};

/**
 * Road tooltip with surface icon
 */
export const roadTooltipWithIcon = (feature: GeoJSON.Feature): string => {
	const props = feature.properties || {};
	const name = props.name || 'Unnamed Road';
	const surface = props.surface;

	const iconMap: Record<string, string> = {
		paved: '🛣️',
		concrete: '🛣️',
		asphalt: '🛣️',
		gravel: '🪨',
		dirt: '🌾',
		other: '🛤️'
	};

	const icon = iconMap[surface] || '🛤️';

	return `${icon} <strong>${name}</strong>`;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Truncate tooltip text if too long
 */
export function truncateTooltip(text: string, maxLength: number = 100): string {
	if (text.length <= maxLength) return text;

	return text.substring(0, maxLength - 3) + '...';
}

/**
 * Escape HTML in tooltip content
 */
export function escapeHtml(text: string): string {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

/**
 * Sanitize tooltip content (remove script tags, etc.)
 */
export function sanitizeTooltip(html: string): string {
	return html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
		.replace(/on\w+="[^"]*"/gi, '')
		.replace(/on\w+='[^']*'/gi, '');
}

// ============================================================================
// TOOLTIP STYLE HELPERS
// ============================================================================

/**
 * Wrap tooltip content with custom styling
 */
export function styledTooltip(
	content: string,
	styles?: {
		backgroundColor?: string;
		color?: string;
		fontSize?: string;
		padding?: string;
		borderRadius?: string;
	}
): string {
	const defaultStyles = {
		backgroundColor: '#fff',
		color: '#333',
		fontSize: '12px',
		padding: '8px 12px',
		borderRadius: '4px',
		...styles
	};

	const styleString = Object.entries(defaultStyles)
		.map(([key, value]) => {
			const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
			return `${cssKey}:${value}`;
		})
		.join(';');

	return `<div style="${styleString}">${content}</div>`;
}

/**
 * Add a header to tooltip
 */
export function tooltipWithHeader(header: string, content: string): string {
	return `
    <div style="font-weight:bold;margin-bottom:4px;border-bottom:1px solid #e5e7eb;padding-bottom:4px;">
      ${header}
    </div>
    <div>${content}</div>
  `;
}

// ============================================================================
// EXPORT ALL TOOLTIP TEMPLATES
// ============================================================================

export const tooltipTemplates = {
	// Parcel
	parcel: parcelTooltip,
	parcelWithOwner: parcelTooltipWithOwner,
	parcelWithZoning: parcelTooltipWithZoning,
	parcelWithValue: parcelTooltipWithValue,

	// Road
	road: roadTooltip,
	roadWithType: roadTooltipWithType,
	roadWithCondition: roadTooltipWithCondition,
	roadWithLength: roadTooltipWithLength,
	roadWithIcon: roadTooltipWithIcon,

	// POI
	poi: poiTooltip,
	poiWithCategory: poiTooltipWithCategory,
	poiWithAddress: poiTooltipWithAddress,
	poiWithHours: poiTooltipWithHours,
	poiWithIcon: poiTooltipWithIcon,

	// Building
	building: buildingTooltip,
	buildingWithStoreys: buildingTooltipWithStoreys,
	buildingWithArea: buildingTooltipWithArea,
	buildingWithYear: buildingTooltipWithYear,
	buildingWithCondition: buildingTooltipWithCondition,

	// Generic
	simple: simpleTooltip,
	labeled: labeledTooltip,
	multiField: multiFieldTooltip,
	conditional: conditionalTooltip,
	withIcon: tooltipWithIcon,
	withStatus: tooltipWithStatus,
	custom: createCustomTooltip
};
