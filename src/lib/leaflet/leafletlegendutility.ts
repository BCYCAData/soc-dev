import { PATTERNS, GRADIENTS, SHAPE_TEMPLATES } from '$lib/leaflet/symbol/shapes';
import { createSVGWrapper, createDefs } from '$lib/leaflet/symbol/svg';
import { pointTemplateStyles } from '$lib/leaflet/symbol/leaflet-template-symbol';

import type {
	ExtendedPointSymbologyOptions,
	ExtendedPolygonSymbologyOptions,
	EnhancedPathOptions,
	LineSymbologyOptions
} from './types';

class SymbologyGenerator {
	static calculatePointSymbolSize(symbolOptions: ExtendedPointSymbologyOptions): number {
		if (symbolOptions?.options?.type === 'circleMarker') {
			const { radius = 3, weight = 0 } = symbolOptions.options.options || {};
			return (radius + weight) * 2 + 2;
		}
		return 10;
	}

	static createPointSymbol(
		symbolOptions: ExtendedPointSymbologyOptions,
		legendBaseSize?: number,
		template_name?: string
	): string {
		// Get template style using template name
		const templateStyle = template_name ? pointTemplateStyles[template_name] : null;

		if (templateStyle) {
			const size = templateStyle.size || 12;
			const color = templateStyle.fillColour || '#3388ff';
			const shape = templateStyle.markerShape as keyof typeof SHAPE_TEMPLATES;

			if (shape && SHAPE_TEMPLATES[shape]) {
				const shapeTemplate = SHAPE_TEMPLATES[shape];
				const content = shapeTemplate(size, color);
				return createSVGWrapper(content, size, size);
			}
		}

		// Original symbol generation logic for fallback
		const baseSize = legendBaseSize || SymbologyGenerator.calculatePointSymbolSize(symbolOptions);

		if (symbolOptions.options?.type === 'divIcon') {
			const { options: iconOptions } = symbolOptions;
			const size = iconOptions?.options?.iconSize?.[0] || baseSize;
			const color = iconOptions?.color || '#3388ff';
			const shape = iconOptions?.markerShape as keyof typeof SHAPE_TEMPLATES;

			const shapeTemplate = SHAPE_TEMPLATES[shape] || SHAPE_TEMPLATES.square;
			const content = shapeTemplate(size, color);

			return createSVGWrapper(content, size, size);
		}

		return createSVGWrapper(
			`<circle cx="${baseSize / 2}" cy="${baseSize / 2}" r="4" fill="gray"/>`,
			baseSize,
			baseSize
		);
	}

	static createLineStyle(options: LineSymbologyOptions): L.PathOptions {
		const style: L.PathOptions = {
			color: options.color || '#3388ff',
			weight: options.width || 3,
			opacity: options.opacity || 1,
			lineCap: options.lineCap || 'round',
			lineJoin: options.lineJoin || 'round'
		};

		if (options?.pattern && options.pattern !== 'solid') {
			const dashArray = SymbologyGenerator.getLineDashArray(options.pattern);
			if (dashArray) {
				style.dashArray = dashArray;
			}
		}

		return style;
	}

	static createLineSymbol(options: LineSymbologyOptions): string {
		const pattern =
			options.pattern && options.pattern !== 'solid'
				? `stroke-dasharray="${SymbologyGenerator.getLineDashArray(options.pattern, true)}"`
				: '';
		const gradient = options.gradient
			? GRADIENTS.linear('lineGradient', options.color || '#3388ff')
			: '';

		const content = `
        ${gradient}
        <line x1="0" y1="2" x2="20" y2="2"
            stroke="${options.gradient ? 'url(#lineGradient)' : options.color || '#3388ff'}"
            stroke-width="${options.width || 2}"
            ${pattern}
            stroke-linecap="${options.lineCap || 'round'}"
            stroke-linejoin="${options.lineJoin || 'round'}"
        />
        ${
					options.arrowheads
						? `
                <path d="M16,0 L20,2 L16,4" 
                    fill="none" 
                    stroke="${options.color || '#3388ff'}" 
                    stroke-width="1"
                />`
						: ''
				}
    `;

		return createSVGWrapper(content, 20, 4);
	}

