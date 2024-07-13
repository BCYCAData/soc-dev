export type LeafletMarkerStyle = {
	shape:
		| 'square'
		| 'rectangle'
		| 'rhombus'
		| 'triangle'
		| 'circle'
		| 'pentagon'
		| 'hexagon'
		| 'octogon'
		| 'diamond';
	width: number;
	height: number;
	borderColor: string;
	borderWidth: number;
	borderStyle:
		| 'none'
		| 'hidden'
		| 'dotted'
		| 'dashed'
		| 'solid'
		| 'double'
		| 'groove'
		| 'ridge'
		| 'inset'
		| 'outset';
	fillColor: string;
	fillImage: string;
};
export type LeafletBorderStyle = {
	show: boolean;
	color: string; // '#3388ff'	//Stroke color
	weight: number; //	3	Stroke width in pixels
	opacity: number; //	1.0	Stroke opacity
	lineCap: string; //'round'	A string that defines shape to be used at the end of the stroke.
	lineJoin: string; //	'round'	A string that defines shape to be used at the corners of the stroke.
	dashArray: string | null; //	null	A string that defines the stroke dash pattern. Doesn't work on Canvas-powered layers in some old browsers.
	dashOffset: string; //
};
export type LeafletAreaStyle = {
	show: boolean;
	color: string; // '#3388ff'	//Fill color
	opacity: number; //	1.0	Fill opacity
};
export class LeafletStyleMaker {
	marker?: LeafletMarkerStyle;
	border?: LeafletBorderStyle;
	fill?: LeafletAreaStyle;

	constructor(marker?: LeafletMarkerStyle, border?: LeafletBorderStyle, fill?: LeafletAreaStyle) {
		this.marker = marker;
		this.border = border;
		this.fill = fill;
	}

	public getStyle(): LeafletMarkerStyle | LeafletBorderStyle | LeafletAreaStyle | undefined {
		if (this.marker && !this.border && !this.fill) {
			// Return Marker Style as a divIcon
			// Return Legend Marker Patch
			return this.marker;
		} else if (!this.marker && !this.fill && this.border) {
			// Return Border Style
			// Return Legend Line Patch
			return this.border;
		} else if (!this.marker && this.border && this.fill) {
			// Return Area Style using fill and border
			// Return Legend Area Patch

			return this.fill;
		}
		// Optionally, handle the case where none of the conditions are met
		return undefined;
	}

	public static createMarkerStyle(
		shape:
			| 'square'
			| 'rectangle'
			| 'rhombus'
			| 'triangle'
			| 'circle'
			| 'pentagon'
			| 'hexagon'
			| 'octogon'
			| 'diamond' = 'circle',
		width: number = 8,
		height: number = 8,
		borderColor: string = '#000000',
		borderWidth: number = 1,
		borderStyle:
			| 'none'
			| 'hidden'
			| 'dotted'
			| 'dashed'
			| 'solid'
			| 'double'
			| 'groove'
			| 'ridge'
			| 'inset'
			| 'outset' = 'solid',
		fillColor: string = 'transparent',
		fillImage: string = ''
	): LeafletMarkerStyle {
		return {
			shape,
			width,
			height,
			borderColor,
			borderWidth,
			borderStyle,
			fillColor,
			fillImage
		};
	}

	public static createBorderStyle(
		show: boolean = true,
		color: string = '#3388ff',
		weight: number = 1,
		opacity: number = 1.0,
		lineCap: string = 'round',
		lineJoin: string = 'round',
		dashArray: string | null = null,
		dashOffset: string = ''
	): LeafletBorderStyle {
		return {
			show,
			color,
			weight,
			opacity,
			lineCap,
			lineJoin,
			dashArray,
			dashOffset
		};
	}

	public static createAreaStyle(
		show: boolean = true,
		color: string = '#3388ff',
		opacity: number = 1.0
	): LeafletAreaStyle {
		return {
			show,
			color,
			opacity
		};
	}
}
