import type {
	PointStyle,
	LineStyle,
	PolygonStyle
} from '$lib/map/layers/schemas/layer-config.types';
import { getColorFromPalette, colorPalettes } from '$lib/map/layers/styles/index';

/**
 * Categorized styling functions for qualitative/categorical data
 * Used for styling features based on discrete categories
 */

// ============================================================================
// CATEGORY STYLE GENERATORS
// ============================================================================

/**
 * Create a categorized style function for any geometry type
 */
export function createCategorizedStyle<T extends PointStyle | LineStyle | PolygonStyle>(config: {
	property: string;
	categories: Record<string, T>;
	defaultStyle: T;
	geometryType: 'point' | 'line' | 'polygon';
}) {
	const { property, categories, defaultStyle } = config;

	return (feature: GeoJSON.Feature): T => {
		const value = feature.properties?.[property];

		if (value === null || value === undefined) {
			return defaultStyle;
		}

		// Convert to string for consistent matching
		const categoryKey = String(value).toLowerCase();

		// Try exact match first
		if (categories[categoryKey]) {
			return categories[categoryKey];
		}

		// Try case-insensitive match
		const matchedKey = Object.keys(categories).find((key) => key.toLowerCase() === categoryKey);

		if (matchedKey) {
			return categories[matchedKey];
		}

		return defaultStyle;
	};
}

/**
 * Create categorized point style
 */
export function createCategorizedPointStyle(config: {
	property: string;
	categories: Record<string, Partial<PointStyle>>;
	baseStyle?: PointStyle;
	defaultStyle?: PointStyle;
}) {
	const {
		property,
		categories,
		baseStyle = {
			radius: 6,
			fillColor: '#3b82f6',
			fillOpacity: 0.7,
			color: '#ffffff',
			weight: 2,
			opacity: 1
		},
		defaultStyle = { ...baseStyle, fillColor: '#94a3b8' }
	} = config;

	// Merge base style with category-specific styles
	const mergedCategories: Record<string, PointStyle> = {};
	Object.entries(categories).forEach(([key, style]) => {
		mergedCategories[key] = { ...baseStyle, ...style };
	});

	return createCategorizedStyle({
		property,
		categories: mergedCategories,
		defaultStyle,
		geometryType: 'point'
	});
}

/**
 * Create categorized line style
 */
export function createCategorizedLineStyle(config: {
	property: string;
	categories: Record<string, Partial<LineStyle>>;
	baseStyle?: LineStyle;
	defaultStyle?: LineStyle;
}) {
	const {
		property,
		categories,
		baseStyle = {
			color: '#3b82f6',
			weight: 3,
			opacity: 0.8,
			lineCap: 'round',
			lineJoin: 'round'
		},
		defaultStyle = { ...baseStyle, color: '#94a3b8' }
	} = config;

	const mergedCategories: Record<string, LineStyle> = {};
	Object.entries(categories).forEach(([key, style]) => {
		mergedCategories[key] = { ...baseStyle, ...style } as LineStyle;
	});

	return createCategorizedStyle({
		property,
		categories: mergedCategories,
		defaultStyle,
		geometryType: 'line'
	});
}

/**
 * Create categorized polygon style
 */
export function createCategorizedPolygonStyle(config: {
	property: string;
	categories: Record<string, Partial<PolygonStyle>>;
	baseStyle?: PolygonStyle;
	defaultStyle?: PolygonStyle;
}) {
	const {
		property,
		categories,
		baseStyle = {
			fillColor: '#3b82f6',
			fillOpacity: 0.4,
			color: '#2563eb',
			weight: 2,
			opacity: 0.8
		},
		defaultStyle = { ...baseStyle, fillColor: '#94a3b8', color: '#64748b' }
	} = config;

	const mergedCategories: Record<string, PolygonStyle> = {};
	Object.entries(categories).forEach(([key, style]) => {
		mergedCategories[key] = { ...baseStyle, ...style };
	});

	return createCategorizedStyle({
		property,
		categories: mergedCategories,
		defaultStyle,
		geometryType: 'polygon'
	});
}

// ============================================================================
// AUTO-GENERATION FROM DATA
// ============================================================================

