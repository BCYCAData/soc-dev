import type { PropertySchema } from '$lib/map/layers/schemas/layer-config.types';

/**
 * Feature schemas define the structure of feature properties for each layer.
 * These can be used for:
 * - Form generation (create/edit features)
 * - Validation (client and server)
 * - Type generation
 * - Documentation
 */

// ============================================================================
// PARCEL FEATURE SCHEMA
// ============================================================================

export const parcelFeatureSchema: PropertySchema[] = [
	{
		key: 'parcel_id',
		label: 'Parcel ID',
		type: 'text',
		required: true,
		readonly: true,
		help: 'Unique identifier for the parcel',
		group: 'identification',
		order: 1,
		validation: {
			pattern: /^[A-Z0-9]{6,12}$/,
			custom: (value) => {
				if (!value) return 'Parcel ID is required';
				if (!/^[A-Z0-9]{6,12}$/.test(value)) {
					return 'Parcel ID must be 6-12 alphanumeric characters';
				}
				return null;
			}
		}
	},
	{
		key: 'legal_description',
		label: 'Legal Description',
		type: 'textarea',
		required: true,
		help: 'Full legal description of the parcel',
		group: 'identification',
		order: 2
	},
	{
		key: 'owner_name',
		label: 'Owner Name',
		type: 'text',
		required: true,
		help: 'Name of the property owner',
		group: 'ownership',
		order: 3,
		validation: {
			required: true,
			min: 2,
			custom: (value) => {
				if (!value || value.trim().length < 2) {
					return 'Owner name must be at least 2 characters';
				}
				return null;
			}
		}
	},
	{
		key: 'owner_address',
		label: 'Owner Address',
		type: 'textarea',
		required: false,
		help: 'Mailing address of the owner',
		group: 'ownership',
		order: 4
	},
	{
		key: 'owner_phone',
		label: 'Owner Phone',
		type: 'text',
		required: false,
		group: 'ownership',
		order: 5,
		validation: {
			pattern: /^[\d\s\-\+\(\)]+$/,
			custom: (value) => {
				if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
					return 'Invalid phone number format';
				}
				return null;
			}
		}
	},
	{
		key: 'area',
		label: 'Area (m²)',
		type: 'number',
		required: true,
		readonly: true,
		help: 'Calculated area of the parcel in square meters',
		group: 'physical',
		order: 6,
		validation: {
			required: true,
			min: 1,
			max: 1000000
		}
	},
	{
		key: 'perimeter',
		label: 'Perimeter (m)',
		type: 'number',
		required: false,
		readonly: true,
		help: 'Calculated perimeter in meters',
		group: 'physical',
		order: 7
	},
	{
		key: 'zoning',
		label: 'Zoning',
		type: 'select',
		required: true,
		help: 'Current zoning classification',
		group: 'planning',
		order: 8,
		options: [
			{ value: 'residential', label: 'Residential' },
			{ value: 'commercial', label: 'Commercial' },
			{ value: 'industrial', label: 'Industrial' },
			{ value: 'agricultural', label: 'Agricultural' },
			{ value: 'mixed-use', label: 'Mixed Use' },
			{ value: 'conservation', label: 'Conservation' },
			{ value: 'public', label: 'Public/Institutional' }
		],
		validation: {
			required: true
		}
	},
	{
		key: 'land_use',
		label: 'Current Land Use',
		type: 'select',
		required: false,
		help: 'Actual current use of the land',
		group: 'planning',
		order: 9,
		options: [
			{ value: 'vacant', label: 'Vacant Land' },
			{ value: 'single-family', label: 'Single Family Residential' },
			{ value: 'multi-family', label: 'Multi-Family Residential' },
			{ value: 'retail', label: 'Retail' },
			{ value: 'office', label: 'Office' },
			{ value: 'warehouse', label: 'Warehouse/Storage' },
			{ value: 'farming', label: 'Farming' },
			{ value: 'grazing', label: 'Grazing' },
			{ value: 'forestry', label: 'Forestry' },
			{ value: 'other', label: 'Other' }
		]
	},
	{
		key: 'valuation',
		label: 'Property Valuation',
		type: 'number',
		required: false,
		help: 'Current assessed property value in AUD',
		group: 'financial',
		order: 10,
		validation: {
			min: 0,
			max: 999999999
		}
	},
	{
		key: 'valuation_date',
		label: 'Valuation Date',
		type: 'date',
		required: false,
		help: 'Date of last valuation',
		group: 'financial',
		order: 11
	},
	{
		key: 'last_sale_price',
		label: 'Last Sale Price',
		type: 'number',
		required: false,
		help: 'Price at last sale',
		group: 'financial',
		order: 12,
		validation: {
			min: 0
		}
	},
	{
		key: 'last_sale_date',
		label: 'Last Sale Date',
		type: 'date',
		required: false,
		help: 'Date of last sale',
		group: 'financial',
		order: 13
	},
	{
		key: 'rates_payable',
		label: 'Annual Rates',
		type: 'number',
		required: false,
		help: 'Annual council rates payable',
		group: 'financial',
		order: 14,
		validation: {
			min: 0
		}
	},
	{
		key: 'water_connected',
		label: 'Water Connected',
		type: 'boolean',
		required: false,
		default: false,
		help: 'Is town water connected?',
		group: 'services',
		order: 15
	},
	{
		key: 'sewer_connected',
		label: 'Sewer Connected',
		type: 'boolean',
		required: false,
		default: false,
		help: 'Is sewer connected?',
		group: 'services',
		order: 16
	},
	{
		key: 'power_connected',
		label: 'Power Connected',
		type: 'boolean',
		required: false,
		default: false,
		help: 'Is electricity connected?',
		group: 'services',
		order: 17
	},
	{
		key: 'notes',
		label: 'Notes',
		type: 'textarea',
		required: false,
		help: 'Additional notes or comments',
		group: 'other',
		order: 18
	},
	{
		key: 'created_at',
		label: 'Created',
		type: 'date',
		required: false,
		readonly: true,
		group: 'metadata',
		order: 19
	},
	{
		key: 'updated_at',
		label: 'Last Updated',
		type: 'date',
		required: false,
		readonly: true,
		group: 'metadata',
		order: 20
	},
	{
		key: 'created_by',
		label: 'Created By',
		type: 'text',
		required: false,
		readonly: true,
		group: 'metadata',
		order: 21
	}
];