	static createPolygonStyle(options: ExtendedPolygonSymbologyOptions): EnhancedPathOptions {
		return {
			fillColor: options.fillColor || '#3388ff',
			fillOpacity: options.fillOpacity || 0.2,
			color: options.color || '#3388ff',
			weight: options.weight || 3,
			opacity: options.opacity || 1,
			dashArray: options.dashArray,
			dashOffset: options.dashOffset,
			fillPattern: options.fillPattern,
			gradient: options.gradient
		};
	}

	static createPolygonSymbol(options: ExtendedPolygonSymbologyOptions): string {
		const patternId = `pattern-${options?.fillColor?.replace('#', '')}`;
		const fillType = options?.fillPattern || 'solid';

		const patterns = [];
		if (fillType !== 'solid' && fillType in PATTERNS) {
			patterns.push(PATTERNS[fillType](patternId, options?.fillColor || '#000'));
		}
		if (options?.gradient && options.gradient in GRADIENTS) {
			patterns.push(GRADIENTS[options.gradient](patternId, options?.fillColor || '#000'));
		}

		const content = `
        ${patterns.length > 0 ? createDefs(patterns) : ''}
        <rect x="2" y="2" width="16" height="16"
            fill="${SymbologyGenerator.getFillStyle(fillType, patternId, options)}"
            fill-opacity="${options?.fillOpacity || 0.2}"
            stroke="${options?.color || '#000'}"
            stroke-width="${options?.weight || 1}"
            ${options?.dashArray ? `stroke-dasharray="${options.dashArray}"` : ''}
        />
    `;

		return createSVGWrapper(content, 20, 20);
	}

	private static getFillStyle(fillType: string, patternId: string, options: any): string {
		if (fillType !== 'solid') {
			return `url(#${patternId}-${fillType})`;
		}
		if (options?.gradient) {
			return `url(#${patternId}-${options.gradient})`;
		}
		return options?.fillColor || '#000';
	}

	private static getLineDashArray(pattern: string, forSVG = false): string {
		if (!pattern) return '';
		const scale = forSVG ? 0.4 : 1;
		const patterns = {
			solid: '',
			dashed: `${10 * scale}, ${10 * scale}`,
			dotted: `${2 * scale}, ${8 * scale}`,
			dashdot: `${10 * scale}, ${5 * scale}, ${2 * scale}, ${5 * scale}`
		};
		return patterns[pattern as keyof typeof patterns] || '';
	}
}

export const {
	createPointSymbol,
	createLineStyle,
	createLineSymbol,
	createPolygonStyle,
	createPolygonSymbol
} = SymbologyGenerator;

export function generateUniqueColorForKey(key: string, existingColors: Color[]): string {
	let color = hashStringToColor(key);
	color = ensureUniqueColor(color, existingColors);

	// Convert color object to hex string
	const toHex = (value: number) => value.toString(16).padStart(2, '0');
	return '#' + toHex(color.r) + toHex(color.g) + toHex(color.b);
}

function hashStringToColor(input: string): Color {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = input.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Convert hash to RGB color
	const r = (hash & 0xff0000) >> 16;
	const g = (hash & 0x00ff00) >> 8;
	const b = hash & 0x0000ff;

	return { r, g, b };
}

function ensureUniqueColor(color: Color, existingColors: Color[]): Color {
	// Simple check for exact match; could be enhanced for "near-match"
	for (const existingColor of existingColors) {
		if (existingColor.r === color.r && existingColor.g === color.g && existingColor.b === color.b) {
			// Collision detected; adjust color slightly
			return { r: color.r, g: color.g, b: (color.b + 1) % 256 };
		}
	}
	return color; // No collision
}

export interface Color {
	r: number;
	g: number;
	b: number;
}
