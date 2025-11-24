/**
 * Common style presets and utilities for map layers
 */

import type { PointStyle, LineStyle, PolygonStyle } from '../schemas/layer-config.types';

// ============================================================================
// COLOR PALETTES
// ============================================================================

/**
 * Common color palettes for theming
 */
export const colorPalettes = {
	// Sequential (single hue, light to dark)
	blues: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'],
	greens: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d'],
	reds: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c'],
	oranges: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c'],
	purples: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce'],

	// Diverging (two hues, for showing deviation from center)
	redBlue: ['#b91c1c', '#dc2626', '#ef4444', '#f87171', '#dbeafe', '#60a5fa', '#3b82f6', '#1d4ed8'],
	redGreen: [
		'#b91c1c',
		'#dc2626',
		'#ef4444',
		'#f87171',
		'#dcfce7',
		'#4ade80',
		'#22c55e',
		'#15803d'
	],
	orangeBlue: [
		'#c2410c',
		'#ea580c',
		'#f97316',
		'#fb923c',
		'#dbeafe',
		'#60a5fa',
		'#3b82f6',
		'#1d4ed8'
	],

	// Categorical (distinct colors for categories)
	categorical: [
		'#3b82f6',
		'#ef4444',
		'#22c55e',
		'#f59e0b',
		'#8b5cf6',
		'#ec4899',
		'#14b8a6',
		'#f97316'
	],
	categoryPastel: [
		'#93c5fd',
		'#fca5a5',
		'#86efac',
		'#fcd34d',
		'#c084fc',
		'#f9a8d4',
		'#5eead4',
		'#fdba74'
	],

	// Traffic light
	trafficLight: ['#22c55e', '#f59e0b', '#ef4444'],

	// Viridis-inspired (colorblind-friendly)
	viridis: [
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
// POINT STYLE PRESETS
// ============================================================================

export const pointStyles = {
	default: {
		radius: 6,
		fillColor: '#3b82f6',
		fillOpacity: 0.7,
		color: '#ffffff',
		weight: 2,
		opacity: 1
	} as PointStyle,

	small: {
		radius: 4,
		fillColor: '#3b82f6',
		fillOpacity: 0.7,
		color: '#ffffff',
		weight: 1,
		opacity: 1
	} as PointStyle,

	large: {
		radius: 10,
		fillColor: '#3b82f6',
		fillOpacity: 0.8,
		color: '#ffffff',
		weight: 3,
		opacity: 1
	} as PointStyle,

	marker: {
		radius: 8,
		fillColor: '#ef4444',
		fillOpacity: 0.9,
		color: '#ffffff',
		weight: 2,
		opacity: 1
	} as PointStyle,

	highlight: {
		radius: 8,
		fillColor: '#f59e0b',
		fillOpacity: 1,
		color: '#ffffff',
		weight: 3,
		opacity: 1
	} as PointStyle,

	subtle: {
		radius: 5,
		fillColor: '#94a3b8',
		fillOpacity: 0.5,
		color: '#64748b',
		weight: 1,
		opacity: 0.8
	} as PointStyle
};

// ============================================================================
// LINE STYLE PRESETS
// ============================================================================

export const lineStyles = {
	default: {
		color: '#3b82f6',
		weight: 3,
		opacity: 0.8,
		lineCap: 'round' as const,
		lineJoin: 'round' as const
	} as LineStyle,

	thin: {
		color: '#3b82f6',
		weight: 1,
		opacity: 0.7,
		lineCap: 'round' as const,
		lineJoin: 'round' as const
	} as LineStyle,

	thick: {
		color: '#3b82f6',
		weight: 5,
		opacity: 0.9,
		lineCap: 'round' as const,
		lineJoin: 'round' as const
	} as LineStyle,

	highway: {
		color: '#dc2626',
		weight: 5,
		opacity: 1,
		lineCap: 'butt' as const,
		lineJoin: 'round' as const
	} as LineStyle,

	road: {
		color: '#64748b',
		weight: 3,
		opacity: 0.8,
		lineCap: 'round' as const,
		lineJoin: 'round' as const
	} as LineStyle,

	path: {
		color: '#94a3b8',
		weight: 2,
		opacity: 0.6,
		dashArray: '5, 5',
		lineCap: 'round' as const,
		lineJoin: 'round' as const
	} as LineStyle,

	boundary: {
		color: '#1f2937',
		weight: 2,
		opacity: 0.9,
		dashArray: '10, 5',
		lineCap: 'butt' as const,
		lineJoin: 'miter' as const
	} as LineStyle,

	river: {
		color: '#3b82f6',
		weight: 4,
		opacity: 0.7,
		lineCap: 'round' as const,
		lineJoin: 'round' as const
	} as LineStyle
};

// ============================================================================
// POLYGON STYLE PRESETS
// ============================================================================

export const polygonStyles = {
	default: {
		fillColor: '#3b82f6',
		fillOpacity: 0.4,
		color: '#2563eb',
		weight: 2,
		opacity: 0.8
	} as PolygonStyle,

	light: {
		fillColor: '#93c5fd',
		fillOpacity: 0.3,
		color: '#3b82f6',
		weight: 1,
		opacity: 0.6
	} as PolygonStyle,

	solid: {
		fillColor: '#3b82f6',
		fillOpacity: 0.7,
		color: '#1e40af',
		weight: 2,
		opacity: 1
	} as PolygonStyle,

	parcel: {
		fillColor: '#3b82f6',
		fillOpacity: 0.3,
		color: '#2563eb',
		weight: 2,
		opacity: 0.8
	} as PolygonStyle,

	building: {
		fillColor: '#64748b',
		fillOpacity: 0.6,
		color: '#475569',
		weight: 1,
		opacity: 0.9
	} as PolygonStyle,

	zone: {
		fillColor: '#22c55e',
		fillOpacity: 0.2,
		color: '#16a34a',
		weight: 2,
		opacity: 0.7
	} as PolygonStyle,

	park: {
		fillColor: '#22c55e',
		fillOpacity: 0.4,
		color: '#16a34a',
		weight: 1,
		opacity: 0.6
	} as PolygonStyle,

	water: {
		fillColor: '#3b82f6',
		fillOpacity: 0.5,
		color: '#2563eb',
		weight: 1,
		opacity: 0.7
	} as PolygonStyle
};

// ============================================================================
// HOVER STYLE PRESETS
// ============================================================================

export const hoverStyles = {
	point: {
		radius: 8,
		fillOpacity: 1,
		weight: 3
	},

	line: {
		weight: 5,
		opacity: 1
	},

	polygon: {
		fillOpacity: 0.6,
		weight: 3,
		opacity: 1
	}
};

// ============================================================================
// SELECTION STYLE PRESETS
// ============================================================================

export const selectionStyles = {
	point: {
		radius: 10,
		fillColor: '#f59e0b',
		fillOpacity: 1,
		color: '#ffffff',
		weight: 3
	} as PointStyle,

	line: {
		color: '#f59e0b',
		weight: 5,
		opacity: 1
	} as LineStyle,

	polygon: {
		fillColor: '#f59e0b',
		fillOpacity: 0.6,
		color: '#f59e0b',
		weight: 3,
		opacity: 1
	} as PolygonStyle
};

// ============================================================================
// STYLE UTILITIES
// ============================================================================

/**
 * Merge style objects
 */
export function mergeStyles<T extends Record<string, any>>(base: T, override: Partial<T>): T {
	return { ...base, ...override };
}

/**
 * Create a style with opacity adjustment
 */
export function withOpacity<T extends { opacity?: number; fillOpacity?: number }>(
	style: T,
	opacityMultiplier: number
): T {
	const result = { ...style };

	if (style.opacity !== undefined) {
		result.opacity = style.opacity * opacityMultiplier;
	}

	if (style.fillOpacity !== undefined) {
		result.fillOpacity = style.fillOpacity * opacityMultiplier;
	}

	return result;
}

/**
 * Create a style with color adjustment
 */
export function withColor<T extends { color?: string; fillColor?: string }>(
	style: T,
	color: string,
	fillColor?: string
): T {
	return {
		...style,
		color,
		fillColor: fillColor || color
	};
}

/**
 * Create a style with weight adjustment
 */
export function withWeight<T extends { weight?: number }>(style: T, weight: number): T {
	return {
		...style,
		weight
	};
}

/**
 * Lighten a hex color
 */
export function lightenColor(hex: string, percent: number): string {
	// Remove # if present
	hex = hex.replace('#', '');

	// Convert to RGB
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	// Lighten
	const newR = Math.min(255, Math.floor(r + ((255 - r) * percent) / 100));
	const newG = Math.min(255, Math.floor(g + ((255 - g) * percent) / 100));
	const newB = Math.min(255, Math.floor(b + ((255 - b) * percent) / 100));

	// Convert back to hex
	return '#' + [newR, newG, newB].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Darken a hex color
 */
export function darkenColor(hex: string, percent: number): string {
	// Remove # if present
	hex = hex.replace('#', '');

	// Convert to RGB
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	// Darken
	const newR = Math.max(0, Math.floor(r * (1 - percent / 100)));
	const newG = Math.max(0, Math.floor(g * (1 - percent / 100)));
	const newB = Math.max(0, Math.floor(b * (1 - percent / 100)));

	// Convert back to hex
	return '#' + [newR, newG, newB].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Convert hex color to RGB with alpha
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
	hex = hex.replace('#', '');

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Interpolate between two colors
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
	// Remove # if present
	color1 = color1.replace('#', '');
	color2 = color2.replace('#', '');

	// Convert to RGB
	const r1 = parseInt(color1.substring(0, 2), 16);
	const g1 = parseInt(color1.substring(2, 4), 16);
	const b1 = parseInt(color1.substring(4, 6), 16);

	const r2 = parseInt(color2.substring(0, 2), 16);
	const g2 = parseInt(color2.substring(2, 4), 16);
	const b2 = parseInt(color2.substring(4, 6), 16);

	// Interpolate
	const r = Math.round(r1 + (r2 - r1) * factor);
	const g = Math.round(g1 + (g2 - g1) * factor);
	const b = Math.round(b1 + (b2 - b1) * factor);

	// Convert back to hex
	return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Get contrast color (black or white) for a given background color
 */
export function getContrastColor(hex: string): string {
	// Remove # if present
	hex = hex.replace('#', '');

	// Convert to RGB
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);

	// Calculate relative luminance
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	// Return black or white based on luminance
	return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Create a gradient of colors
 */
export function createColorGradient(startColor: string, endColor: string, steps: number): string[] {
	const colors: string[] = [];

	for (let i = 0; i < steps; i++) {
		const factor = i / (steps - 1);
		colors.push(interpolateColor(startColor, endColor, factor));
	}

	return colors;
}

/**
 * Get color from palette by index (with wrapping)
 */
export function getColorFromPalette(palette: string[], index: number): string {
	return palette[index % palette.length];
}

// ============================================================================
// STYLE VALIDATORS
// ============================================================================

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
	return /^#[0-9A-F]{6}$/i.test(color);
}

/**
 * Validate opacity value
 */
export function isValidOpacity(opacity: number): boolean {
	return opacity >= 0 && opacity <= 1;
}

/**
 * Clamp opacity to valid range
 */
export function clampOpacity(opacity: number): number {
	return Math.max(0, Math.min(1, opacity));
}

/**
 * Validate weight value
 */
export function isValidWeight(weight: number): boolean {
	return weight >= 0 && weight <= 20;
}

/**
 * Clamp weight to valid range
 */
export function clampWeight(weight: number): number {
	return Math.max(0, Math.min(20, weight));
}

// ============================================================================
// EXPORT EVERYTHING
// ============================================================================

export const styles = {
	point: pointStyles,
	line: lineStyles,
	polygon: polygonStyles,
	hover: hoverStyles,
	selection: selectionStyles
};

export { default as choropleth } from './choropleth';
export { default as categorized } from './categorized';
