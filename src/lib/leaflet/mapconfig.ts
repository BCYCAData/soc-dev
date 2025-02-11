import type {
	GroupedSymbologyOptions,
	LineSymbologyOptions,
	PointSymbologyOptions,
	PolygonSymbologyOptions
} from '$lib/leaflet/types';

//+++++++++++++++++++Symbology Definitions++++++++++++++++++++++++++++

export const projectAddresspointsOptions: PointSymbologyOptions = {
	type: 'leaflet',
	options: {
		type: 'circleMarker',
		options: {
			fillColor: '#a5a5a5',
			weight: 0,
			radius: 3,
			fillOpacity: 0.8
		}
	}
};

export const registeredAddresspointsOptions: PointSymbologyOptions = {
	type: 'leaflet',
	options: {
		type: 'circleMarker',
		options: {
			fillColor: '#f97316',
			radius: 4,
			weight: 0,
			fillOpacity: 0.8
		}
	}
};

export const communityFillOptions: PolygonSymbologyOptions = {
	fillColor: '#3388ff',
	fillOpacity: 0.3,
	color: '#000',
	weight: 1,
	opacity: 1
};

export const addresspointOptions: PointSymbologyOptions = {
	type: 'custom',
	options: {
		markerShape: 'diamond',
		fillColour: '#f97316',
		size: 12,
		strokeColour: '#000',
		strokeWidth: 0,
		strokeOpacity: 1,
		fillOpacity: 0.8
	}
};

export const waypointOptions: PointSymbologyOptions = {
	type: 'custom',
	options: {
		markerShape: 'diamond',
		fillColour: '#a5a5a5',
		size: 12,
		strokeColour: '#000',
		strokeWidth: 0,
		strokeOpacity: 1,
		fillOpacity: 0.8
	}
};

export const propertyOptions: PolygonSymbologyOptions = {
	fillColor: '#3388ff',
	fillOpacity: 0.7,
	color: '#000',
	weight: 1,
	opacity: 1
};

export const kyngAddresspointsGeoJsonOptions: GroupedSymbologyOptions = {
	type: 'leaflet',
	propertyField: 'Address Point Type',
	options: {
		type: 'divIcon',
		options: {
			className: 'address-marker',
			iconSize: [10, 10],
			iconAnchor: [5, 5],
			html: ''
		}
	},
	groups: [
		{
			value: 'Property',
			label: 'Property Address',
			symbol: {
				type: 'leaflet',
				options: {
					type: 'divIcon',
					markerShape: 'square',
					options: {
						className: 'address-marker',
						color: 'blue',
						iconSize: [9, 9],
						iconAnchor: [4, 4],
						html: ''
					}
				}
			}
		},
		{
			value: 'Building',
			label: 'Building Address',
			symbol: {
				type: 'leaflet',
				options: {
					type: 'divIcon',
					markerShape: 'diamond',
					options: {
						className: 'address-marker',
						color: 'green',
						iconSize: [8, 8],
						iconAnchor: [4, 4],
						html: ''
					}
				}
			}
		},
		{
			value: 'Default',
			label: 'Address',
			symbol: {
				type: 'leaflet',
				options: {
					type: 'divIcon',
					markerShape: 'diamond',
					options: {
						className: 'address-marker',
						color: 'black',
						iconSize: [10, 10],
						iconAnchor: [5, 5],
						html: ''
					}
				}
			}
		}
	]
};

export const kyngAreaGeoJsonOptions: PolygonSymbologyOptions = {
	fillColor: 'transparent',
	fillOpacity: 0,
	weight: 5,
	color: 'magenta'
};

export const kyngProwayGeoJsonOptions: LineSymbologyOptions = {
	width: 1,
	color: 'steelblue',
	pattern: 'solid',
	lineCap: 'round',
	lineJoin: 'round'
};

export const kyngWayPointsGeoJsonOptions: PointSymbologyOptions = {
	type: 'leaflet',
	options: {
		type: 'circleMarker',
		options: {
			radius: 3,
			fillColor: 'red',
			color: 'black',
			weight: 1,
			fillOpacity: 1,
			className: 'waypoint-marker'
		}
	}
};

