import { PATTERNS, GRADIENTS, SHAPE_TEMPLATES } from '$lib/leaflet/symbol/shapes';
import { createSVGWrapper, createDefs } from '$lib/leaflet/symbol/svg';
import type { ExtendedPointSymbologyOptions } from '../types';

export class PointSymbolGenerator {
	static generate(options: ExtendedPointSymbologyOptions, baseSize: number): string {
		const size = baseSize || this.calculateSymbolSize(options);

		if (options.options.type === 'circleMarker') {
			return this.generateCircleMarker(options, size);
		}
		if (options.options.type === 'divIcon') {
			return this.generateDivIcon(options, size);
		}
		return this.generateDefault(size);
	}

	private static calculateSymbolSize(options: ExtendedPointSymbologyOptions): number {
		if (options.options.type === 'circleMarker') {
			const { radius = 3, weight = 0 } = options.options.options;
			return (radius + weight) * 2 + 2;
		}
		return 10;
	}

	private static generateCircleMarker(
		options: ExtendedPointSymbologyOptions,
		size: number
	): string {
		const { options: circleOptions } = options.options;
		const hasStroke = circleOptions.weight && circleOptions.weight > 0;
		const patternId = `pattern-${circleOptions.fillColor?.replace('#', '')}`;
		const fillType = circleOptions.fillPattern || 'solid';

		const patterns = [];
		if (fillType !== 'solid' && fillType in PATTERNS) {
			patterns.push(
				PATTERNS[fillType as keyof typeof PATTERNS](patternId, circleOptions.fillColor || '#000')
			);
		}
		if (circleOptions.gradient && circleOptions.gradient in GRADIENTS) {
			patterns.push(
				GRADIENTS[circleOptions.gradient](patternId, circleOptions.fillColor || '#000')
			);
		}

		const content = `
            ${patterns.length > 0 ? createDefs(patterns) : ''}
            ${
							hasStroke
								? `<circle cx="${size / 2}" cy="${size / 2}" r="${(circleOptions.radius || 0) + 1}" 
                    fill="${circleOptions.color}"/>`
								: ''
						}
            <circle cx="${size / 2}" cy="${size / 2}" r="${circleOptions.radius || 0}" 
                fill="${this.getFillStyle(fillType, patternId, circleOptions)}"
                fill-opacity="${circleOptions.fillOpacity || 1}"/>
        `;

		return createSVGWrapper(content, size, size);
	}

	private static generateDivIcon(options: ExtendedPointSymbologyOptions, size: number): string {
		const { options: iconOptions } = options;
		const iconSize = iconOptions.options?.iconSize?.[0] || size;
		const color = iconOptions.color || '#3388ff';
		const shape = iconOptions.markerShape as keyof typeof SHAPE_TEMPLATES;

		const shapeTemplate = SHAPE_TEMPLATES[shape] || SHAPE_TEMPLATES.square;
		const content = `
            ${shapeTemplate(iconSize, color)}
            ${
							iconOptions.options?.stroke
								? `<path d="${shapeTemplate(iconSize, color)}" fill="none" stroke="black" stroke-width="1"/>`
								: ''
						}
        `;

		return createSVGWrapper(content, iconSize, iconSize);
	}

	private static generateDefault(size: number): string {
		const content = `<circle cx="${size / 2}" cy="${size / 2}" r="4" fill="gray"/>`;
		return createSVGWrapper(content, size, size);
	}

	private static getFillStyle(fillType: string, patternId: string, options: any): string {
		if (fillType !== 'solid') {
			return `url(#${patternId}-${fillType})`;
		}
		if (options.gradient) {
			return `url(#${patternId}-${options.gradient})`;
		}
		return options.fillColor || '#000';
	}
}
