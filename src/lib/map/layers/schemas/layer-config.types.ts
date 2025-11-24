export type GeometryType =
	| 'Point'
	| 'LineString'
	| 'Polygon'
	| 'MultiPoint'
	| 'MultiLineString'
	| 'MultiPolygon';

export type StyleMode = 'static' | 'dynamic' | 'categorized' | 'choropleth';

/**
 * Main layer configuration interface
 */
export interface LayerConfig {
	// Basic metadata
	id: string;
	name: string;
	description?: string;
	geometryType: GeometryType;
	category?: string;

	// Data source
	source: {
		rpcFunction: string;
		params?: Record<string, any>;
		cacheKey?: string;
		cacheDuration?: number; // milliseconds
	};

	// Styling configuration
	styling: StyleConfig;

	// Interaction configuration
	interaction: InteractionConfig;

	// Query/filter configuration
	query?: QueryConfig;

	// Edit configuration
	editing?: EditConfig;

	// Display options
	display?: {
		defaultVisible?: boolean;
		minZoom?: number;
		maxZoom?: number;
		pane?: string;
		zIndex?: number;
	};

	// Feature property schema (for validation & forms)
	properties?: PropertySchema[];
}

/**
 * Style configuration
 */
export interface StyleConfig {
	mode: StyleMode;

	// Static styles (always applied)
	base?: {
		point?: PointStyle;
		line?: LineStyle;
		polygon?: PolygonStyle;
	};

	// Dynamic style function
	styleFn?: (feature: GeoJSON.Feature) => any;

	// Categorized styling (style by property value)
	categorized?: {
		property: string;
		categories: Record<string, CategoryStyle>;
		default?: CategoryStyle;
	};

	// Choropleth styling (color by numeric value)
	choropleth?: {
		property: string;
		breaks: number[];
		colors: string[];
		method?: 'quantile' | 'equal-interval' | 'natural-breaks';
	};

	// Hover styles
	hover?: {
		point?: Partial<PointStyle>;
		line?: Partial<LineStyle>;
		polygon?: Partial<PolygonStyle>;
	};

	// Selection styles
	selection?: {
		point?: Partial<PointStyle>;
		line?: Partial<LineStyle>;
		polygon?: Partial<PolygonStyle>;
	};
}

export interface PointStyle {
	radius?: number;
	fillColor?: string;
	fillOpacity?: number;
	color?: string;
	weight?: number;
	opacity?: number;
}

export interface LineStyle {
	color?: string;
	weight?: number;
	opacity?: number;
	dashArray?: string;
	lineCap?: 'butt' | 'round' | 'square';
	lineJoin?: 'miter' | 'round' | 'bevel';
}

export interface PolygonStyle {
	fillColor?: string;
	fillOpacity?: number;
	color?: string;
	weight?: number;
	opacity?: number;
}

export interface CategoryStyle {
	point?: PointStyle;
	line?: LineStyle;
	polygon?: PolygonStyle;
	label?: string;
}

/**
 * Interaction configuration
 */
export interface InteractionConfig {
	popup?: {
		enabled: boolean;
		template?: string | ((feature: GeoJSON.Feature) => string);
		fields?: string[];
		maxWidth?: number;
	};

	tooltip?: {
		enabled: boolean;
		template?: string | ((feature: GeoJSON.Feature) => string);
		property?: string; // Show single property value
	};

	sidePanel?: {
		enabled: boolean;
	};

	click?: {
		enabled: boolean;
		selectMode?: 'single' | 'multiple' | 'none';
	};

	hover?: {
		enabled: boolean;
		highlight: boolean;
	};
}

/**
 * Query/filter configuration
 */
export interface QueryConfig {
	enabled: boolean;
	filters?: FilterDefinition[];
	allowCustomFilters?: boolean;
}

export interface FilterDefinition {
	id: string;
	label: string;
	field: string;
	type: 'text' | 'number' | 'select' | 'date' | 'boolean';
	operators?: FilterOperator[];
	options?: { value: any; label: string }[]; // For select type
	default?: any;
}

export type FilterOperator =
	| 'eq'
	| 'neq'
	| 'gt'
	| 'gte'
	| 'lt'
	| 'lte'
	| 'in'
	| 'like'
	| 'ilike'
	| 'between';

/**
 * Edit configuration
 */
export interface EditConfig {
	enabled: boolean;
	allowCreate?: boolean;
	allowUpdate?: boolean;
	allowDelete?: boolean;

	geometry?: {
		editable: boolean;
		snapping?: boolean;
		snapLayers?: string[]; // Layer IDs to snap to
	};

	properties?: {
		editable: boolean;
		validation?: Record<string, ValidationRule>;
	};

	// RPC functions for CRUD operations
	operations?: {
		create?: string; // RPC function name
		update?: string;
		delete?: string;
	};
}

export interface ValidationRule {
	required?: boolean;
	min?: number;
	max?: number;
	pattern?: RegExp;
	custom?: (value: any, feature: GeoJSON.Feature) => string | null; // Return error message or null
}

/**
 * Property schema for forms and validation
 */
export interface PropertySchema {
	key: string;
	label: string;
	type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'textarea';
	required?: boolean;
	readonly?: boolean;
	default?: any;
	options?: { value: any; label: string }[];
	validation?: ValidationRule;
	help?: string;
	group?: string; // For organizing fields in forms
	order?: number; // Display order
}

/**
 * Layer registry - all layers keyed by ID
 */
export type LayerRegistry = Record<string, LayerConfig>;
