import type { GeoJSONOptions, CircleMarkerOptions, MarkerOptions, PolylineOptions } from 'leaflet';
import { getLeaflet } from './layer-factory';

// ============================================================================
// POINT STYLES
// ============================================================================

export interface PointStyle {
	// CircleMarker / Circle specific
	radius?: number; // CircleMarker radius in pixels
	stroke?: boolean; // Whether to draw stroke along the path
	color?: string; // Stroke color
	weight?: number; // Stroke width in pixels
	opacity?: number; // Stroke opacity
	lineCap?: 'butt' | 'round' | 'square'; // Shape of the end of the stroke
	lineJoin?: 'miter' | 'round' | 'bevel'; // Shape of the corners of the stroke
	dashArray?: string | number[]; // Stroke dash pattern
	dashOffset?: string; // Distance into the dash pattern to start the dash
	fill?: boolean; // Whether to fill the path with color
	fillColor?: string; // Fill color
	fillOpacity?: number; // Fill opacity
	fillRule?: 'nonzero' | 'evenodd'; // Fill rule
	bubblingMouseEvents?: boolean; // Whether mouse events propagate to the map

	// Marker-specific options
	icon?: L.Icon | L.DivIcon; // Custom icon for marker
	zIndexOffset?: number; // Offset for z-index ordering
	riseOnHover?: boolean; // Whether marker rises on hover
	riseOffset?: number; // Pixel offset when rising on hover
	keyboard?: boolean; // Whether marker is focusable via keyboard
	title?: string; // Tooltip text for accessibility
	alt?: string; // Alt text for accessibility
	clickable?: boolean; // Deprecated: use interactive
	draggable?: boolean; // Whether marker is draggable
	autoPan?: boolean; // Whether map pans when dragging marker
	autoPanPadding?: L.PointExpression; // Padding for auto-panning
	autoPanSpeed?: number; // Speed of auto-panning

	// General interactive options
	interactive?: boolean; // If true, responds to mouse/touch events
	className?: string; // Custom class name for styling
}

// ============================================================================
// LINE STYLES
// ============================================================================

export interface LineStyle {
	stroke?: boolean; // Whether to draw stroke along the path
	color?: string; // Stroke color
	weight?: number; // Stroke width in pixels
	opacity?: number; // Stroke opacity
	lineCap?: 'butt' | 'round' | 'square'; // Shape of the end of the stroke
	lineJoin?: 'miter' | 'round' | 'bevel'; // Shape of the corners of the stroke
	dashArray?: string | number[]; // Stroke dash pattern
	dashOffset?: string; // Distance into the dash pattern to start the dash
	bubblingMouseEvents?: boolean; // Whether mouse events propagate to the map
	interactive?: boolean; // If true, responds to mouse/touch events
	className?: string; // Custom class name for styling
	smoothFactor?: number; // Simplification tolerance for polylines
	noClip?: boolean; // Disable polyline clipping
}

// ============================================================================
// POLYGON STYLES
// ============================================================================

export interface PolygonStyle {
	stroke?: boolean; // Whether to draw stroke along the path
	color?: string; // Stroke color
	weight?: number; // Stroke width in pixels
	opacity?: number; // Stroke opacity
	lineCap?: 'butt' | 'round' | 'square'; // Shape of the end of the stroke
	lineJoin?: 'miter' | 'round' | 'bevel'; // Shape of the corners of the stroke
	dashArray?: string | number[]; // Stroke dash pattern
	dashOffset?: string; // Distance into the dash pattern to start the dash
	fill?: boolean; // Whether to fill the path with color
	fillColor?: string; // Fill color
	fillOpacity?: number; // Fill opacity
	fillRule?: 'nonzero' | 'evenodd'; // Fill rule
	bubblingMouseEvents?: boolean; // Whether mouse events propagate to the map
	interactive?: boolean; // If true, responds to mouse/touch events
	className?: string; // Custom class name for styling
	smoothFactor?: number; // Simplification tolerance
	noClip?: boolean; // Disable polyline clipping
}

