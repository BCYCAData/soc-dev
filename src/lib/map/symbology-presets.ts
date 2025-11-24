import type { PointStyle, LineStyle, PolygonStyle } from './geojson-helpers';

/**
 * A symbology preset defines styling for one or more geometry types
 */
export interface SymbologyPreset {
	point?: PointStyle | ((feature: GeoJSON.Feature) => PointStyle);
	line?: LineStyle | ((feature: GeoJSON.Feature) => LineStyle);
	polygon?: PolygonStyle | ((feature: GeoJSON.Feature) => PolygonStyle);
	name?: string;
	description?: string;
}

/**
 * Standard color palette for consistency
 */
export const colors = {
	// Status colors
	critical: '#dc2626',
	warning: '#f59e0b',
	success: '#16a34a',
	info: '#3b82f6',
	neutral: '#6b7280',

	// Extended palette
	primary: '#3b82f6',
	secondary: '#8b5cf6',
	accent: '#ec4899',
	danger: '#dc2626',
	safe: '#16a34a',

	// Grays
	gray100: '#f3f4f6',
	gray200: '#e5e7eb',
	gray300: '#d1d5db',
	gray400: '#9ca3af',
	gray500: '#6b7280',
	gray600: '#4b5563',
	gray700: '#374151',
	gray800: '#1f2937',
	gray900: '#111827'
} as const;

/**
 * Pre-defined symbology presets for common use cases
 */
export const symbologyPresets = {
	/**
	 * Critical infrastructure styling (red theme)
	 */
	criticalInfrastructure: {
		name: 'Critical Infrastructure',
		description: 'High-visibility red theme for critical assets',
		point: {
			color: colors.critical,
			fillColor: colors.critical,
			radius: 10,
			weight: 2,
			fillOpacity: 0.8,
			opacity: 1
		},
		line: {
			color: colors.critical,
			weight: 4,
			opacity: 1
		},
		polygon: {
			fillColor: colors.critical,
			fillOpacity: 0.3,
			color: colors.critical,
			weight: 2,
			opacity: 1
		}
	} as SymbologyPreset,

	/**
	 * Natural features styling (green theme)
	 */
	naturalFeatures: {
		name: 'Natural Features',
		description: 'Green theme for parks, forests, and natural areas',
		point: {
			color: colors.success,
			fillColor: colors.success,
			radius: 6,
			weight: 2,
			fillOpacity: 0.7
		},
		line: {
			color: colors.success,
			weight: 2,
			opacity: 0.8,
			dashArray: [5, 5]
		},
		polygon: {
			fillColor: colors.success,
			fillOpacity: 0.2,
			color: colors.success,
			weight: 1,
			opacity: 1
		}
	} as SymbologyPreset,

	/**
	 * Utility networks styling (orange theme)
	 */
	utilities: {
		name: 'Utility Networks',
		description: 'Orange theme with dashed lines for utilities',
		point: {
			color: colors.warning,
			fillColor: colors.warning,
			radius: 8,
			weight: 2,
			fillOpacity: 0.8
		},
		line: {
			color: colors.warning,
			weight: 3,
			opacity: 1,
			dashArray: [10, 5]
		},
		polygon: {
			fillColor: colors.warning,
			fillOpacity: 0.2,
			color: colors.warning,
			weight: 2
		}
	} as SymbologyPreset,

	/**
	 * Transportation styling (blue theme)
	 */
	transportation: {
		name: 'Transportation',
		description: 'Blue theme for roads, railways, and transport nodes',
		point: {
			color: colors.info,
			fillColor: colors.info,
			radius: 8,
			weight: 2,
			fillOpacity: 0.8
		},
		line: {
			color: colors.info,
			weight: 3,
			opacity: 1
		},
		polygon: {
			fillColor: colors.info,
			fillOpacity: 0.2,
			color: colors.info,
			weight: 2
		}
	} as SymbologyPreset,

	/**
	 * Subdued/background styling
	 */
	background: {
		name: 'Background',
		description: 'Low-contrast gray theme for reference layers',
		point: {
			color: colors.gray500,
			fillColor: colors.gray300,
			radius: 5,
			weight: 1,
			fillOpacity: 0.5
		},
		line: {
			color: colors.gray400,
			weight: 1,
			opacity: 0.5
		},
		polygon: {
			fillColor: colors.gray200,
			fillOpacity: 0.3,
			color: colors.gray400,
			weight: 1,
			opacity: 0.5
		}
	} as SymbologyPreset
} as const;

/**
 * Preset factory functions for dynamic symbology
 */
