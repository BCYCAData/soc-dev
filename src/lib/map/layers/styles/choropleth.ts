import type { PolygonStyle } from '../schemas/layer-config.types';
import { interpolateColor, getColorFromPalette } from '$lib/map/layers/styles/index';

/**
 * Choropleth styling functions for data-driven color mapping
 * Used for coloring features based on numeric property values
 */

// ============================================================================
// COLOR SCHEMES
// ============================================================================

export const colorSchemes = {
	// Sequential schemes (light to dark)
	Blues: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
	Greens: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
	Reds: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c'],
	Oranges: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c'],
	Purples: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce'],
	Greys: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151'],

	// Diverging schemes (two hues meeting in middle)
	RedBlue: [
		'#b91c1c',
		'#dc2626',
		'#ef4444',
		'#f87171',
		'#fca5a5',
		'#bfdbfe',
		'#60a5fa',
		'#3b82f6',
		'#2563eb',
		'#1d4ed8'
	],
	RedGreen: [
		'#b91c1c',
		'#dc2626',
		'#ef4444',
		'#f87171',
		'#fca5a5',
		'#dcfce7',
		'#86efac',
		'#4ade80',
		'#22c55e',
		'#15803d'
	],
	PurpleGreen: [
		'#7e22ce',
		'#9333ea',
		'#a855f7',
		'#c084fc',
		'#e9d5ff',
		'#dcfce7',
		'#86efac',
		'#4ade80',
		'#22c55e',
		'#15803d'
	],

	// Spectral (rainbow-like for wide range)
	Spectral: [
		'#d53e4f',
		'#f46d43',
		'#fdae61',
		'#fee08b',
		'#ffffbf',
		'#e6f598',
		'#abdda4',
		'#66c2a5',
		'#3288bd'
	],

	// YlOrRd (yellow-orange-red, good for heat maps)
	YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026'],

	// Viridis (perceptually uniform, colorblind-friendly)
	Viridis: [
		'#440154',
		'#482878',
		'#3e4989',
		'#31688e',
		'#26828e',
		'#1f9e89',
		'#35b779',
		'#6ece58',
		'#b5de2b',
		'#fde724'
	]
};

// ============================================================================
// CLASSIFICATION METHODS
// ============================================================================

/**
 * Calculate breaks using equal interval method
 */
export function calculateEqualIntervalBreaks(values: number[], numClasses: number): number[] {
	if (values.length === 0) return [];

	const min = Math.min(...values);
	const max = Math.max(...values);
	const range = max - min;
	const interval = range / numClasses;

	const breaks: number[] = [];
	for (let i = 1; i < numClasses; i++) {
		breaks.push(min + interval * i);
	}

	return breaks;
}

/**
 * Calculate breaks using quantile method (equal count)
 */
export function calculateQuantileBreaks(values: number[], numClasses: number): number[] {
	if (values.length === 0) return [];

	const sorted = [...values].sort((a, b) => a - b);
	const breaks: number[] = [];

	for (let i = 1; i < numClasses; i++) {
		const index = Math.floor((sorted.length * i) / numClasses);
		breaks.push(sorted[index]);
	}

	return breaks;
}

/**
 * Calculate breaks using natural breaks (Jenks) method
 * Simplified implementation - for production, consider using a library like 'simple-statistics'
 */
export function calculateNaturalBreaks(values: number[], numClasses: number): number[] {
	if (values.length === 0) return [];

	// For simplicity, use quantiles as approximation
	// A true Jenks implementation requires iterative optimization
	return calculateQuantileBreaks(values, numClasses);
}

/**
 * Calculate breaks using standard deviation method
 */
export function calculateStdDevBreaks(values: number[], numClasses: number = 5): number[] {
	if (values.length === 0) return [];

	const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
	const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
	const stdDev = Math.sqrt(variance);

	const breaks: number[] = [];
	const halfClasses = Math.floor(numClasses / 2);

	for (let i = -halfClasses; i <= halfClasses; i++) {
		if (i !== 0) {
			breaks.push(mean + i * stdDev);
		}
	}

	return breaks.sort((a, b) => a - b);
}

// ============================================================================
// CHOROPLETH STYLE GENERATORS
// ============================================================================

/**
 * Create a choropleth style function
 */
