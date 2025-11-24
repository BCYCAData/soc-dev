// src/lib/utils/formatters.ts

/**
 * Utility functions for formatting values in map features
 */

// ============================================================================
// AREA FORMATTERS
// ============================================================================

/**
 * Format area with appropriate units (m² or ha)
 * @param area - Area in square meters
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with units
 */
export function formatArea(area: number | null | undefined, decimals: number = 2): string {
	if (area === null || area === undefined) return 'N/A';

	// Convert to hectares if area is large
	if (area >= 10000) {
		const hectares = area / 10000;
		return `${hectares.toLocaleString(undefined, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		})} ha`;
	}

	return `${area.toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})} m²`;
}

/**
 * Format area in square meters only
 */
export function formatAreaM2(area: number | null | undefined, decimals: number = 2): string {
	if (area === null || area === undefined) return 'N/A';

	return `${area.toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})} m²`;
}

/**
 * Format area in hectares only
 */
export function formatAreaHa(area: number | null | undefined, decimals: number = 2): string {
	if (area === null || area === undefined) return 'N/A';

	const hectares = area / 10000;
	return `${hectares.toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})} ha`;
}

/**
 * Format area in acres
 */
export function formatAreaAcres(area: number | null | undefined, decimals: number = 2): string {
	if (area === null || area === undefined) return 'N/A';

	const acres = area / 4046.86; // 1 acre = 4046.86 m²
	return `${acres.toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})} acres`;
}

// ============================================================================
// DISTANCE/LENGTH FORMATTERS
// ============================================================================

/**
 * Format distance with appropriate units (m or km)
 * @param distance - Distance in meters
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with units
 */
export function formatDistance(distance: number | null | undefined, decimals: number = 2): string {
	if (distance === null || distance === undefined) return 'N/A';

	// Convert to kilometers if distance is large
	if (distance >= 1000) {
		const kilometers = distance / 1000;
		return `${kilometers.toLocaleString(undefined, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		})} km`;
	}

	return `${distance.toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})} m`;
}

/**
 * Format distance in meters only
 */
export function formatDistanceM(distance: number | null | undefined, decimals: number = 2): string {
	if (distance === null || distance === undefined) return 'N/A';

	return `${distance.toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})} m`;
}

// ============================================================================
// CURRENCY FORMATTERS
// ============================================================================

/**
 * Format currency in AUD
 * @param amount - Amount in dollars
 * @param showCents - Whether to show cents (default: true)
 * @returns Formatted currency string
 */
export function formatCurrency(
	amount: number | null | undefined,
	showCents: boolean = true
): string {
	if (amount === null || amount === undefined) return 'N/A';

	return new Intl.NumberFormat('en-AU', {
		style: 'currency',
		currency: 'AUD',
		minimumFractionDigits: showCents ? 2 : 0,
		maximumFractionDigits: showCents ? 2 : 0
	}).format(amount);
}

/**
 * Format currency without cents and with K/M suffix for large numbers
 */
export function formatCurrencyShort(amount: number | null | undefined): string {
	if (amount === null || amount === undefined) return 'N/A';

	if (amount >= 1000000) {
		return `$${(amount / 1000000).toFixed(2)}M`;
	}

	if (amount >= 1000) {
		return `$${(amount / 1000).toFixed(0)}K`;
	}

	return formatCurrency(amount, false);
}

// ============================================================================
// NUMBER FORMATTERS
// ============================================================================

/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number | null | undefined, decimals: number = 0): string {
	if (value === null || value === undefined) return 'N/A';

	return value.toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	});
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | null | undefined, decimals: number = 1): string {
	if (value === null || value === undefined) return 'N/A';

	return `${value.toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	})}%`;
}

/**
 * Format a ratio as X:1
 */
export function formatRatio(value: number | null | undefined, decimals: number = 2): string {
	if (value === null || value === undefined) return 'N/A';

	return `${value.toFixed(decimals)}:1`;
}