// ============================================================================
// ROAD FEATURE SCHEMA
// ============================================================================

export const roadFeatureSchema: PropertySchema[] = [
	{
		key: 'road_id',
		label: 'Road ID',
		type: 'text',
		required: true,
		readonly: true,
		group: 'identification',
		order: 1
	},
	{
		key: 'name',
		label: 'Road Name',
		type: 'text',
		required: true,
		help: 'Official name of the road',
		group: 'identification',
		order: 2,
		validation: {
			required: true,
			min: 2
		}
	},
	{
		key: 'name_alt',
		label: 'Alternative Name',
		type: 'text',
		required: false,
		help: 'Alternative or historical name',
		group: 'identification',
		order: 3
	},
	{
		key: 'road_type',
		label: 'Road Type',
		type: 'select',
		required: true,
		group: 'classification',
		order: 4,
		options: [
			{ value: 'highway', label: 'Highway' },
			{ value: 'main', label: 'Main Road' },
			{ value: 'arterial', label: 'Arterial Road' },
			{ value: 'collector', label: 'Collector Road' },
			{ value: 'local', label: 'Local Road' },
			{ value: 'private', label: 'Private Road' },
			{ value: 'track', label: 'Track/Trail' }
		],
		validation: {
			required: true
		}
	},
	{
		key: 'hierarchy',
		label: 'Road Hierarchy',
		type: 'select',
		required: false,
		help: 'Functional road hierarchy',
		group: 'classification',
		order: 5,
		options: [
			{ value: 'national', label: 'National Highway' },
			{ value: 'state', label: 'State Highway' },
			{ value: 'regional', label: 'Regional Road' },
			{ value: 'local', label: 'Local Road' }
		]
	},
	{
		key: 'surface',
		label: 'Surface Type',
		type: 'select',
		required: true,
		group: 'physical',
		order: 6,
		options: [
			{ value: 'paved', label: 'Paved/Sealed' },
			{ value: 'concrete', label: 'Concrete' },
			{ value: 'asphalt', label: 'Asphalt' },
			{ value: 'gravel', label: 'Gravel' },
			{ value: 'dirt', label: 'Dirt/Unsealed' },
			{ value: 'other', label: 'Other' }
		],
		validation: {
			required: true
		}
	},
	{
		key: 'surface_condition',
		label: 'Surface Condition',
		type: 'select',
		required: false,
		group: 'physical',
		order: 7,
		options: [
			{ value: 'excellent', label: 'Excellent' },
			{ value: 'good', label: 'Good' },
			{ value: 'fair', label: 'Fair' },
			{ value: 'poor', label: 'Poor' },
			{ value: 'failed', label: 'Failed' }
		]
	},
	{
		key: 'lanes',
		label: 'Number of Lanes',
		type: 'number',
		required: false,
		help: 'Total lanes in both directions',
		group: 'physical',
		order: 8,
		validation: {
			min: 1,
			max: 10
		}
	},
	{
		key: 'width',
		label: 'Width (m)',
		type: 'number',
		required: false,
		help: 'Total carriageway width in meters',
		group: 'physical',
		order: 9,
		validation: {
			min: 2,
			max: 50
		}
	},
	{
		key: 'length',
		label: 'Length (m)',
		type: 'number',
		required: false,
		readonly: true,
		help: 'Calculated length in meters',
		group: 'physical',
		order: 10
	},
	{
		key: 'speed_limit',
		label: 'Speed Limit (km/h)',
		type: 'number',
		required: false,
		group: 'regulation',
		order: 11,
		validation: {
			min: 10,
			max: 130
		}
	},
	{
		key: 'one_way',
		label: 'One Way',
		type: 'boolean',
		required: false,
		default: false,
		help: 'Is this a one-way road?',
		group: 'regulation',
		order: 12
	},
	{
		key: 'direction',
		label: 'One-Way Direction',
		type: 'select',
		required: false,
		help: 'Direction of one-way traffic (if applicable)',
		group: 'regulation',
		order: 13,
		options: [
			{ value: 'forward', label: 'Forward (with geometry direction)' },
			{ value: 'backward', label: 'Backward (against geometry direction)' }
		]
	},
	{
		key: 'maintained_by',
		label: 'Maintained By',
		type: 'select',
		required: false,
		group: 'management',
		order: 14,
		options: [
			{ value: 'federal', label: 'Federal Government' },
			{ value: 'state', label: 'State Government' },
			{ value: 'council', label: 'Local Council' },
			{ value: 'private', label: 'Private' }
		]
	},
	{
		key: 'last_maintained',
		label: 'Last Maintained',
		type: 'date',
		required: false,
		help: 'Date of last maintenance',
		group: 'management',
		order: 15
	},
	{
		key: 'footpath',
		label: 'Footpath Available',
		type: 'boolean',
		required: false,
		default: false,
		group: 'features',
		order: 16
	},
	{
		key: 'bike_lane',
		label: 'Bike Lane Available',
		type: 'boolean',
		required: false,
		default: false,
		group: 'features',
		order: 17
	},
	{
		key: 'street_lighting',
		label: 'Street Lighting',
		type: 'boolean',
		required: false,
		default: false,
		group: 'features',
		order: 18
	},
	{
		key: 'notes',
		label: 'Notes',
		type: 'textarea',
		required: false,
		group: 'other',
		order: 19
	}
];

