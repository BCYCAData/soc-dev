import type { LayerConfig } from '$lib/map/layers/schemas/layer-config.types';

export const roadsLayer: LayerConfig = {
	id: 'roads',
	name: 'Roads',
	description: 'Road network with classification',
	geometryType: 'LineString',
	category: 'Infrastructure',

	source: {
		rpcFunction: 'get_roads_geojson',
		cacheKey: 'roads',
		cacheDuration: 10 * 60 * 1000 // 10 minutes
	},

	styling: {
		mode: 'categorized',

		base: {
			line: {
				color: '#64748b',
				weight: 3,
				opacity: 0.8
			}
		},

		categorized: {
			property: 'road_type',
			categories: {
				highway: {
					line: {
						color: '#dc2626',
						weight: 5,
						opacity: 1
					},
					label: 'Highway'
				},
				main: {
					line: {
						color: '#f97316',
						weight: 4,
						opacity: 0.9
					},
					label: 'Main Road'
				},
				local: {
					line: {
						color: '#64748b',
						weight: 2,
						opacity: 0.7
					},
					label: 'Local Road'
				},
				track: {
					line: {
						color: '#a8a29e',
						weight: 1,
						opacity: 0.5,
						dashArray: '5, 5'
					},
					label: 'Track'
				}
			},
			default: {
				line: {
					color: '#94a3b8',
					weight: 2
				},
				label: 'Unknown'
			}
		},

		hover: {
			line: {
				weight: 6,
				opacity: 1
			}
		}
	},

	interaction: {
		popup: {
			enabled: true,
			fields: ['name', 'road_type', 'surface', 'lanes', 'speed_limit']
		},

		tooltip: {
			enabled: true,
			property: 'name'
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
				id: 'road_type',
				label: 'Road Type',
				field: 'road_type',
				type: 'select',
				operators: ['eq', 'in'],
				options: [
					{ value: 'highway', label: 'Highway' },
					{ value: 'main', label: 'Main Road' },
					{ value: 'local', label: 'Local Road' },
					{ value: 'track', label: 'Track' }
				]
			},
			{
				id: 'surface',
				label: 'Surface',
				field: 'surface',
				type: 'select',
				operators: ['eq'],
				options: [
					{ value: 'paved', label: 'Paved' },
					{ value: 'gravel', label: 'Gravel' },
					{ value: 'dirt', label: 'Dirt' }
				]
			}
		]
	},

	editing: {
		enabled: true,
		allowCreate: true,
		allowUpdate: true,
		allowDelete: true,

		geometry: {
			editable: true,
			snapping: true,
			snapLayers: ['roads']
		},

		properties: {
			editable: true
		},

		operations: {
			create: 'create_road',
			update: 'update_road',
			delete: 'delete_road'
		}
	},

	properties: [
		{
			key: 'name',
			label: 'Road Name',
			type: 'text',
			required: true
		},
		{
			key: 'road_type',
			label: 'Road Type',
			type: 'select',
			required: true,
			options: [
				{ value: 'highway', label: 'Highway' },
				{ value: 'main', label: 'Main Road' },
				{ value: 'local', label: 'Local Road' },
				{ value: 'track', label: 'Track' }
			]
		},
		{
			key: 'surface',
			label: 'Surface',
			type: 'select',
			required: true,
			options: [
				{ value: 'paved', label: 'Paved' },
				{ value: 'gravel', label: 'Gravel' },
				{ value: 'dirt', label: 'Dirt' }
			]
		},
		{
			key: 'lanes',
			label: 'Number of Lanes',
			type: 'number',
			required: false,
			validation: { min: 1, max: 10 }
		},
		{
			key: 'speed_limit',
			label: 'Speed Limit (km/h)',
			type: 'number',
			required: false,
			validation: { min: 10, max: 130 }
		}
	],

	display: {
		defaultVisible: true,
		minZoom: 10,
		pane: 'overlayPane',
		zIndex: 300
	}
};