// ============================================================================
// DATE/TIME FORMATTERS
// ============================================================================

/**
 * Format date
 */
export function formatDate(date: Date | string | null | undefined): string {
	if (!date) return 'N/A';

	const dateObj = typeof date === 'string' ? new Date(date) : date;

	return dateObj.toLocaleDateString('en-AU', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string | null | undefined): string {
	if (!date) return 'N/A';

	const dateObj = typeof date === 'string' ? new Date(date) : date;

	return dateObj.toLocaleString('en-AU', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

/**
 * Format date in ISO format (YYYY-MM-DD)
 */
export function formatDateISO(date: Date | string | null | undefined): string {
	if (!date) return 'N/A';

	const dateObj = typeof date === 'string' ? new Date(date) : date;

	return dateObj.toISOString().split('T')[0];
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
	if (!date) return 'N/A';

	const dateObj = typeof date === 'string' ? new Date(date) : date;
	const now = new Date();
	const diffMs = now.getTime() - dateObj.getTime();
	const diffSecs = Math.floor(diffMs / 1000);
	const diffMins = Math.floor(diffSecs / 60);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffSecs < 60) return 'just now';
	if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
	if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
	if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

	return formatDate(dateObj);
}

// ============================================================================
// TEXT FORMATTERS
// ============================================================================

/**
 * Format field name from snake_case to Title Case
 */
export function formatFieldName(fieldName: string): string {
	return fieldName
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string | null | undefined, maxLength: number = 100): string {
	if (!text) return '';

	if (text.length <= maxLength) return text;

	return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string | null | undefined): string {
	if (!text) return '';

	return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert to title case
 */
export function toTitleCase(text: string | null | undefined): string {
	if (!text) return '';

	return text
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

// ============================================================================
// CONTACT FORMATTERS
// ============================================================================

/**
 * Format phone number
 */
export function formatPhone(phone: string | null | undefined): string {
	if (!phone) return 'N/A';

	// Remove all non-digit characters
	const cleaned = phone.replace(/\D/g, '');

	// Australian mobile format: 04XX XXX XXX
	if (cleaned.startsWith('04') && cleaned.length === 10) {
		return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
	}

	// Australian landline format: (0X) XXXX XXXX
	if (cleaned.startsWith('0') && cleaned.length === 10) {
		return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2 $3');
	}

	// International format or fallback
	return phone;
}

/**
 * Format email with mailto link
 */
export function formatEmailLink(email: string | null | undefined): string {
	if (!email) return 'N/A';

	return `<a href="mailto:${email}">${email}</a>`;
}

/**
 * Format website URL
 */
export function formatWebsiteLink(url: string | null | undefined, label?: string): string {
	if (!url) return 'N/A';

	// Ensure URL has protocol
	const fullUrl = url.startsWith('http') ? url : `https://${url}`;

	// Extract domain for display if no label provided
	const displayText = label || url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];

	return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${displayText}</a>`;
}

// ============================================================================
// ADDRESS FORMATTERS
// ============================================================================

/**
 * Format full address
 */
export function formatAddress(components: {
	street?: string;
	suburb?: string;
	state?: string;
	postcode?: string;
}): string {
	const parts = [
		components.street,
		components.suburb,
		components.state,
		components.postcode
	].filter(Boolean);

	if (parts.length === 0) return 'N/A';

	return parts.join(', ');
}

// ============================================================================
// BOOLEAN FORMATTERS
// ============================================================================

/**
 * Format boolean as Yes/No
 */
export function formatBoolean(value: boolean | null | undefined): string {
	if (value === null || value === undefined) return 'N/A';

	return value ? 'Yes' : 'No';
}

/**
 * Format boolean with custom labels
 */
export function formatBooleanCustom(
	value: boolean | null | undefined,
	trueLabel: string,
	falseLabel: string
): string {
	if (value === null || value === undefined) return 'N/A';

	return value ? trueLabel : falseLabel;
}

// ============================================================================
// COORDINATE FORMATTERS
// ============================================================================

/**
 * Format coordinates in decimal degrees
 */
export function formatCoordinates(
	lat: number | null | undefined,
	lng: number | null | undefined,
	decimals: number = 6
): string {
	if (lat === null || lat === undefined || lng === null || lng === undefined) {
		return 'N/A';
	}

	return `${lat.toFixed(decimals)}, ${lng.toFixed(decimals)}`;
}

/**
 * Format coordinates in degrees, minutes, seconds
 */
export function formatCoordinatesDMS(
	lat: number | null | undefined,
	lng: number | null | undefined
): string {
	if (lat === null || lat === undefined || lng === null || lng === undefined) {
		return 'N/A';
	}

	const formatDMS = (value: number, isLat: boolean): string => {
		const absolute = Math.abs(value);
		const degrees = Math.floor(absolute);
		const minutesDecimal = (absolute - degrees) * 60;
		const minutes = Math.floor(minutesDecimal);
		const seconds = ((minutesDecimal - minutes) * 60).toFixed(2);

		const direction = isLat ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W';

		return `${degrees}°${minutes}'${seconds}"${direction}`;
	};

	return `${formatDMS(lat, true)} ${formatDMS(lng, false)}`;
}

// ============================================================================
// GENERIC VALUE FORMATTER
// ============================================================================

/**
 * Smart format any value based on its type
 */
export function formatValue(value: any): string {
	if (value === null || value === undefined) return 'N/A';

	// Boolean
	if (typeof value === 'boolean') return formatBoolean(value);

	// Number
	if (typeof value === 'number') return formatNumber(value);

	// Date
	if (value instanceof Date) return formatDate(value);

	// Array
	if (Array.isArray(value)) return value.join(', ');

	// Object
	if (typeof value === 'object') return JSON.stringify(value);

	// String (default)
	return String(value);
}

// ============================================================================
// SPECIFIC DOMAIN FORMATTERS
// ============================================================================

/**
 * Format zoning code with description
 */
export function formatZoning(code: string | null | undefined): string {
	if (!code) return 'N/A';

	const zoningMap: Record<string, string> = {
		residential: 'Residential',
		commercial: 'Commercial',
		industrial: 'Industrial',
		agricultural: 'Agricultural',
		'mixed-use': 'Mixed Use',
		conservation: 'Conservation',
		public: 'Public/Institutional'
	};

	return zoningMap[code] || toTitleCase(code);
}

/**
 * Format road type with description
 */
export function formatRoadType(type: string | null | undefined): string {
	if (!type) return 'N/A';

	const roadTypeMap: Record<string, string> = {
		highway: 'Highway',
		main: 'Main Road',
		arterial: 'Arterial Road',
		collector: 'Collector Road',
		local: 'Local Road',
		private: 'Private Road',
		track: 'Track/Trail'
	};

	return roadTypeMap[type] || toTitleCase(type);
}

/**
 * Format surface type
 */
export function formatSurface(surface: string | null | undefined): string {
	if (!surface) return 'N/A';

	const surfaceMap: Record<string, string> = {
		paved: 'Paved/Sealed',
		concrete: 'Concrete',
		asphalt: 'Asphalt',
		gravel: 'Gravel',
		dirt: 'Dirt/Unsealed',
		other: 'Other'
	};

	return surfaceMap[surface] || toTitleCase(surface);
}

/**
 * Format building condition
 */
export function formatCondition(condition: string | null | undefined): string {
	if (!condition) return 'N/A';

	const conditionMap: Record<string, string> = {
		excellent: 'Excellent',
		good: 'Good',
		fair: 'Fair',
		poor: 'Poor',
		failed: 'Failed',
		derelict: 'Derelict'
	};

	return conditionMap[condition] || toTitleCase(condition);
}