// ============================================================================
// POINT OF INTEREST FEATURE SCHEMA
// ============================================================================

export const poiFeatureSchema: PropertySchema[] = [
	{
		key: 'poi_id',
		label: 'POI ID',
		type: 'text',
		required: true,
		readonly: true,
		group: 'identification',
		order: 1
	},
	{
		key: 'name',
		label: 'Name',
		type: 'text',
		required: true,
		help: 'Name of the point of interest',
		group: 'identification',
		order: 2,
		validation: {
			required: true,
			min: 2
		}
	},
	{
		key: 'category',
		label: 'Category',
		type: 'select',
		required: true,
		group: 'classification',
		order: 3,
		options: [
			{ value: 'park', label: 'Park/Recreation' },
			{ value: 'school', label: 'School/Education' },
			{ value: 'hospital', label: 'Hospital/Medical' },
			{ value: 'library', label: 'Library' },
			{ value: 'community', label: 'Community Center' },
			{ value: 'sports', label: 'Sports Facility' },
			{ value: 'cultural', label: 'Cultural/Arts' },
			{ value: 'religious', label: 'Religious' },
			{ value: 'government', label: 'Government' },
			{ value: 'emergency', label: 'Emergency Services' },
			{ value: 'other', label: 'Other' }
		],
		validation: {
			required: true
		}
	},
	{
		key: 'subcategory',
		label: 'Subcategory',
		type: 'text',
		required: false,
		help: 'More specific classification',
		group: 'classification',
		order: 4
	},
	{
		key: 'description',
		label: 'Description',
		type: 'textarea',
		required: false,
		help: 'Detailed description of the facility',
		group: 'details',
		order: 5
	},
	{
		key: 'address',
		label: 'Address',
		type: 'text',
		required: false,
		help: 'Street address',
		group: 'location',
		order: 6
	},
	{
		key: 'suburb',
		label: 'Suburb',
		type: 'text',
		required: false,
		group: 'location',
		order: 7
	},
	{
		key: 'postcode',
		label: 'Postcode',
		type: 'text',
		required: false,
		group: 'location',
		order: 8,
		validation: {
			pattern: /^\d{4}$/,
			custom: (value) => {
				if (value && !/^\d{4}$/.test(value)) {
					return 'Postcode must be 4 digits';
				}
				return null;
			}
		}
	},
	{
		key: 'phone',
		label: 'Phone Number',
		type: 'text',
		required: false,
		group: 'contact',
		order: 9,
		validation: {
			pattern: /^[\d\s\-\+\(\)]+$/
		}
	},
	{
		key: 'email',
		label: 'Email',
		type: 'text',
		required: false,
		group: 'contact',
		order: 10,
		validation: {
			pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			custom: (value) => {
				if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
					return 'Invalid email format';
				}
				return null;
			}
		}
	},
	{
		key: 'website',
		label: 'Website',
		type: 'text',
		required: false,
		group: 'contact',
		order: 11,
		validation: {
			pattern: /^https?:\/\/.+/,
			custom: (value) => {
				if (value && !/^https?:\/\/.+/.test(value)) {
					return 'Website must start with http:// or https://';
				}
				return null;
			}
		}
	},
	{
		key: 'hours',
		label: 'Opening Hours',
		type: 'text',
		required: false,
		help: 'e.g., Mon-Fri 9am-5pm, Sat 10am-2pm',
		group: 'details',
		order: 12
	},
	{
		key: 'wheelchair_accessible',
		label: 'Wheelchair Accessible',
		type: 'boolean',
		required: false,
		default: false,
		group: 'accessibility',
		order: 13
	},
	{
		key: 'parking_available',
		label: 'Parking Available',
		type: 'boolean',
		required: false,
		default: false,
		group: 'facilities',
		order: 14
	},
	{
		key: 'public_transport',
		label: 'Public Transport Access',
		type: 'boolean',
		required: false,
		default: false,
		help: 'Is there nearby public transport?',
		group: 'accessibility',
		order: 15
	},
	{
		key: 'capacity',
		label: 'Capacity',
		type: 'number',
		required: false,
		help: 'Maximum capacity (if applicable)',
		group: 'details',
		order: 16,
		validation: {
			min: 0
		}
	},
	{
		key: 'fees_apply',
		label: 'Fees Apply',
		type: 'boolean',
		required: false,
		default: false,
		help: 'Are there fees or charges?',
		group: 'details',
		order: 17
	},
	{
		key: 'booking_required',
		label: 'Booking Required',
		type: 'boolean',
		required: false,
		default: false,
		group: 'details',
		order: 18
	},
	{
		key: 'notes',
		label: 'Notes',
		type: 'textarea',
		required: false,
		group: 'other',
		order: 19
	}
];