export const kyngPropertyAreasGeoJsonOptions: PolygonSymbologyOptions = {
	fillColor: 'transparent', // Default color that will be overridden
	fillOpacity: 0.3,
	weight: 1,
	color: 'black'
};

export const gnafAddressPointsOptions: PointSymbologyOptions = {
	type: 'leaflet',
	options: {
		type: 'textLabel',
		options: {
			html: 'street_number',
			className: 'text-label',
			iconSize: [20, 20],
			iconAnchor: [10, 10]
		} as L.DivIconOptions,
		tooltip: {
			permanent: false,
			direction: 'top'
		}
	}
};

//+++++++++++++++++++Base Layer Configurations++++++++++++++++++++++++++++

const streetBaseLayer = [
	{
		name: 'NSW Streets',
		url: `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}`,
		attribution: `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`
	}
];

const streetAerialBaseLayer = [
	{
		name: 'Air Photo',
		url: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}',
		attribution: `<a href='https://www.spatial.nsw.gov.au' target='_blank'>&copy; Spatial Services NSW </a>`
	},
	{
		name: 'Streets',
		url: 'https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}',
		attribution: `<a href='https://www.spatial.nsw.gov.au' target='_blank'>&copy; Spatial Services NSW </a>`
	}
];

const allBaseLayers = [
	{
		name: 'NSW Streets',
		url: `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Base_Map/MapServer/tile/{z}/{y}/{x}`,
		attribution: `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`
	},
	{
		name: 'NSW Aerial',
		url: `https://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer/tile/{z}/{y}/{x}`,
		attribution: `\u003ca href='https://www.spatial.nsw.gov.au' target='_blank'\u003e\u0026copy; Spatial Services NSW \u003c/a\u003e`
	},
	{
		name: 'OpenStreetMap',
		url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		attribution: '© OpenStreetMap contributors'
	},
	{
		name: 'Satellite',
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		attribution:
			'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
	}
];

// Feature styling configurations
export const featureStyles = {
	asset: {
		color: '#2196F3',
		weight: 3,
		opacity: 0.8,
		fillOpacity: 0.4
	},
	operational: {
		color: '#4CAF50',
		weight: 3,
		opacity: 0.8,
		fillOpacity: 0.4
	},
	hazard: {
		color: '#F44336',
		weight: 3,
		opacity: 0.8,
		fillOpacity: 0.4
	}
};

//+++++++++++++++++++Map Configurations++++++++++++++++++++++++++++
//about project tab map
export const aboutMapConfig = (initialExtent: [[number, number], [number, number]]) => ({
	initialExtent,
	zoomable: false,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: false, position: 'bottomright' as L.ControlPosition },
	editControl: { present: false },
	width: '100%',
	height: '99%',
	baseLayers: streetBaseLayer
});

//admin/site/data/addresses map
export const customAddressesMapConfig = (centre: [number, number]) => ({
	centre,
	zoom: 15,
	zoomable: true,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: false, position: 'bottomright' as L.ControlPosition },
	width: '100%',
	height: '99%',
	baseLayers: allBaseLayers
});

//admin/community/bcyca/map
export const adminCommunityBCYCAMapConfig = (
	initialExtent: [[number, number], [number, number]]
) => ({
	centre: undefined,
	zoom: undefined,
	minZoom: undefined,
	maxZoom: undefined,
	initialExtent: initialExtent,
	zoomable: true,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: true, position: 'bottomright' as L.ControlPosition },
	editControl: { present: false },
	width: '100%',
	height: '99%',
	baseLayers: streetBaseLayer
});

//admin/community/external/map
export const adminCommunityExternalMapConfig = (
	initialExtent: [[number, number], [number, number]]
) => ({
	centre: undefined,
	zoom: undefined,
	minZoom: undefined,
	maxZoom: undefined,
	initialExtent: initialExtent,
	zoomable: true,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: true, position: 'bottomright' as L.ControlPosition },
	editControl: { present: false },
	width: '100%',
	height: '99%',
	baseLayers: streetBaseLayer
});

