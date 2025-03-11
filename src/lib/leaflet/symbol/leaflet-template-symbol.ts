import type {
	CustomMarkerOptions,
	LineSymbologyOptions,
	PointSymbologyOptions,
	PolygonSymbologyOptions
} from '$lib/leaflet/types';

const categoryBaseStyles: Record<'asset' | 'operational' | 'hazard', PointSymbologyOptions> = {
	asset: {
		type: 'custom',
		options: {
			markerShape: 'circle',
			fillColour: '#00ffff',
			size: 12,
			strokeColour: '#000',
			strokeWidth: 1,
			strokeOpacity: 1,
			fillOpacity: 0.8
		}
	},
	operational: {
		type: 'custom',
		options: {
			markerShape: 'square',
			fillColour: '#000080',
			size: 12,
			strokeColour: '#000',
			strokeWidth: 1,
			strokeOpacity: 1,
			fillOpacity: 0.8
		}
	},
	hazard: {
		type: 'custom',
		options: {
			markerShape: 'triangle',
			fillColour: '#ff00ff',
			size: 12,
			strokeColour: '#000',
			strokeWidth: 1,
			strokeOpacity: 1,
			fillOpacity: 0.8
		}
	}
};

const lineBaseStyles: Record<'asset' | 'operational' | 'hazard', LineSymbologyOptions> = {
	asset: {
		color: '#00ffff',
		width: 3,
		opacity: 1,
		pattern: 'solid',
		lineCap: 'round',
		lineJoin: 'round'
	},
	operational: {
		color: '#000080',
		width: 3,
		opacity: 1,
		pattern: 'solid',
		lineCap: 'round',
		lineJoin: 'round'
	},
	hazard: {
		color: '#ff00ff',
		width: 3,
		opacity: 1,
		pattern: 'dashed',
		lineCap: 'round',
		lineJoin: 'round'
	}
};

const polygonBaseStyles: Record<'asset' | 'operational' | 'hazard', PolygonSymbologyOptions> = {
	asset: {
		fillColor: '#00ffff',
		fillOpacity: 0.2,
		color: '#ffffff',
		weight: 2,
		opacity: 1,
		fillPattern: 'solid'
	},
	operational: {
		fillColor: '#000080',
		fillOpacity: 0.2,
		color: '#000080',
		weight: 2,
		opacity: 1,
		fillPattern: 'solid'
	},
	hazard: {
		fillColor: '#ff00ff',
		fillOpacity: 0.2,
		color: '#ff00ff',
		weight: 2,
		opacity: 1,
		fillPattern: 'hatch'
	}
};

// Define template-specific variations
export const pointTemplateStyles: Record<string, Partial<CustomMarkerOptions>> = {
	'Water Tank': {
		markerShape: 'concentric-circle',
		size: 14,
		fillColour: '#00ffff',
		strokeWidth: 2
	},
	'Fire Hydrant': {
		markerShape: 'concentric-diamond',
		size: 16,
		fillColour: '#00ffff',
		strokeWidth: 1.5
	},
	Building: {
		markerShape: 'concentric-square',
		fillColour: '#00ffff',
		size: 16,
		strokeWidth: 2.5
	}
};

const lineTemplateStyles: Record<string, Partial<LineSymbologyOptions>> = {
	Powerline: {
		color: '#ff00ff',
		width: 4,
		pattern: 'dashed',
		arrowheads: true
	},
	'Fire Break': {
		color: '#00ffff',
		width: 5,
		pattern: 'dashdot'
	},
	'Access Route': {
		color: '#00ffff',
		width: 2,
		pattern: 'solid'
	}
};

const polygonTemplateStyles: Record<string, Partial<PolygonSymbologyOptions>> = {
	'Staging Area': {
		fillColor: '#0077ff',
		color: '#0055dd',
		fillOpacity: 0.3,
		weight: 1,
		fillPattern: 'dots'
	},
	'Vegetation Hazard': {
		fillColor: '#228B22',
		color: '#ff00ff',
		fillOpacity: 0.9,
		weight: 1.5,
		fillPattern: 'grid'
	},
	'Slope Hazard': {
		fillColor: '#ff00ff',
		color: '#ff00ff',
		fillOpacity: 0.15,
		weight: 2,
		fillPattern: 'hatch'
	}
};

export function getPointSymbology(
	category: 'asset' | 'operational' | 'hazard',
	template_id?: string
): PointSymbologyOptions {
	const baseStyle = categoryBaseStyles[category];

	if (!template_id || !pointTemplateStyles[template_id]) {
		return baseStyle;
	}
	return {
		type: 'custom',
		options: {
			...baseStyle.options,
			...pointTemplateStyles[template_id]
		}
	};
}

export function getLineSymbology(
	category: 'asset' | 'operational' | 'hazard',
	template_id?: string
): LineSymbologyOptions {
	const baseStyle = lineBaseStyles[category];

	if (!template_id || !lineTemplateStyles[template_id]) {
		return baseStyle;
	}

	return {
		...baseStyle,
		...lineTemplateStyles[template_id]
	};
}

export function getPolygonSymbology(
	category: 'asset' | 'operational' | 'hazard',
	template_id?: string
): PolygonSymbologyOptions {
	const baseStyle = polygonBaseStyles[category];

	if (!template_id || !polygonTemplateStyles[template_id]) {
		return baseStyle;
	}

	return {
		...baseStyle,
		...polygonTemplateStyles[template_id]
	};
}
