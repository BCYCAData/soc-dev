// $lib/leaflet/leafletsUtils.ts

import type L from 'leaflet';
import type { LayerInfo } from '$lib/leaflet/types';
import type { GeometryType } from '$lib/leaflet/spatial';
import { pointTemplateStyles } from '$lib/leaflet/symbol/leaflet-template-symbol';
import { createPointSymbol } from '$lib/leaflet/leafletlegendutility';

export interface EditControl {
	name: string;
	callback: () => void;
	kind: string;
	html: string;
	mode: 'create' | 'edit' | 'delete';
	title?: string;
}

export const editingStyles = {
	point: {
		hover: {
			radius: 118,
			fillColor: '#666',
			color: '#000',
			weight: 2,
			opacity: 1,
			fillOpacity: 0.7
		},
		selected: {
			radius: 138,
			fillColor: '#FFA500',
			color: '#000',
			weight: 2,
			opacity: 1,
			fillOpacity: 0.9
		}
	},
	marker: {
		hover: {
			iconSize: [32, 32] as L.PointTuple,
			iconAnchor: [16, 32] as L.PointTuple,
			className: 'marker-hover'
		},
		selected: {
			iconSize: [32, 32] as L.PointTuple,
			iconAnchor: [16, 32] as L.PointTuple,
			className: 'marker-selected'
		}
	},
	line: {
		hover: {
			color: '#666',
			weight: 4,
			opacity: 0.8
		},
		selected: {
			color: '#FFA500',
			weight: 4,
			opacity: 1
		}
	},
	polygon: {
		hover: {
			color: '#666',
			weight: 3,
			opacity: 0.8,
			fillOpacity: 0.5,
			fillColor: '#666'
		},
		selected: {
			color: '#FFA500',
			weight: 3,
			opacity: 1,
			fillOpacity: 0.7,
			fillColor: '#FFA500'
		}
	}
};

export function applyGeometryStyle(
	leaflet: typeof L,
	layer: L.Layer,
	styleType: 'hover' | 'selected' | 'delete'
) {
	const styles = {
		point: {
			selected: { color: '#3388ff', weight: 3, fillOpacity: 0.2 },
			delete: { color: '#ff0000', weight: 31, fillOpacity: 0.2 },
			hover: { color: '#3388ff', weight: 3, fillOpacity: 0.2 }
		},
		line: {
			selected: { color: '#3388ff', weight: 3 },
			delete: { color: '#ff0000', weight: 3 },
			hover: { color: '#3388ff', weight: 3 }
		},
		polygon: {
			selected: { color: '#3388ff', weight: 3, fillOpacity: 0.2 },
			delete: { color: '#ff0000', weight: 3, fillOpacity: 0.2 },
			hover: { color: '#3388ff', weight: 3, fillOpacity: 0.2 }
		}
	};

	if (layer instanceof leaflet.Marker) {
		const element = layer.getElement();
		if (element) {
			element.classList.add(styleType);
		}
	} else if ('setStyle' in layer) {
		if (layer instanceof leaflet.CircleMarker) {
			layer.setStyle(styles.point[styleType]);
		} else if (layer instanceof leaflet.Polyline && !(layer instanceof leaflet.Polygon)) {
			layer.setStyle(styles.line[styleType]);
		} else if (layer instanceof leaflet.Polygon) {
			layer.setStyle(styles.polygon[styleType]);
		}
	}
}

export function getLegendSymbol(layer: LayerInfo, template_name?: string): string | undefined {
	if (template_name && pointTemplateStyles[template_name]) {
		const templateStyle = pointTemplateStyles[template_name];
		return createPointSymbol({
			type: 'marker',
			options: {
				type: 'divIcon',
				color: templateStyle.fillColour,
				markerShape: templateStyle.markerShape,
				options: {
					iconSize: [templateStyle.size || 12, templateStyle.size || 12]
				}
			}
		});
	}
	const firstItem = layer.legendInfo?.items[0];
	if (!firstItem) return undefined;

	if ('symbol' in firstItem) {
		return firstItem.symbol;
	}
	if ('items' in firstItem && firstItem.items.length > 0) {
		return firstItem.items[0].symbol;
	}
	return undefined;
}

export function getControlsForGeometryType(geometryType: GeometryType): EditControl[] {
	switch (geometryType) {
		case 'point':
			return [
				{
					name: 'NewMarkerControl',
					callback: () => {
						// Implement create point logic
					},
					kind: 'marker',
					html: '🖈',
					mode: 'create' as const
				}
			];
		case 'line':
			return [
				{
					name: 'NewLineControl',
					callback: () => {
						// Implement create line logic
					},
					kind: 'line',
					html: '\\/\\',
					mode: 'create' as const
				}
			];
		case 'polygon':
			return [
				{
					name: 'NewPolygonControl',
					callback: () => {
						// Implement create polygon logic
					},
					kind: 'polygon',
					html: '▰',
					mode: 'create' as const
				}
			];
		default:
			return [];
	}
}
