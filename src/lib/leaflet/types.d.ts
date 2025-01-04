import type L from 'leaflet';

export interface FeatureLayerOptions {
	url: string;
	where?: string;
	minZoom?: number;
	maxZoom?: number;
	style?: L.PathOptions;
}

export interface LayerEventHandlers {
	onClick?: (feature: GeoJSON.Feature) => void;
	onMouseOver?: (feature: GeoJSON.Feature) => void;
	onMouseOut?: (feature: GeoJSON.Feature) => void;
}

export interface LayerMetadata {
	objectIdField: string;
	geometryType: string;
	fields: FieldInfo[];
	capabilities: string[];
}

export interface FieldInfo {
	name: string;
	type: string;
	alias: string;
}

export interface LayerCapabilities {
	query: boolean;
	edit: boolean;
	update: boolean;
	delete: boolean;
}

export type MarkerShape =
	| 'text'
	| 'circle'
	| 'square'
	| 'star'
	| 'triangle'
	| 'triangle-down'
	| 'wye'
	| 'diamond'
	| 'concentric-circle'
	| 'concentric-square'
	| 'concentric-triangle'
	| 'concentric-diamond';

interface PointSymbologyOptions {
	type: 'custom' | 'leaflet';
	options: CustomMarkerOptions | LeafletMarkerOptions;
}

interface CustomMarkerOptions {
	markerShape?: MarkerShape;
	fillColour?: string;
	fillOpacity?: number;
	size?: number;
	strokeColour?: string;
	strokeOpacity?: number;
	strokeWidth?: number;
}

export interface CustomDivIconOptions extends L.DivIconOptions {
	className: string;
	iconSize: [number, number];
	iconAnchor: [number, number];
	color?: string;
	markerShape?: string;
}

interface LeafletMarkerOptions {
	type: 'circle' | 'circleMarker' | 'marker' | 'divIcon' | 'textLabel';
	markerShape?: string;
	color?: string;
	options: L.MarkerOptions | CustomDivIconOptions | L.CircleMarkerOptions;
}

interface LayerInfo {
	layer: L.Layer;
	visible: boolean;
	editable: boolean;
	showInLegend: boolean;
	legendSymbol?: string;
	legendLabel?: string;
	legendInfo: LegendInfo;
}

interface LegendInfo {
	items: (LegendItem | GroupedLegendItem)[];
}
interface LegendItem {
	symbol: string;
	description: string;
}

interface GroupedLegendItem {
	groupName: string;
	items: LegendItem[];
}

interface ControlInfo {
	present: boolean;
	position?: L.ControlPosition;
}

interface GroupedSymbologyOptions extends PointSymbologyOptions {
	propertyField: string;
	groups: {
		value: string | number;
		symbol: PointSymbologyOptions;
		label: string;
		markerShape?: string;
	}[];
}

interface ExtendedPointSymbologyOptions {
	type: string;
	options: {
		type: string;
		options: {
			radius?: number;
			fillColor?: string;
			color?: string;
			weight?: number;
			fillOpacity?: number;
			fillPattern?: string;
			gradient?: 'radial' | 'linear';
			iconSize?: [number, number];
			stroke?: boolean;
		};
		markerShape?: string;
		color?: string;
	};
}

export interface ExtendedPolygonSymbologyOptions extends L.PathOptions {
	fillPattern?: 'hatch' | 'dots' | 'grid';
	gradient?: 'linear' | 'radial';
}

export interface EnhancedPathOptions extends L.PathOptions {
	fillPattern?: 'hatch' | 'dots' | 'grid';
	gradient?: 'linear' | 'radial';
}

export interface PolygonSymbologyOptions {
	fillColor?: string;
	fillOpacity?: number;
	color?: string;
	weight?: number;
	opacity?: number;
	dashArray?: string;
	dashOffset?: string;
	fillPattern?: 'solid' | 'hatch' | 'dots' | 'grid';
	gradient?: 'linear' | 'radial';
}

export interface LineSymbologyOptions {
	color?: string;
	width?: number;
	opacity?: number;
	lineCap?: 'butt' | 'round' | 'square';
	lineJoin?: 'miter' | 'round' | 'bevel';
	pattern?: 'solid' | 'dashed' | 'dotted' | 'dashdot';
	gradient?: 'linear';
	arrowheads?: boolean;
}