export const symbologyFactories = {
	/**
	 * Create a status-based symbology preset
	 * Colors features based on a status field (e.g., 'active', 'inactive')
	 */
	statusBased: (config?: {
		statusField?: string;
		activeColor?: string;
		inactiveColor?: string;
		activeValue?: string;
	}): SymbologyPreset => {
		const statusField = config?.statusField || 'status';
		const activeColor = config?.activeColor || colors.success;
		const inactiveColor = config?.inactiveColor || colors.neutral;
		const activeValue = config?.activeValue || 'active';

		const isActive = (feature: GeoJSON.Feature) =>
			feature.properties?.[statusField] === activeValue;

		return {
			name: 'Status-Based',
			description: `Colors by ${statusField} field`,
			point: (feature) => ({
				color: isActive(feature) ? activeColor : inactiveColor,
				fillColor: isActive(feature) ? activeColor : inactiveColor,
				radius: 8,
				weight: 2,
				fillOpacity: isActive(feature) ? 0.8 : 0.5
			}),
			line: (feature) => ({
				color: isActive(feature) ? activeColor : inactiveColor,
				weight: 3,
				opacity: isActive(feature) ? 1 : 0.5
			}),
			polygon: (feature) => ({
				fillColor: isActive(feature) ? activeColor : inactiveColor,
				fillOpacity: isActive(feature) ? 0.3 : 0.15,
				color: isActive(feature) ? activeColor : inactiveColor,
				weight: 2,
				opacity: isActive(feature) ? 1 : 0.5
			})
		};
	},

	/**
	 * Create a category-based symbology preset
	 * Assigns colors based on categorical values in a field
	 */
	categorized: (config: {
		field: string;
		categories: Record<string, { color: string; label?: string }>;
		defaultColor?: string;
	}): SymbologyPreset => {
		const { field, categories, defaultColor = colors.neutral } = config;

		const getColor = (feature: GeoJSON.Feature) => {
			const category = feature.properties?.[field];
			return categories[category]?.color || defaultColor;
		};

		return {
			name: 'Categorized',
			description: `Colors by ${field} field categories`,
			point: (feature) => {
				const color = getColor(feature);
				return {
					color,
					fillColor: color,
					radius: 8,
					weight: 2,
					fillOpacity: 0.7
				};
			},
			line: (feature) => {
				const color = getColor(feature);
				return {
					color,
					weight: 3,
					opacity: 1
				};
			},
			polygon: (feature) => {
				const color = getColor(feature);
				return {
					fillColor: color,
					fillOpacity: 0.3,
					color,
					weight: 2,
					opacity: 1
				};
			}
		};
	},

	/**
	 * Create a graduated symbology preset based on numeric values
	 * Uses color ramps and size scaling
	 */
	graduated: (config: {
		field: string;
		breaks: number[];
		colors: string[];
		minSize?: number;
		maxSize?: number;
	}): SymbologyPreset => {
		const { field, breaks, colors: colorRamp, minSize = 4, maxSize = 12 } = config;

		const getColorIndex = (value: number): number => {
			for (let i = 0; i < breaks.length; i++) {
				if (value <= breaks[i]) return i;
			}
			return colorRamp.length - 1;
		};

		const getSize = (value: number): number => {
			const min = Math.min(...breaks);
			const max = Math.max(...breaks);
			const normalized = (value - min) / (max - min);
			return minSize + normalized * (maxSize - minSize);
		};

		return {
			name: 'Graduated',
			description: `Graduated by ${field} field`,
			point: (feature) => {
				const value = feature.properties?.[field] || 0;
				const colorIndex = getColorIndex(value);
				const color = colorRamp[colorIndex];
				const radius = getSize(value);

				return {
					color,
					fillColor: color,
					radius,
					weight: 2,
					fillOpacity: 0.7
				};
			},
			line: (feature) => {
				const value = feature.properties?.[field] || 0;
				const colorIndex = getColorIndex(value);
				const color = colorRamp[colorIndex];
				const weight = getSize(value) / 2;

				return {
					color,
					weight,
					opacity: 1
				};
			},
			polygon: (feature) => {
				const value = feature.properties?.[field] || 0;
				const colorIndex = getColorIndex(value);
				const color = colorRamp[colorIndex];

				return {
					fillColor: color,
					fillOpacity: 0.3,
					color,
					weight: 2,
					opacity: 1
				};
			}
		};
	},

	/**
	 * Create a heatmap-style symbology (for points primarily)
	 */
	heatmap: (config?: {
		minColor?: string;
		maxColor?: string;
		minRadius?: number;
		maxRadius?: number;
		field?: string;
	}): SymbologyPreset => {
		const {
			minColor = colors.info,
			maxColor = colors.critical,
			minRadius = 6,
			maxRadius = 14,
			field = 'value'
		} = config || {};

		return {
			name: 'Heatmap',
			description: 'Heatmap-style visualization',
			point: (feature) => {
				const value = feature.properties?.[field] || 0;
				// Simple interpolation (you could use a proper color interpolation library)
				const intensity = Math.min(Math.max(value / 100, 0), 1);
				const radius = minRadius + intensity * (maxRadius - minRadius);

				return {
					color: '#ffffff',
					fillColor: intensity > 0.5 ? maxColor : minColor,
					radius,
					weight: 1,
					fillOpacity: 0.6 + intensity * 0.3
				};
			}
		};
	}
};

/**
 * Helper function to create a custom preset
 */
export function createPreset(config: SymbologyPreset): SymbologyPreset {
	return config;
}

/**
 * Export type for easier imports
 */
export type { PointStyle, LineStyle, PolygonStyle };