export function createChoroplethStyle(config: {
	property: string;
	breaks: number[];
	colors: string[];
	method?: 'equal-interval' | 'quantile' | 'natural-breaks' | 'std-dev';
	baseStyle?: Partial<PolygonStyle>;
	nullColor?: string;
}) {
	const { property, breaks, colors, baseStyle = {}, nullColor = '#e5e7eb' } = config;

	return (feature: GeoJSON.Feature): PolygonStyle => {
		const value = feature.properties?.[property];

		// Handle null/undefined values
		if (value === null || value === undefined || isNaN(value)) {
			return {
				fillColor: nullColor,
				fillOpacity: 0.3,
				color: '#9ca3af',
				weight: 1,
				opacity: 0.5,
				...baseStyle
			};
		}

		// Find the appropriate color based on value
		let colorIndex = 0;
		for (let i = 0; i < breaks.length; i++) {
			if (value >= breaks[i]) {
				colorIndex = i + 1;
			}
		}

		const fillColor = colors[Math.min(colorIndex, colors.length - 1)];

		return {
			fillColor,
			fillOpacity: 0.7,
			color: '#ffffff',
			weight: 1,
			opacity: 0.5,
			...baseStyle
		};
	};
}

/**
 * Create a continuous gradient choropleth style (interpolated colors)
 */
export function createContinuousChoroplethStyle(config: {
	property: string;
	min?: number;
	max?: number;
	startColor: string;
	endColor: string;
	baseStyle?: Partial<PolygonStyle>;
	nullColor?: string;
}) {
	const {
		property,
		min,
		max,
		startColor,
		endColor,
		baseStyle = {},
		nullColor = '#e5e7eb'
	} = config;

	return (feature: GeoJSON.Feature, allFeatures?: GeoJSON.Feature[]): PolygonStyle => {
		const value = feature.properties?.[property];

		// Handle null/undefined values
		if (value === null || value === undefined || isNaN(value)) {
			return {
				fillColor: nullColor,
				fillOpacity: 0.3,
				color: '#9ca3af',
				weight: 1,
				opacity: 0.5,
				...baseStyle
			};
		}

		// Calculate min/max if not provided
		let minValue = min;
		let maxValue = max;

		if (allFeatures && (minValue === undefined || maxValue === undefined)) {
			const values = allFeatures
				.map((f) => f.properties?.[property])
				.filter((v) => v !== null && v !== undefined && !isNaN(v));

			if (minValue === undefined) minValue = Math.min(...values);
			if (maxValue === undefined) maxValue = Math.max(...values);
		}

		if (minValue === undefined || maxValue === undefined) {
			minValue = minValue || 0;
			maxValue = maxValue || 1;
		}

		// Calculate interpolation factor
		const range = maxValue - minValue;
		const factor = range === 0 ? 0 : (value - minValue) / range;
		const clampedFactor = Math.max(0, Math.min(1, factor));

		const fillColor = interpolateColor(startColor, endColor, clampedFactor);

		return {
			fillColor,
			fillOpacity: 0.7,
			color: '#ffffff',
			weight: 1,
			opacity: 0.5,
			...baseStyle
		};
	};
}

/**
 * Auto-generate choropleth style from data
 */
export function autoGenerateChoroplethStyle(
	features: GeoJSON.Feature[],
	property: string,
	options: {
		numClasses?: number;
		method?: 'equal-interval' | 'quantile' | 'natural-breaks' | 'std-dev';
		colorScheme?: keyof typeof colorSchemes;
		baseStyle?: Partial<PolygonStyle>;
	} = {}
) {
	const { numClasses = 5, method = 'quantile', colorScheme = 'Blues', baseStyle = {} } = options;

	// Extract values
	const values = features
		.map((f) => f.properties?.[property])
		.filter((v) => v !== null && v !== undefined && !isNaN(v));

	if (values.length === 0) {
		throw new Error(`No valid numeric values found for property: ${property}`);
	}

	// Calculate breaks
	let breaks: number[];
	switch (method) {
		case 'equal-interval':
			breaks = calculateEqualIntervalBreaks(values, numClasses);
			break;
		case 'natural-breaks':
			breaks = calculateNaturalBreaks(values, numClasses);
			break;
		case 'std-dev':
			breaks = calculateStdDevBreaks(values, numClasses);
			break;
		case 'quantile':
		default:
			breaks = calculateQuantileBreaks(values, numClasses);
			break;
	}

	// Get colors
	const colors = colorSchemes[colorScheme] || colorSchemes.Blues;

	// Select appropriate number of colors
	const selectedColors = selectColors(colors, numClasses);

	return createChoroplethStyle({
		property,
		breaks,
		colors: selectedColors,
		baseStyle
	});
}