// ============================================================================
// HOVER STYLE TYPES
// ============================================================================

export type HoverStyleFunction<T> = (defaultStyle: T) => Partial<T>;

export interface HoverConfig<T> {
	enabled?: boolean; // Whether hover is enabled (default: true)
	style?: Partial<T> | HoverStyleFunction<T>; // Custom hover style or function
}

// ============================================================================
// POINT LAYER HELPERS
// ============================================================================

function shouldUseMarker(style: PointStyle): boolean {
	return !!(
		style.icon ||
		style.draggable ||
		style.autoPan ||
		style.autoPanPadding ||
		style.autoPanSpeed
	);
}

function getCircleMarkerOptions(style: PointStyle): CircleMarkerOptions {
	const {
		radius,
		stroke,
		color,
		weight,
		opacity,
		lineCap,
		lineJoin,
		dashArray,
		dashOffset,
		fill,
		fillColor,
		fillOpacity,
		fillRule,
		bubblingMouseEvents,
		interactive,
		className
	} = style;

	return {
		radius,
		stroke,
		color,
		weight,
		opacity,
		lineCap,
		lineJoin,
		dashArray,
		dashOffset,
		fill,
		fillColor,
		fillOpacity,
		fillRule,
		bubblingMouseEvents,
		interactive,
		className
	};
}

function getMarkerOptions(style: PointStyle): MarkerOptions {
	const {
		icon,
		zIndexOffset,
		opacity,
		riseOnHover,
		riseOffset,
		keyboard,
		title,
		alt,
		draggable,
		autoPan,
		autoPanPadding,
		autoPanSpeed,
		interactive,
		bubblingMouseEvents
	} = style;

	return {
		icon,
		zIndexOffset,
		opacity,
		riseOnHover,
		riseOffset,
		keyboard,
		title,
		alt,
		draggable,
		autoPan,
		autoPanPadding,
		autoPanSpeed,
		interactive,
		bubblingMouseEvents
	};
}

function getDefaultPointHoverStyle(
	defaultStyle: CircleMarkerOptions
): Partial<CircleMarkerOptions> {
	return {
		radius: (defaultStyle.radius || 6) + 2,
		fillOpacity: 0.9,
		weight: (defaultStyle.weight || 2) + 1
	};
}

function getDefaultMarkerHoverStyle(defaultStyle: MarkerOptions): Partial<MarkerOptions> {
	return {
		opacity: Math.min((defaultStyle.opacity ?? 1) + 0.2, 1)
	};
}