/**
 * Auto-generate categorized style from feature data
 */
export function autoGenerateCategorizedStyle(
	features: GeoJSON.Feature[],
	property: string,
	geometryType: 'point' | 'line' | 'polygon',
	options: {
		colorPalette?: string[];
		baseStyle?: any;
		maxCategories?: number;
	} = {}
) {
	const { colorPalette = colorPalettes.categorical, baseStyle, maxCategories = 20 } = options;

	// Extract unique categories
	const categorySet = new Set<string>();
	features.forEach((f) => {
		const value = f.properties?.[property];
		if (value !== null && value !== undefined) {
			categorySet.add(String(value));
		}
	});

	const categories = Array.from(categorySet);

	if (categories.length > maxCategories) {
		console.warn(`Too many categories (${categories.length}). Limiting to ${maxCategories}.`);
		categories.length = maxCategories;
	}

	// Generate styles for each category
	const categoryStyles: Record<string, any> = {};

	categories.forEach((category, index) => {
		const color = getColorFromPalette(colorPalette, index);

		switch (geometryType) {
			case 'point':
				categoryStyles[category] = {
					fillColor: color
				};
				break;
			case 'line':
				categoryStyles[category] = {
					color
				};
				break;
			case 'polygon':
				categoryStyles[category] = {
					fillColor: color,
					color
				};
				break;
		}
	});

	// Create appropriate style function
	switch (geometryType) {
		case 'point':
			return createCategorizedPointStyle({
				property,
				categories: categoryStyles,
				baseStyle
			});
		case 'line':
			return createCategorizedLineStyle({
				property,
				categories: categoryStyles,
				baseStyle
			});
		case 'polygon':
			return createCategorizedPolygonStyle({
				property,
				categories: categoryStyles,
				baseStyle
			});
	}
}

// ============================================================================
// PRESET CATEGORY STYLES
// ============================================================================

/**
 * Road type categorized styles
 */
export const roadTypeCategoryStyles = createCategorizedLineStyle({
	property: 'road_type',
	categories: {
		highway: {
			color: '#dc2626',
			weight: 5,
			opacity: 1
		},
		main: {
			color: '#f97316',
			weight: 4,
			opacity: 0.9
		},
		arterial: {
			color: '#f59e0b',
			weight: 3,
			opacity: 0.8
		},
		collector: {
			color: '#64748b',
			weight: 3,
			opacity: 0.8
		},
		local: {
			color: '#94a3b8',
			weight: 2,
			opacity: 0.7
		},
		private: {
			color: '#cbd5e1',
			weight: 2,
			opacity: 0.6,
			dashArray: '5, 5'
		},
		track: {
			color: '#a8a29e',
			weight: 1,
			opacity: 0.5,
			dashArray: '5, 5'
		}
	}
});

/**
 * Zoning categorized styles
 */
export const zoningCategoryStyles = createCategorizedPolygonStyle({
	property: 'zoning',
	categories: {
		residential: {
			fillColor: '#fef3c7',
			color: '#f59e0b'
		},
		commercial: {
			fillColor: '#dbeafe',
			color: '#3b82f6'
		},
		industrial: {
			fillColor: '#e9d5ff',
			color: '#a855f7'
		},
		agricultural: {
			fillColor: '#d1fae5',
			color: '#10b981'
		},
		'mixed-use': {
			fillColor: '#fce7f3',
			color: '#ec4899'
		},
		conservation: {
			fillColor: '#dcfce7',
			color: '#22c55e'
		},
		public: {
			fillColor: '#e0e7ff',
			color: '#6366f1'
		}
	}
});

/**
 * Land use categorized styles
 */
export const landUseCategoryStyles = createCategorizedPolygonStyle({
	property: 'land_use',
	categories: {
		vacant: {
			fillColor: '#f3f4f6',
			color: '#9ca3af'
		},
		'single-family': {
			fillColor: '#fef3c7',
			color: '#f59e0b'
		},
		'multi-family': {
			fillColor: '#fed7aa',
			color: '#ea580c'
		},
		retail: {
			fillColor: '#dbeafe',
			color: '#3b82f6'
		},
		office: {
			fillColor: '#bfdbfe',
			color: '#2563eb'
		},
		warehouse: {
			fillColor: '#e9d5ff',
			color: '#a855f7'
		},
		farming: {
			fillColor: '#d1fae5',
			color: '#10b981'
		},
		grazing: {
			fillColor: '#dcfce7',
			color: '#22c55e'
		},
		forestry: {
			fillColor: '#a7f3d0',
			color: '#059669'
		}
	}
});

