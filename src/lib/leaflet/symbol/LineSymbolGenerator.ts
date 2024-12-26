import { GRADIENTS } from '$lib/leaflet/symbol/shapes';
import { createSVGWrapper } from '$lib/leaflet/symbol/svg';
import type { LineSymbologyOptions } from '$lib/leaflet/types';

export class LineSymbolGenerator {
	static generate(options: LineSymbologyOptions): string {
		const pattern = this.getLinePattern(options);
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
            ${this.createArrowhead(options)}
        `;

		return createSVGWrapper(content, 20, 4);
	}

	static createStyle(options: LineSymbologyOptions): L.PathOptions {
		const style: L.PathOptions = {
			color: options.color || '#3388ff',
			weight: options.width || 3,
			opacity: options.opacity || 1,
			lineCap: options.lineCap || 'round',
			lineJoin: options.lineJoin || 'round'
		};

		if (options.pattern) {
			style.dashArray = this.getDashArray(options.pattern);
		}

		return style;
	}

	private static getLinePattern(options: LineSymbologyOptions): string {
		if (!options.pattern) return '';
		return `stroke-dasharray="${this.getDashArray(options.pattern, true)}"`;
	}

	private static getDashArray(pattern: string, forSVG = false): string {
		const scale = forSVG ? 0.4 : 1;
		const patterns = {
			dashed: `${10 * scale}, ${10 * scale}`,
			dotted: `${2 * scale}, ${8 * scale}`,
			dashdot: `${10 * scale}, ${5 * scale}, ${2 * scale}, ${5 * scale}`
		};
		return patterns[pattern as keyof typeof patterns] || '';
	}

	private static createArrowhead(options: LineSymbologyOptions): string {
		if (!options.arrowheads) return '';
		return `
            <path d="M16,0 L20,2 L16,4" 
                fill="none" 
                stroke="${options.color || '#3388ff'}" 
                stroke-width="1"
            />
        `;
	}
}