export async function createPointLayerOptions(
	style:
		| PointStyle
		| ((feature: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>) => PointStyle) = {},
	config?: {
		tooltip?: (feature: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>) => string;
		popup?: (feature: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>) => string;
		onClick?: (
			feature: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>,
			latlng: L.LatLngExpression
		) => void;
		hover?: HoverConfig<PointStyle>;
	}
): Promise<GeoJSONOptions> {
	const L = await getLeaflet();
	const hoverEnabled = config?.hover?.enabled !== false;

	return {
		pointToLayer: (feature, latlng) => {
			const featureStyle = typeof style === 'function' ? style(feature as any) : style;
			const useMarker = shouldUseMarker(featureStyle);

			if (useMarker) {
				const markerOptions = getMarkerOptions(featureStyle);
				return L.marker(latlng, markerOptions);
			} else {
				const defaultStyle: CircleMarkerOptions = {
					radius: 6,
					fillColor: '#3388ff',
					fillOpacity: 0.7,
					color: '#ffffff',
					weight: 2,
					opacity: 1,
					...getCircleMarkerOptions(featureStyle)
				};
				return L.circleMarker(latlng, defaultStyle);
			}
		},
		onEachFeature: (
			feature: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>,
			layer: L.Layer
		) => {
			if (config?.tooltip) {
				layer.bindTooltip(config.tooltip(feature), {
					sticky: true,
					direction: 'top'
				});
			}

			if (config?.popup) {
				layer.bindPopup(config.popup(feature));
			}

			if (config?.onClick) {
				layer.on('click', (e: L.LeafletMouseEvent) => {
					config.onClick!(feature, e.latlng);
				});
			}

			if (hoverEnabled) {
				const featureStyle = typeof style === 'function' ? style(feature) : style;
				const useMarker = shouldUseMarker(featureStyle);

				if (useMarker && layer instanceof L.Marker) {
					const markerOptions = getMarkerOptions(featureStyle);
					const hoverStyle = config?.hover?.style
						? typeof config.hover.style === 'function'
							? config.hover.style(featureStyle)
							: config.hover.style
						: getDefaultMarkerHoverStyle(markerOptions);

					layer.on('mouseover', () => {
						if ('opacity' in hoverStyle && hoverStyle.opacity !== undefined) {
							layer.setOpacity(hoverStyle.opacity);
						}
					});

					layer.on('mouseout', () => {
						layer.setOpacity(markerOptions.opacity ?? 1);
					});
				} else if (layer instanceof L.CircleMarker) {
					const defaultStyle: CircleMarkerOptions = {
						radius: 6,
						fillColor: '#3388ff',
						fillOpacity: 0.7,
						color: '#ffffff',
						weight: 2,
						opacity: 1,
						...getCircleMarkerOptions(featureStyle)
					};

					const hoverStyle = config?.hover?.style
						? typeof config.hover.style === 'function'
							? config.hover.style(featureStyle)
							: config.hover.style
						: getDefaultPointHoverStyle(defaultStyle);

					layer.on('mouseover', () => {
						layer.setStyle(hoverStyle);
					});

					layer.on('mouseout', () => {
						layer.setStyle(defaultStyle);
					});
				}
			}
		}
	};
}

// ============================================================================
// LINE LAYER HELPERS
// ============================================================================

function getPolylineOptions(style: LineStyle): PolylineOptions {
	const {
		stroke,
		color,
		weight,
		opacity,
		lineCap,
		lineJoin,
		dashArray,
		dashOffset,
		bubblingMouseEvents,
		interactive,
		className,
		smoothFactor,
		noClip
	} = style;

	return {
		stroke,
		color,
		weight,
		opacity,
		lineCap,
		lineJoin,
		dashArray,
		dashOffset,
		bubblingMouseEvents,
		interactive,
		className,
		smoothFactor,
		noClip
	};
}

function getDefaultLineHoverStyle(defaultStyle: PolylineOptions): Partial<PolylineOptions> {
	return {
		weight: (defaultStyle.weight || 3) + 2,
		opacity: Math.min((defaultStyle.opacity ?? 1) + 0.2, 1)
	};
}

export async function createLineLayerOptions(
	style:
		| LineStyle
		| ((feature: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>) => LineStyle) = {},
	config?: {
		tooltip?: (feature: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>) => string;
		popup?: (feature: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>) => string;
		onClick?: (
			feature: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>,
			latlng: L.LatLngExpression
		) => void;
		hover?: HoverConfig<LineStyle>;
	}
): Promise<GeoJSONOptions> {
	const L = await getLeaflet();
	const hoverEnabled = config?.hover?.enabled !== false;

	return {
		style: (feature) => {
			const featureStyle = typeof style === 'function' ? style(feature as any) : style;
			const defaultStyle: PolylineOptions = {
				color: '#3388ff',
				weight: 3,
				opacity: 1,
				...getPolylineOptions(featureStyle)
			};
			return defaultStyle;
		},
		onEachFeature: (
			feature: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString>,
			layer: L.Layer
		) => {
			if (config?.tooltip) {
				layer.bindTooltip(config.tooltip(feature), {
					sticky: true,
					direction: 'top'
				});
			}

			if (config?.popup) {
				layer.bindPopup(config.popup(feature));
			}

			if (config?.onClick) {
				layer.on('click', (e: L.LeafletMouseEvent) => {
					config.onClick!(feature, e.latlng);
				});
			}

			if (hoverEnabled && layer instanceof L.Polyline) {
				const featureStyle = typeof style === 'function' ? style(feature) : style;
				const defaultStyle: PolylineOptions = {
					color: '#3388ff',
					weight: 3,
					opacity: 1,
					...getPolylineOptions(featureStyle)
				};

				const hoverStyle = config?.hover?.style
					? typeof config.hover.style === 'function'
						? config.hover.style(featureStyle)
						: config.hover.style
					: getDefaultLineHoverStyle(defaultStyle);

				layer.on('mouseover', () => {
					layer.setStyle(hoverStyle);
				});

				layer.on('mouseout', () => {
					layer.setStyle(defaultStyle);
				});
			}
		}
	};
}