/**
 * POI category styles with distinct colors
 */
export const poiCategoryStyles = createCategorizedPointStyle({
	property: 'category',
	categories: {
		park: {
			fillColor: '#22c55e',
			radius: 8
		},
		school: {
			fillColor: '#3b82f6',
			radius: 8
		},
		hospital: {
			fillColor: '#ef4444',
			radius: 10
		},
		library: {
			fillColor: '#8b5cf6',
			radius: 7
		},
		community: {
			fillColor: '#f59e0b',
			radius: 8
		},
		sports: {
			fillColor: '#06b6d4',
			radius: 8
		},
		cultural: {
			fillColor: '#ec4899',
			radius: 7
		},
		religious: {
			fillColor: '#6366f1',
			radius: 7
		},
		government: {
			fillColor: '#64748b',
			radius: 8
		},
		emergency: {
			fillColor: '#dc2626',
			radius: 9
		}
	}
});

/**
 * Building type categorized styles
 */
export const buildingTypeCategoryStyles = createCategorizedPolygonStyle({
	property: 'building_type',
	categories: {
		residential: {
			fillColor: '#fef3c7',
			fillOpacity: 0.6,
			color: '#f59e0b'
		},
		commercial: {
			fillColor: '#dbeafe',
			fillOpacity: 0.6,
			color: '#3b82f6'
		},
		industrial: {
			fillColor: '#e9d5ff',
			fillOpacity: 0.6,
			color: '#a855f7'
		},
		institutional: {
			fillColor: '#e0e7ff',
			fillOpacity: 0.6,
			color: '#6366f1'
		},
		agricultural: {
			fillColor: '#d1fae5',
			fillOpacity: 0.5,
			color: '#10b981'
		},
		'mixed-use': {
			fillColor: '#fce7f3',
			fillOpacity: 0.6,
			color: '#ec4899'
		}
	}
});

/**
 * Surface condition categorized styles
 */
export const conditionCategoryStyles = createCategorizedPolygonStyle({
	property: 'condition',
	categories: {
		excellent: {
			fillColor: '#22c55e',
			fillOpacity: 0.6
		},
		good: {
			fillColor: '#84cc16',
			fillOpacity: 0.5
		},
		fair: {
			fillColor: '#f59e0b',
			fillOpacity: 0.5
		},
		poor: {
			fillColor: '#f97316',
			fillOpacity: 0.6
		},
		failed: {
			fillColor: '#ef4444',
			fillOpacity: 0.7
		},
		derelict: {
			fillColor: '#991b1b',
			fillOpacity: 0.7
		}
	}
});

// ============================================================================
// LEGEND GENERATION
// ============================================================================

/**
 * Generate legend data for categorized map
 */