/**
 * Select appropriate colors from a color scheme based on number of classes
 */
function selectColors(colors: string[], numClasses: number): string[] {
	if (numClasses >= colors.length) {
		return colors;
	}

	// Select evenly spaced colors from the scheme
	const step = (colors.length - 1) / (numClasses - 1);
	const selected: string[] = [];

	for (let i = 0; i < numClasses; i++) {
		const index = Math.round(i * step);
		selected.push(colors[index]);
	}

	return selected;
}

// ============================================================================
// LEGEND GENERATION
// ============================================================================

/**
 * Generate legend data for choropleth map
 */
export function generateChoroplethLegend(config: {
	property: string;
	breaks: number[];
	colors: string[];
	labelFormatter?: (value: number) => string;
	title?: string;
}) {
	const { property, breaks, colors, labelFormatter = (v) => v.toLocaleString(), title } = config;

	const items: Array<{ color: string; label: string; min?: number; max?: number }> = [];

	// First class (below first break)
	items.push({
		color: colors[0],
		label: `< ${labelFormatter(breaks[0])}`,
		max: breaks[0]
	});

	// Middle classes
	for (let i = 0; i < breaks.length - 1; i++) {
		items.push({
			color: colors[i + 1],
			label: `${labelFormatter(breaks[i])} - ${labelFormatter(breaks[i + 1])}`,
			min: breaks[i],
			max: breaks[i + 1]
		});
	}

	// Last class (above last break)
	items.push({
		color: colors[colors.length - 1],
		label: `> ${labelFormatter(breaks[breaks.length - 1])}`,
		min: breaks[breaks.length - 1]
	});

	return {
		title: title || property,
		items
	};
}

/**
 * Generate legend for continuous choropleth
 */
export function generateContinuousLegend(config: {
	property: string;
	min: number;
	max: number;
	startColor: string;
	endColor: string;
	steps?: number;
	labelFormatter?: (value: number) => string;
	title?: string;
}) {
	const {
		property,
		min,
		max,
		startColor,
		endColor,
		steps = 5,
		labelFormatter = (v) => v.toLocaleString(),
		title
	} = config;

	const items: Array<{ color: string; label: string; value: number }> = [];

	for (let i = 0; i < steps; i++) {
		const factor = i / (steps - 1);
		const value = min + (max - min) * factor;
		const color = interpolateColor(startColor, endColor, factor);

		items.push({
			color,
			label: labelFormatter(value),
			value
		});
	}

	return {
		title: title || property,
		items,
		type: 'continuous' as const
	};
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get statistics for a property across features
 */
export function getPropertyStats(features: GeoJSON.Feature[], property: string) {
	const values = features
		.map((f) => f.properties?.[property])
		.filter((v) => v !== null && v !== undefined && !isNaN(v));

	if (values.length === 0) {
		return null;
	}

	const sorted = [...values].sort((a, b) => a - b);
	const min = sorted[0];
	const max = sorted[sorted.length - 1];
	const mean = values.reduce((sum, v) => sum + v, 0) / values.length;

	const median =
		sorted.length % 2 === 0
			? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
			: sorted[Math.floor(sorted.length / 2)];

	const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
	const stdDev = Math.sqrt(variance);

	return {
		min,
		max,
		mean,
		median,
		stdDev,
		count: values.length,
		range: max - min
	};
}

/**
 * Suggest optimal number of classes based on data
 */
export function suggestNumClasses(numFeatures: number): number {
	if (numFeatures < 10) return 3;
	if (numFeatures < 30) return 4;
	if (numFeatures < 100) return 5;
	if (numFeatures < 500) return 6;
	return 7;
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default {
	colorSchemes,
	calculateEqualIntervalBreaks,
	calculateQuantileBreaks,
	calculateNaturalBreaks,
	calculateStdDevBreaks,
	createChoroplethStyle,
	createContinuousChoroplethStyle,
	autoGenerateChoroplethStyle,
	generateChoroplethLegend,
	generateContinuousLegend,
	getPropertyStats,
	suggestNumClasses
};
