// Enums
export enum GeometryType {
	POINT = 'point',
	LINE = 'line',
	POLYGON = 'polygon'
}

export enum FeatureCategory {
	ASSET = 'asset',
	OPERATIONAL = 'operational',
	HAZARD = 'hazard'
}

export enum FieldType {
	TEXT = 'text',
	NUMBER = 'number',
	DATE = 'date',
	SELECT = 'select',
	BOOLEAN = 'boolean'
}

// Interfaces
export interface FeatureTemplate {
	id: string;
	name: string;
	description: string | null;
	geometry_type: GeometryType;
	category: FeatureCategory;
	is_active: boolean;
	created_at?: string;
	last_edited?: string;
}

export interface TemplateField {
	id: string;
	template_id: string;
	field_name: string;
	field_type: FieldType;
	validation_rules: string | null;
	required: boolean;
	default_value: string | null;
	display_order: number;
}

export interface SpatialFeature {
	id: string;
	user_id: string;
	property_id: string;
	template_id: string;
	geom: GeoJSON.Geometry;
	created_at?: string;
	last_edited?: string;
}

export interface FeatureAttribute {
	id: string;
	feature_id: string;
	field_id: string;
	value: string | null;
	last_edited?: string;
}

// Type for managing active editing state
export interface EditingState {
	activeTemplate: FeatureTemplate | null;
	activeFeature: SpatialFeature | null;
	mode: 'create' | 'edit' | 'delete' | null;
}