//admin/community/mondrook/map
export const adminCommunityMondrookMapConfig = (
	initialExtent: [[number, number], [number, number]]
) => ({
	centre: undefined,
	zoom: undefined,
	minZoom: undefined,
	maxZoom: undefined,
	initialExtent: initialExtent,
	zoomable: true,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: true, position: 'bottomright' as L.ControlPosition },
	editControl: { present: false },
	width: '100%',
	height: '99%',
	baseLayers: streetBaseLayer
});

//admin/community/tinonee/map
export const adminCommunityTinoneeMapConfig = (
	initialExtent: [[number, number], [number, number]]
) => ({
	centre: undefined,
	zoom: undefined,
	minZoom: undefined,
	maxZoom: undefined,
	initialExtent: initialExtent,
	zoomable: true,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: true, position: 'bottomright' as L.ControlPosition },
	editControl: { present: false },
	width: '100%',
	height: '99%',
	baseLayers: streetBaseLayer
});

//kyng-coordinator/[kyng-area]/map
export const kyngCoordinatorKyngAreaMapConfig = (
	centre?: [number, number],
	bounds?: [[number, number], [number, number]],
	zoom?: number
) => ({
	// Use centre and zoom only when provided, otherwise undefined
	centre: centre || undefined,
	zoom: centre ? zoom || 13 : undefined,
	minZoom: undefined,
	maxZoom: undefined,
	// Always include bounds, but the map component will prioritize centre/zoom when they exist
	initialExtent: bounds,
	zoomable: true,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: true, position: 'bottomright' as L.ControlPosition },
	editControl: { present: false },
	width: '100%',
	height: '98%',
	baseLayers: streetAerialBaseLayer
});

//personal-profile/my-property/[propertyid]/my-map
export const myPropertyMapConfig = (
	centre: [number, number],
	bounds: [[number, number], [number, number]]
) => ({
	centre,
	initialExtent: bounds,
	minZoom: undefined,
	maxZoom: undefined,
	zoomable: true,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: false, position: 'bottomright' as L.ControlPosition },
	editControl: { present: true },
	width: '100%',
	height: '99%',
	baseLayers: allBaseLayers
});

//personal-profile/my-community/bcyca/map
export const myCommunityBCYCAMapConfig = (initialExtent: [[number, number], [number, number]]) => ({
	centre: undefined,
	zoom: undefined,
	minZoom: undefined,
	maxZoom: undefined,
	initialExtent,
	zoomable: true,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: true, position: 'bottomright' as L.ControlPosition },
	editControl: { present: false },
	width: '100%',
	height: '99%',
	baseLayers: streetBaseLayer
});

//personal-profile/my-community/external/map
export const myCommunityExternalMapConfig = (
	initialExtent: [[number, number], [number, number]]
) => ({
	centre: undefined,
	zoom: undefined,
	minZoom: undefined,
	maxZoom: undefined,
	initialExtent,
	zoomable: true,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: true, position: 'bottomright' as L.ControlPosition },
	editControl: { present: false },
	width: '100%',
	height: '99%',
	baseLayers: streetBaseLayer
});

//personal-profile/my-community/mondrook/map
export const myCommunityMondrookMapConfig = (
	initialExtent: [[number, number], [number, number]]
) => ({
	centre: undefined,
	zoom: undefined,
	minZoom: undefined,
	maxZoom: undefined,
	initialExtent,
	zoomable: true,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: true, position: 'bottomright' as L.ControlPosition },
	editControl: { present: false },
	width: '100%',
	height: '99%',
	baseLayers: streetBaseLayer
});

//personal-profile/my-community/tinonee/map
export const myCommunityTinoneeMapConfig = (
	initialExtent: [[number, number], [number, number]]
) => ({
	centre: undefined,
	zoom: undefined,
	minZoom: undefined,
	maxZoom: undefined,
	initialExtent,
	zoomable: true,
	zoomSnap: 0.25,
	scaleControl: { present: true, position: 'bottomleft' as L.ControlPosition },
	attributionControl: { present: true },
	layersControl: { present: true, position: 'topright' as L.ControlPosition },
	legend: { present: true, position: 'bottomright' as L.ControlPosition },
	editControl: { present: false },
	width: '100%',
	height: '99%',
	baseLayers: streetBaseLayer
});