export function generateCategorizedLegend(config: {
	property: string;
	categories: Record<string, { color?: string; fillColor?: string; label?: string }>;
	defaultColor?: string;
	title?: string;
	showDefault?: boolean;
}) {
	const { property, categories, defaultColor = '#94a3b8', title, showDefault = true } = config;

	const items: Array<{ color: string; label: string; value: string }> = [];

	Object.entries(categories).forEach(([value, style]) => {
		const color = style.fillColor || style.color || defaultColor;
		const label = style.label || value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

		items.push({
			color,
			label,
			value
		});
	});

	if (showDefault) {
		items.push({
			color: defaultColor,
			label: 'Other',
			value: '__default__'
		});
	}

	return {
		title: title || property.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
		items
	};
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get unique categories from features
 */
export function getUniqueCategories(features: GeoJSON.Feature[], property: string): string[] {
	const categorySet = new Set<string>();

	features.forEach((f) => {
		const value = f.properties?.[property];
		if (value !== null && value !== undefined) {
			categorySet.add(String(value));
		}
	});

	return Array.from(categorySet).sort();
}

/**
 * Count features by category
 */
export function countByCategory(
	features: GeoJSON.Feature[],
	property: string
): Record<string, number> {
	const counts: Record<string, number> = {};

	features.forEach((f) => {
		const value = f.properties?.[property];
		if (value !== null && value !== undefined) {
			const key = String(value);
			counts[key] = (counts[key] || 0) + 1;
		}
	});

	return counts;
}

/**
 * Get category statistics
 */
export function getCategoryStats(features: GeoJSON.Feature[], property: string) {
	const categories = getUniqueCategories(features, property);
	const counts = countByCategory(features, property);
	const total = features.length;

	const stats = categories.map((category) => ({
		category,
		count: counts[category],
		percentage: (counts[category] / total) * 100
	}));

	// Sort by count descending
	stats.sort((a, b) => b.count - a.count);

	return {
		categories,
		counts,
		stats,
		total,
		uniqueCount: categories.length
	};
}

/**
 * Suggest if data should use categorized styling
 */
export function shouldUseCategorizedStyle(
	features: GeoJSON.Feature[],
	property: string,
	maxCategories: number = 20
): boolean {
	const categories = getUniqueCategories(features, property);

	// Check if all values are strings or have a small number of unique values
	return categories.length <= maxCategories && categories.length > 0;
}

/**
 * Filter features by category
 */
export function filterByCategory(
	features: GeoJSON.Feature[],
	property: string,
	categories: string[]
): GeoJSON.Feature[] {
	const categorySet = new Set(categories.map((c) => c.toLowerCase()));

	return features.filter((f) => {
		const value = f.properties?.[property];
		if (value === null || value === undefined) return false;
		return categorySet.has(String(value).toLowerCase());
	});
}

// ============================================================================
// COMBINED CATEGORIZED & SIZED
// ============================================================================

/**
 * Create categorized point style with size based on another property
 */
export function createCategorizedSizedPointStyle(config: {
	categoryProperty: string;
	sizeProperty: string;
	categories: Record<string, Partial<PointStyle>>;
	minRadius?: number;
	maxRadius?: number;
	baseStyle?: PointStyle;
}) {
	const {
		categoryProperty,
		sizeProperty,
		categories,
		minRadius = 4,
		maxRadius = 12,
		baseStyle = {
			fillOpacity: 0.7,
			color: '#ffffff',
			weight: 2,
			opacity: 1
		}
	} = config;

	return (feature: GeoJSON.Feature, allFeatures?: GeoJSON.Feature[]): PointStyle => {
		// Get category style
		const categoryValue = feature.properties?.[categoryProperty];
		const categoryStyle = categoryValue ? categories[String(categoryValue)] : {};

		// Get size value
		const sizeValue = feature.properties?.[sizeProperty];

		let radius = baseStyle.radius || 6;

		if (sizeValue !== null && sizeValue !== undefined && allFeatures) {
			// Calculate min/max from all features
			const sizeValues = allFeatures
				.map((f) => f.properties?.[sizeProperty])
				.filter((v) => v !== null && v !== undefined);

			const minSize = Math.min(...sizeValues);
			const maxSize = Math.max(...sizeValues);

			if (maxSize > minSize) {
				const factor = (sizeValue - minSize) / (maxSize - minSize);
				radius = minRadius + (maxRadius - minRadius) * factor;
			}
		}

		return {
			...baseStyle,
			...categoryStyle,
			radius
		};
	};
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
	createCategorizedStyle,
	createCategorizedPointStyle,
	createCategorizedLineStyle,
	createCategorizedPolygonStyle,
	autoGenerateCategorizedStyle,
	generateCategorizedLegend,
	getUniqueCategories,
	countByCategory,
	getCategoryStats,
	shouldUseCategorizedStyle,
	filterByCategory,
	createCategorizedSizedPointStyle,
	// Presets
	roadTypeCategoryStyles,
	zoningCategoryStyles,
	landUseCategoryStyles,
	poiCategoryStyles,
	buildingTypeCategoryStyles,
	conditionCategoryStyles
};