// ============================================================================
// BUILDING FEATURE SCHEMA
// ============================================================================

export const buildingFeatureSchema: PropertySchema[] = [
	{
		key: 'building_id',
		label: 'Building ID',
		type: 'text',
		required: true,
		readonly: true,
		group: 'identification',
		order: 1
	},
	{
		key: 'name',
		label: 'Building Name',
		type: 'text',
		required: false,
		help: 'Name of the building (if applicable)',
		group: 'identification',
		order: 2
	},
	{
		key: 'building_type',
		label: 'Building Type',
		type: 'select',
		required: true,
		group: 'classification',
		order: 3,
		options: [
			{ value: 'residential', label: 'Residential' },
			{ value: 'commercial', label: 'Commercial' },
			{ value: 'industrial', label: 'Industrial' },
			{ value: 'institutional', label: 'Institutional' },
			{ value: 'agricultural', label: 'Agricultural' },
			{ value: 'mixed-use', label: 'Mixed Use' },
			{ value: 'other', label: 'Other' }
		],
		validation: {
			required: true
		}
	},
	{
		key: 'use',
		label: 'Primary Use',
		type: 'select',
		required: false,
		group: 'classification',
		order: 4,
		options: [
			{ value: 'single-dwelling', label: 'Single Dwelling' },
			{ value: 'multi-dwelling', label: 'Multi Dwelling' },
			{ value: 'office', label: 'Office' },
			{ value: 'retail', label: 'Retail' },
			{ value: 'warehouse', label: 'Warehouse' },
			{ value: 'factory', label: 'Factory' },
			{ value: 'school', label: 'School' },
			{ value: 'hospital', label: 'Hospital' },
			{ value: 'barn', label: 'Barn/Shed' },
			{ value: 'other', label: 'Other' }
		]
	},
	{
		key: 'storeys',
		label: 'Number of Storeys',
		type: 'number',
		required: false,
		group: 'physical',
		order: 5,
		validation: {
			min: 1,
			max: 200
		}
	},
	{
		key: 'height',
		label: 'Height (m)',
		type: 'number',
		required: false,
		help: 'Building height in meters',
		group: 'physical',
		order: 6,
		validation: {
			min: 1,
			max: 1000
		}
	},
	{
		key: 'footprint_area',
		label: 'Footprint Area (m²)',
		type: 'number',
		required: false,
		readonly: true,
		help: 'Ground floor area',
		group: 'physical',
		order: 7
	},
	{
		key: 'total_floor_area',
		label: 'Total Floor Area (m²)',
		type: 'number',
		required: false,
		help: 'Total area of all floors',
		group: 'physical',
		order: 8
	},
	{
		key: 'construction_year',
		label: 'Year Built',
		type: 'number',
		required: false,
		group: 'history',
		order: 9,
		validation: {
			min: 1800,
			max: new Date().getFullYear()
		}
	},
	{
		key: 'renovation_year',
		label: 'Year of Last Renovation',
		type: 'number',
		required: false,
		group: 'history',
		order: 10,
		validation: {
			min: 1800,
			max: new Date().getFullYear()
		}
	},
	{
		key: 'construction_material',
		label: 'Construction Material',
		type: 'select',
		required: false,
		group: 'physical',
		order: 11,
		options: [
			{ value: 'brick', label: 'Brick' },
			{ value: 'concrete', label: 'Concrete' },
			{ value: 'steel', label: 'Steel Frame' },
			{ value: 'timber', label: 'Timber' },
			{ value: 'stone', label: 'Stone' },
			{ value: 'mixed', label: 'Mixed Materials' },
			{ value: 'other', label: 'Other' }
		]
	},
	{
		key: 'roof_type',
		label: 'Roof Type',
		type: 'select',
		required: false,
		group: 'physical',
		order: 12,
		options: [
			{ value: 'flat', label: 'Flat' },
			{ value: 'gabled', label: 'Gabled' },
			{ value: 'hipped', label: 'Hipped' },
			{ value: 'shed', label: 'Shed/Skillion' },
			{ value: 'other', label: 'Other' }
		]
	},
	{
		key: 'condition',
		label: 'Building Condition',
		type: 'select',
		required: false,
		group: 'status',
		order: 13,
		options: [
			{ value: 'excellent', label: 'Excellent' },
			{ value: 'good', label: 'Good' },
			{ value: 'fair', label: 'Fair' },
			{ value: 'poor', label: 'Poor' },
			{ value: 'derelict', label: 'Derelict' }
		]
	},
	{
		key: 'occupied',
		label: 'Occupied',
		type: 'boolean',
		required: false,
		default: true,
		group: 'status',
		order: 14
	},
	{
		key: 'heritage_listed',
		label: 'Heritage Listed',
		type: 'boolean',
		required: false,
		default: false,
		help: 'Is the building heritage listed?',
		group: 'special',
		order: 15
	},
	{
		key: 'heritage_listing',
		label: 'Heritage Listing Details',
		type: 'textarea',
		required: false,
		group: 'special',
		order: 16
	},
	{
		key: 'notes',
		label: 'Notes',
		type: 'textarea',
		required: false,
		group: 'other',
		order: 17
	}
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get schema for a specific layer
 */
export function getFeatureSchema(layerId: string): PropertySchema[] {
	const schemas: Record<string, PropertySchema[]> = {
		parcels: parcelFeatureSchema,
		roads: roadFeatureSchema,
		poi: poiFeatureSchema,
		buildings: buildingFeatureSchema
	};

	return schemas[layerId] || [];
}

/**
 * Get schema fields grouped by group name
 */
export function getSchemaByGroup(schema: PropertySchema[]): Record<string, PropertySchema[]> {
	return schema.reduce(
		(acc, field) => {
			const group = field.group || 'default';
			if (!acc[group]) {
				acc[group] = [];
			}
			acc[group].push(field);
			return acc;
		},
		{} as Record<string, PropertySchema[]>
	);
}

/**
 * Get required fields from schema
 */
export function getRequiredFields(schema: PropertySchema[]): string[] {
	return schema.filter((field) => field.required).map((field) => field.key);
}

/**
 * Get editable fields from schema
 */
export function getEditableFields(schema: PropertySchema[]): PropertySchema[] {
	return schema.filter((field) => !field.readonly);
}

/**
 * Validate feature properties against schema
 */
export function validateFeatureProperties(
	properties: Record<string, any>,
	schema: PropertySchema[]
): Record<string, string> {
	const errors: Record<string, string> = {};

	schema.forEach((field) => {
		const value = properties[field.key];

		// Check required
		if (field.required && (value === undefined || value === null || value === '')) {
			errors[field.key] = `${field.label} is required`;
			return;
		}

		// Skip validation if no value and not required
		if (!field.required && (value === undefined || value === null || value === '')) {
			return;
		}

		// Apply validation rules
		if (field.validation) {
			const validation = field.validation;

			// Pattern validation
			if (validation.pattern && !validation.pattern.test(String(value))) {
				errors[field.key] = `${field.label} has invalid format`;
			}

			// Min validation (for numbers)
			if (validation.min !== undefined && typeof value === 'number' && value < validation.min) {
				errors[field.key] = `${field.label} must be at least ${validation.min}`;
			}

			// Max validation (for numbers)
			if (validation.max !== undefined && typeof value === 'number' && value > validation.max) {
				errors[field.key] = `${field.label} must be at most ${validation.max}`;
			}

			// Custom validation
			if (validation.custom) {
				const customError = validation.custom(value, { properties } as any);
				if (customError) {
					errors[field.key] = customError;
				}
			}
		}
	});

	return errors;
}

/**
 * Get default values for a schema
 */
export function getDefaultValues(schema: PropertySchema[]): Record<string, any> {
	return schema.reduce(
		(acc, field) => {
			if (field.default !== undefined) {
				acc[field.key] = field.default;
			}
			return acc;
		},
		{} as Record<string, any>
	);
}

/**
 * Format field name for display (convert snake_case to Title Case)
 */
export function formatFieldName(fieldName: string): string {
	return fieldName
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/**
 * Get field by key
 */
export function getFieldByKey(schema: PropertySchema[], key: string): PropertySchema | undefined {
	return schema.find((field) => field.key === key);
}

/**
 * Filter schema by group
 */
export function filterSchemaByGroup(schema: PropertySchema[], group: string): PropertySchema[] {
	return schema.filter((field) => field.group === group);
}

/**
 * Sort schema by order property
 */
export function sortSchemaByOrder(schema: PropertySchema[]): PropertySchema[] {
	return [...schema].sort((a, b) => (a.order || 999) - (b.order || 999));
}
