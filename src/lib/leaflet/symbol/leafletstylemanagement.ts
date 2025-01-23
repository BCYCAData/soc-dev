import { Path, Marker, CircleMarker, Icon, DivIcon } from 'leaflet';
import type L from 'leaflet';
import type {
	CustomMarkerOptions,
	CustomDivIconOptions,
	LeafletMarkerOptions,
	ExtendedPointSymbologyOptions,
	ExtendedPolygonSymbologyOptions,
	LineSymbologyOptions,
	PolygonSymbologyOptions,
	EnhancedPathOptions
} from '../types';

type LayerStyle =
	| L.PathOptions
	| CustomMarkerOptions
	| LeafletMarkerOptions
	| ExtendedPointSymbologyOptions
	| ExtendedPolygonSymbologyOptions
	| LineSymbologyOptions
	| PolygonSymbologyOptions;

function isPathLayer(layer: L.Layer): layer is L.Path {
	return layer instanceof Path;
}

function isMarkerLayer(layer: L.Layer): layer is L.Marker {
	return layer instanceof Marker;
}

function isCircleMarkerLayer(layer: L.Layer): layer is L.CircleMarker {
	return layer instanceof CircleMarker;
}

function isDivIconMarker(layer: any): boolean {
	return layer instanceof Marker && layer.getIcon() instanceof DivIcon;
}

function capturePathStyle(layer: L.Path): EnhancedPathOptions {
	const options = layer.options;
	return {
		color: options.color,
		weight: options.weight,
		opacity: options.opacity,
		fillColor: options.fillColor,
		fillOpacity: options.fillOpacity,
		fillPattern: (options as EnhancedPathOptions).fillPattern,
		gradient: (options as EnhancedPathOptions).gradient,
		dashArray: options.dashArray,
		dashOffset: options.dashOffset,
		lineCap: (options as LineSymbologyOptions).lineCap,
		lineJoin: (options as LineSymbologyOptions).lineJoin
	};
}

function captureMarkerStyle(marker: L.Marker): LeafletMarkerOptions {
	const icon = marker.getIcon();
	if (isDivIconMarker(marker)) {
		const divIconOptions = icon.options as CustomDivIconOptions;
		return {
			type: 'divIcon',
			markerShape: divIconOptions.markerShape,
			color: divIconOptions.color,
			options: {
				...divIconOptions,
				// Provide default values if undefined
				iconSize: divIconOptions.iconSize || [25, 41],
				iconAnchor: divIconOptions.iconAnchor || [12, 41],
				className: divIconOptions.className
			}
		};
	}

	return {
		type: 'marker',
		options: {
			...icon.options,
			// Provide default values if undefined
			iconSize: (icon.options.iconSize as [number, number]) || [25, 41],
			iconAnchor: (icon.options.iconAnchor as [number, number]) || [12, 41]
		}
	};
}

function captureCircleMarkerStyle(layer: L.CircleMarker): ExtendedPointSymbologyOptions {
	return {
		type: 'custom',
		options: {
			type: 'circleMarker',
			options: {
				radius: layer.options.radius,
				fillColor: layer.options.fillColor,
				color: layer.options.color,
				weight: layer.options.weight,
				fillOpacity: layer.options.fillOpacity,
				stroke: layer.options.stroke
			}
		}
	};
}

export function resetLayerStyle(layer: any) {
	if (layer.editor) {
		layer.editor.disable();
	}
	if (layer.originalStyle) {
		applyLayerStyle(layer, layer.originalStyle);
	}

	delete layer.lastStyle;
}

export function captureLayerStyle(layer: L.Layer): LayerStyle {
	if (isPathLayer(layer)) {
		return capturePathStyle(layer);
	}

	if (isMarkerLayer(layer)) {
		return captureMarkerStyle(layer);
	}

	if (isCircleMarkerLayer(layer)) {
		return captureCircleMarkerStyle(layer);
	}

	throw new Error('Unsupported layer type');
}

export function applyLayerStyle(layer: L.Layer, style: LayerStyle): void {
	if (isPathLayer(layer)) {
		layer.setStyle(style as L.PathOptions);
	}

	if (isMarkerLayer(layer)) {
		const markerStyle = style as LeafletMarkerOptions;
		if (markerStyle.type === 'divIcon') {
			const icon = new DivIcon(markerStyle.options as CustomDivIconOptions);
			layer.setIcon(icon);
		} else {
			const icon = new Icon(markerStyle.options as L.IconOptions);
			layer.setIcon(icon);
		}
	}

	if (isCircleMarkerLayer(layer)) {
		const pointStyle = style as ExtendedPointSymbologyOptions;
		layer.setStyle(pointStyle.options.options as L.PathOptions);
	}
}

// Add style caching mechanism
const styleCache = new Map<string, LayerStyle>();

function generateStyleFromTemplate(templateId: string, feature: any): LayerStyle {
	// Add template style logic based on requirements
	switch (templateId) {
		case 'point':
			return {
				type: 'leaflet',
				options: {
					type: 'circleMarker',
					options: {
						radius: 6,
						fillColor: '#3388ff',
						color: '#000',
						weight: 1,
						fillOpacity: 0.8
					}
				}
			};
		case 'line':
			return {
				color: '#3388ff',
				weight: 3,
				opacity: 1
			} as L.PathOptions;
		case 'polygon':
			return {
				fillColor: '#3388ff',
				fillOpacity: 0.2,
				color: '#3388ff',
				weight: 3
			} as L.PathOptions;
		default:
			return {
				type: 'leaflet',
				options: {
					type: 'circleMarker',
					options: {
						radius: 6,
						fillColor: '#3388ff',
						color: '#000',
						weight: 1,
						fillOpacity: 0.8
					}
				}
			};
	}
}

export function resolveTemplateStyle(templateId: string, feature: any): LayerStyle {
	const cachedStyle = styleCache.get(templateId);
	if (cachedStyle) return cachedStyle;

	const style = generateStyleFromTemplate(templateId, feature);
	styleCache.set(templateId, style);
	return style;
}

function isPathStyle(style: LayerStyle): style is L.PathOptions {
	return 'weight' in style;
}

export function generateEditStyle(originalStyle: LayerStyle): LayerStyle {
	if (isPathStyle(originalStyle)) {
		return {
			...(originalStyle as L.PathOptions),
			weight: originalStyle.weight ? originalStyle.weight * 1.5 : 3,
			opacity: 0.8,
			fillOpacity: 0.3,
			color: '#ff4444'
		} as L.PathOptions;
	}

	if ('type' in originalStyle && originalStyle.type === 'leaflet') {
		return {
			...originalStyle,
			options: {
				...originalStyle.options,
				color: '#ff4444'
			}
		};
	}

	return originalStyle;
}
