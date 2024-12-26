import { PATTERNS, GRADIENTS } from '$lib/leaflet/symbol/shapes';
import { createSVGWrapper, createDefs } from '$lib/leaflet/symbol/svg';
import type { ExtendedPolygonSymbologyOptions, EnhancedPathOptions } from '../types';

export class PolygonSymbolGenerator {
	static generate(options: ExtendedPolygonSymbologyOptions): string {
		const patternId = `pattern-${options.fillColor?.replace('#', '')}`;
		const fillType = options.fillPattern || 'solid';

		const patterns = [];
		if (fillType !== 'solid' && fillType in PATTERNS) {
			patterns.push(PATTERNS[fillType](patternId, options.fillColor || '#000'));
		}
		if (options.gradient && options.gradient in GRADIENTS) {
			patterns.push(GRADIENTS[options.gradient](patternId, options.fillColor || '#000'));
		}

		const content = `
            ${patterns.length > 0 ? createDefs(patterns) : ''}
            <rect x="2" y="2" width="16" height="16"
                fill="${this.getFillStyle(fillType, patternId, options)}"
                fill-opacity="${options.fillOpacity || 0.2}"
                stroke="${options.color || '#000'}"
                stroke-width="${options.weight || 1}"
                ${options.dashArray ? `stroke-dasharray="${options.dashArray}"` : ''}
            />
        `;

		return createSVGWrapper(content, 20, 20);
	}

	static createStyle(options: ExtendedPolygonSymbologyOptions): EnhancedPathOptions {
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

	private static getFillStyle(
		fillType: string,
		patternId: string,
		options: ExtendedPolygonSymbologyOptions
	): string {
		if (fillType !== 'solid') {
			return `url(#${patternId}-${fillType})`;
		}
		if (options.gradient) {
			return `url(#${patternId}-${options.gradient})`;
		}
		return options.fillColor || '#000';
	}
}
