import type { LayerConfig } from '$lib/map/layers/schemas/layer-config.types';

export const poiLayer: LayerConfig = {
	id: 'poi',
	name: 'Points of Interest',
	description: 'Parks, facilities, and other points of interest',
	geometryType: 'Point',
	category: 'Amenities',

	source: {
		rpcFunction: 'get_poi_geojson',
		cacheKey: 'poi',
		cacheDuration: 15 * 60 * 1000
	},

	styling: {
		mode: 'categorized',

		base: {
			point: {
				radius: 8,
				fillColor: '#10b981',
				fillOpacity: 0.8,
				color: '#ffffff',
				weight: 2
			}
		},

		categorized: {
			property: 'category',
			categories: {
				park: {
					point: {
						radius: 8,
						fillColor: '#10b981',
						fillOpacity: 0.8,
						color: '#ffffff',
						weight: 2
					},
					label: 'Park'
				},
				school: {
					point: {
						radius: 8,
						fillColor: '#3b82f6',
						fillOpacity: 0.8,
						color: '#ffffff',
						weight: 2
					},
					label: 'School'
				},
				hospital: {
					point: {
						radius: 10,
						fillColor: '#ef4444',
						fillOpacity: 0.9,
						color: '#ffffff',
						weight: 2
					},
					label: 'Hospital'
				},
				library: {
					point: {
						radius: 7,
						fillColor: '#8b5cf6',
						fillOpacity: 0.8,
						color: '#ffffff',
						weight: 2
					},
					label: 'Library'
				}
			},
			default: {
				point: {
					radius: 6,
					fillColor: '#94a3b8',
					fillOpacity: 0.7
				},
				label: 'Other'
			}
		},

		hover: {
			point: {
				radius: 10,
				fillOpacity: 1,
				weight: 3
			}
		},

		selection: {
			point: {
				radius: 12,
				fillColor: '#ff6600',
				fillOpacity: 1,
				weight: 3
			}
		}
	},

	interaction: {
		popup: {
			enabled: true,
			template: (feature) => {
				const { name, category, description, address, hours } = feature.properties || {};
				return `
          <div class="poi-popup">
            <h3>${name}</h3>
            <div class="category">${category}</div>
            ${description ? `<p>${description}</p>` : ''}
            ${address ? `<div class="address">${address}</div>` : ''}
            ${hours ? `<div class="hours">Hours: ${hours}</div>` : ''}
          </div>
        `;
			}
		},

		tooltip: {
			enabled: true,
			property: 'name'
		},

		sidePanel: {
			enabled: true
		},

		click: {
			enabled: true,
			selectMode: 'multiple'
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
				id: 'category',
				label: 'Category',
				field: 'category',
				type: 'select',
				operators: ['eq', 'in'],
				options: [
					{ value: 'park', label: 'Park' },
					{ value: 'school', label: 'School' },
					{ value: 'hospital', label: 'Hospital' },
					{ value: 'library', label: 'Library' }
				]
			},
			{
				id: 'name',
				label: 'Name',
				field: 'name',
				type: 'text',
				operators: ['like', 'ilike']
			}
		]
	},

	editing: {
		enabled: true,
		allowCreate: true,
		allowUpdate: true,
		allowDelete: true,

		geometry: {
			editable: true
		},

		properties: {
			editable: true
		},

		operations: {
			create: 'create_poi',
			update: 'update_poi',
			delete: 'delete_poi'
		}
	},

	properties: [
		{
			key: 'name',
			label: 'Name',
			type: 'text',
			required: true
		},
		{
			key: 'category',
			label: 'Category',
			type: 'select',
			required: true,
			options: [
				{ value: 'park', label: 'Park' },
				{ value: 'school', label: 'School' },
				{ value: 'hospital', label: 'Hospital' },
				{ value: 'library', label: 'Library' },
				{ value: 'other', label: 'Other' }
			]
		},
		{
			key: 'description',
			label: 'Description',
			type: 'textarea',
			required: false
		},
		{
			key: 'address',
			label: 'Address',
			type: 'text',
			required: false
		},
		{
			key: 'hours',
			label: 'Opening Hours',
			type: 'text',
			required: false,
			help: 'e.g., Mon-Fri 9am-5pm'
		}
	],

	display: {
		defaultVisible: false,
		minZoom: 11,
		pane: 'markerPane',
		zIndex: 500
	}
};