// ============================================================================
// POLYGON LAYER HELPERS
// ============================================================================

function getPolygonOptions(style: PolygonStyle): PolylineOptions {
	const {
		stroke,
		color,
		weight,
		opacity,
		lineCap,
		lineJoin,
		dashArray,
		dashOffset,
		fill,
		fillColor,
		fillOpacity,
		fillRule,
		bubblingMouseEvents,
		interactive,
		className,
		smoothFactor,
		noClip
	} = style;

	return {
		stroke,
		color,
		weight,
		opacity,
		lineCap,
		lineJoin,
		dashArray,
		dashOffset,
		fill,
		fillColor,
		fillOpacity,
		fillRule,
		bubblingMouseEvents,
		interactive,
		className,
		smoothFactor,
		noClip
	};
}

function getDefaultPolygonHoverStyle(defaultStyle: PolylineOptions): Partial<PolylineOptions> {
	return {
		weight: (defaultStyle.weight || 3) + 1,
		fillOpacity: Math.min((defaultStyle.fillOpacity ?? 0.2) + 0.2, 1)
	};
}

export async function createPolygonLayerOptions(
	style:
		| PolygonStyle
		| ((feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>) => PolygonStyle) = {},
	config?: {
		tooltip?: (feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>) => string;
		popup?: (feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>) => string;
		onClick?: (
			feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
			latlng: L.LatLngExpression
		) => void;
		hover?: HoverConfig<PolygonStyle>;
	}
): Promise<GeoJSONOptions> {
	const L = await getLeaflet();
	const hoverEnabled = config?.hover?.enabled !== false;

	return {
		style: (feature) => {
			const featureStyle = typeof style === 'function' ? style(feature as any) : style;
			const defaultStyle: PolylineOptions = {
				color: '#3388ff',
				weight: 3,
				opacity: 1,
				fillColor: '#3388ff',
				fillOpacity: 0.2,
				...getPolygonOptions(featureStyle)
			};
			return defaultStyle;
		},
		onEachFeature: (
			feature: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>,
			layer: L.Layer
		) => {
			if (config?.tooltip) {
				layer.bindTooltip(config.tooltip(feature), {
					sticky: true,
					direction: 'top'
				});
			}

			if (config?.popup) {
				layer.bindPopup(config.popup(feature));
			}

			if (config?.onClick) {
				layer.on('click', (e: L.LeafletMouseEvent) => {
					config.onClick!(feature, e.latlng);
				});
			}

			if (hoverEnabled && layer instanceof L.Polygon) {
				const featureStyle = typeof style === 'function' ? style(feature) : style;
				const defaultStyle: PolylineOptions = {
					color: '#3388ff',
					weight: 3,
					opacity: 1,
					fillColor: '#3388ff',
					fillOpacity: 0.2,
					...getPolygonOptions(featureStyle)
				};

				const hoverStyle = config?.hover?.style
					? typeof config.hover.style === 'function'
						? config.hover.style(featureStyle)
						: config.hover.style
					: getDefaultPolygonHoverStyle(defaultStyle);

				layer.on('mouseover', () => {
					layer.setStyle(hoverStyle);
				});

				layer.on('mouseout', () => {
					layer.setStyle(defaultStyle);
				});
			}
		}
	};
}
