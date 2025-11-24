import type { LayerConfig } from '$lib/map/layers/schemas/layer-config.types';
import { parcelPopupTemplate } from '$lib/map/layers/templates/popup-templates';
import { formatArea } from '$lib/utils/formatters';

export const parcelsLayer: LayerConfig = {
	id: 'parcels',
	name: 'Property Parcels',
	description: 'Property boundaries and ownership information',
	geometryType: 'Polygon',
	category: 'Land Management',

	source: {
		rpcFunction: 'get_parcels_geojson',
		params: {
			// Default params - can be overridden at runtime
		},
		cacheKey: 'parcels',
		cacheDuration: 5 * 60 * 1000 // 5 minutes
	},

	styling: {
		mode: 'choropleth',

		base: {
			polygon: {
				fillColor: '#3388ff',
				fillOpacity: 0.3,
				color: '#2563eb',
				weight: 2,
				opacity: 0.8
			}
		},

		// Color by area size
		choropleth: {
			property: 'area',
			breaks: [1000, 5000, 10000, 50000],
			colors: ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'],
			method: 'quantile'
		},

		hover: {
			polygon: {
				fillOpacity: 0.6,
				weight: 3
			}
		},

		selection: {
			polygon: {
				fillColor: '#ff6600',
				fillOpacity: 0.7,
				color: '#ff6600',
				weight: 3
			}
		}
	},

	interaction: {
		popup: {
			enabled: true,
			template: parcelPopupTemplate,
			maxWidth: 400
		},

		tooltip: {
			enabled: true,
			template: (feature) => {
				const id = feature.properties?.parcel_id;
				const area = formatArea(feature.properties?.area);
				return `Parcel ${id} (${area})`;
			}
		},

		sidePanel: {
			enabled: true
		},

		click: {
			enabled: true,
			selectMode: 'single'
		},

		hover: {
			enabled: true,
			highlight: true
		}
	},

	query: {
		enabled: true,
		filters: [
			{
				id: 'area',
				label: 'Area',
				field: 'area',
				type: 'number',
				operators: ['gt', 'lt', 'between']
			},
			{
				id: 'zoning',
				label: 'Zoning',
				field: 'zoning',
				type: 'select',
				operators: ['eq', 'in'],
				options: [
					{ value: 'residential', label: 'Residential' },
					{ value: 'commercial', label: 'Commercial' },
					{ value: 'industrial', label: 'Industrial' },
					{ value: 'agricultural', label: 'Agricultural' }
				]
			},
			{
				id: 'owner',
				label: 'Owner',
				field: 'owner_name',
				type: 'text',
				operators: ['like', 'ilike']
			}
		],
		allowCustomFilters: true
	},

	editing: {
		enabled: true,
		allowCreate: false, // Parcels typically not created via UI
		allowUpdate: true,
		allowDelete: false,

		geometry: {
			editable: true,
			snapping: true,
			snapLayers: ['parcels'] // Snap to other parcels
		},

		properties: {
			editable: true,
			validation: {
				area: {
					required: true,
					min: 0
				},
				owner_name: {
					required: true
				},
				zoning: {
					required: true
				}
			}
		},

		operations: {
			update: 'update_parcel',
			delete: 'delete_parcel'
		}
	},

	properties: [
		{
			key: 'parcel_id',
			label: 'Parcel ID',
			type: 'text',
			required: true,
			readonly: true,
			group: 'identification',
			order: 1
		},
		{
			key: 'owner_name',
			label: 'Owner Name',
			type: 'text',
			required: true,
			group: 'ownership',
			order: 2
		},
		{
			key: 'owner_address',
			label: 'Owner Address',
			type: 'textarea',
			required: false,
			group: 'ownership',
			order: 3
		},
		{
			key: 'area',
			label: 'Area (m²)',
			type: 'number',
			required: true,
			readonly: true,
			group: 'attributes',
			order: 4
		},
		{
			key: 'zoning',
			label: 'Zoning',
			type: 'select',
			required: true,
			options: [
				{ value: 'residential', label: 'Residential' },
				{ value: 'commercial', label: 'Commercial' },
				{ value: 'industrial', label: 'Industrial' },
				{ value: 'agricultural', label: 'Agricultural' }
			],
			group: 'attributes',
			order: 5
		},
		{
			key: 'valuation',
			label: 'Property Valuation',
			type: 'number',
			required: false,
			help: 'Current property valuation in AUD',
			group: 'financial',
			order: 6
		},
		{
			key: 'last_sale_date',
			label: 'Last Sale Date',
			type: 'date',
			required: false,
			group: 'financial',
			order: 7
		}
	],

	display: {
		defaultVisible: true,
		minZoom: 12,
		pane: 'overlayPane',
		zIndex: 400
	}
};
