import { get } from 'svelte/store';
import { geoJSONLayersStore } from '$stores/leaflet';

import {
	circleMarker,
	marker,
	divIcon,
	popup,
	tooltip,
	point,
	type LeafletMouseEvent,
	Layer
} from 'leaflet';
import type { GeoJsonObject } from 'geojson';

// ---------context---------------
export const leafletContext = Symbol();
export const mapContext = Symbol();
export const layerControlContext = Symbol();
export const esriLeafletContext = Symbol();

// ---------types---------------
export type KyngGeoJsonData = {
	kyngArea: GeoJsonObject;
	addressPoints: GeoJsonObject;
	propertyAreas: GeoJsonObject;
	prowayLines: GeoJsonObject;
	wayPoints: GeoJsonObject;
};
export type AboutGeoJsonData = {
	allAddresspoints: GeoJsonObject;
	registeredAddresspoints: GeoJsonObject;
};
export type LeafletBaseMapLayer = {
	lable: string;
	url: string;
	options: L.TileLayerOptions;
};
export type LeafletOverlayMapLayer = {
	name: string;
	lable: string;
	data: any;
	options: L.LayerOptions;
};

export type CRS = {
	type: string;
	properties: {
		name: string;
	};
};

export type Geometry = {
	crs: CRS;
	type: string;
	coordinates: number[];
};

export type LeafletGeoJSON = {
	type: string;
	properties: {
		id: string;
		principaladdresssiteoid: number;
		created_at: string;
		last_updated: string;
		featureType: string;
	};
	geometry: Geometry;
};

// ---------styles---------------
export const propertyFeatureStyle = {
	color: '#ff7800',
	fillColor: '#ff7800',
	weight: 2,
	opacity: 1,
	fillOpacity: 0.05
};

export const waypointFeatureStyle = {
	radius: 6,
	fillColor: 'blue',
	color: 'white',
	weight: 1,
	opacity: 1,
	fillOpacity: 0.7
};

export const addresspointFeatureStyle = {
	radius: 6,
	fillColor: 'blue',
	color: 'white',
	weight: 1,
	opacity: 1,
	fillOpacity: 0.7
};

export const wayFeatureStyle = {
	color: '#33cc33',
	fillColor: '#33cc33',
	weight: 2,
	opacity: 1,
	fillOpacity: 0.05
};

// ---------GeoJsonOptions---------------

export let aboutAddresspointsGeoJsonOptions: L.GeoJSONOptions = {
	pointToLayer: function (feature, latlng) {
		const circleSymbol = circleMarker(latlng, {
			color: '#a5a5a5',
			weight: 0,
			radius: 2,
			fillOpacity: 0.5
		});
		return circleSymbol;
	}
};
export let registeredAddresspointsGeoJsonOptions: L.GeoJSONOptions = {
	pointToLayer: function (feature, latlng) {
		const circleSymbol = circleMarker(latlng, {
			color: '#f97316',
			weight: 0,
			radius: 3,
			fillOpacity: 0.9
		});
		return circleSymbol;
	}
};

export let kyngAddresspointsGeoJsonOptions: L.GeoJSONOptions = {
	pointToLayer: function (feature, latlng) {
		const addressPointType = feature.properties['Address Point Type'];
		const housenumber = feature.properties['House Number'];
		const htmlContent = getAddressPointDivSymbol(addressPointType, housenumber, 8);

		// Check if this location has been marked before
		let tooltipDirectionCounter: { [key: string]: number } = {};
		if (!tooltipDirectionCounter[latlng.toString()]) {
			tooltipDirectionCounter[latlng.toString()] = 0;
		}
		let directionIndex = tooltipDirectionCounter[latlng.toString()]++;
		let direction = ['right', 'left', 'top', 'bottom', 'center'][directionIndex % 5];
		const label = feature.properties['House Number'];

		const diamondMarker = marker(latlng, {
			icon: divIcon({
				className: 'diamond-marker',
				iconAnchor: [3, 6],
				html: htmlContent
			})
		});

		diamondMarker.bindTooltip(label, {
			permanent: true,
			direction: direction as 'right' | 'left' | 'top' | 'bottom' | 'center' | undefined,
			className: 'custom-lable',
			offset: [-7, -10]
		});

		return diamondMarker;
	}
};

export let kyngWayPointsGeoJsonOptions: L.GeoJSONOptions = {
	pointToLayer: function (feature, latlng): L.Layer {
		// Check if this location has been marked before
		let tooltipDirectionCounter: { [key: string]: number } = {};
		if (!tooltipDirectionCounter[latlng.toString()]) {
			tooltipDirectionCounter[latlng.toString()] = 0;
		}
		let directionIndex = tooltipDirectionCounter[latlng.toString()]++;
		let direction = ['right', 'left', 'top', 'bottom', 'center'][directionIndex % 5];
		const label = feature.properties['House Number'];
		const circleSymbol = circleMarker(latlng, {
			radius: 3,
			fillColor: 'red',
			color: 'black',
			weight: 1,
			fillOpacity: 1
		});
		circleSymbol.bindTooltip(label, {
			permanent: true,
			direction: direction as 'right' | 'left' | 'top' | 'bottom' | 'center' | undefined,
			className: 'custom-lable',
			offset: [-7, -10]
		});
		return circleSymbol;
	}
};

export let kyngProwayGeoJsonOptions: L.GeoJSONOptions = {
	style: function (feature) {
		return {
			weight: 1,
			color: 'steelblue'
		};
	}
};

export let kyngPropertyAreasGeoJsonOptions: L.GeoJSONOptions = {
	style: function (feature) {
		const fillColour = getRandomPastelColour();
		return {
			fillColor: fillColour,
			fillOpacity: 0.5,
			weight: 1,
			color: 'black'
		};
	},
	onEachFeature: function (feature, layer: L.GeoJSON) {
		layer.on({
			mouseover: (e) => {
				console.log('In', layer);
				highlightFeature(e, feature.properties['Principal Address Site OID']);
			},
			mouseout: (e) => {
				console.log('Out', layer);
				resetHighlight(e, 'Property Areas', layer);
			}
		});
	}
};

export let kyngAreaGeoJsonOptions: L.GeoJSONOptions = {
	style: function (feature) {
		return {
			fillColor: 'transparent',
			fillOpacity: 0,
			weight: 5,
			color: 'magenta'
		};
	}
};

// ---------Functions---------------

function highlightFeature(e: LeafletMouseEvent, principalsiteoid: number) {
	const layer = e.target;
	layer.setStyle({
		weight: 5,
		color: '#f97316',
		dashArray: '',
		fillOpacity: 0.7
	});

	layer.bringToFront();
	// waypoint.eachLayer(function (waypointLayer) {
	// 	if (waypointLayer.feature.properties.principalsiteoid === principalsiteoid) {
	// 		waypointLayer.setStyle({
	// 			fillColor: 'yellow',
	// 			fillOpacity: 1
	// 		});
	// 	}
	// });
}

function resetHighlight(e: LeafletMouseEvent, layerName: string, feature: Layer) {
	const layers = get(geoJSONLayersStore);
	const geoJSONLayer = layers[layerName].layer;
	let x = (geoJSONLayer.getLayers()[0].options as L.PathOptions).fillColor;
	console.log(x);
	if (geoJSONLayer) {
		geoJSONLayer.resetStyle(feature);
	}
}
// function resetHighlight(e: LeafletMouseEvent, layer: any) {
// 	layer.resetStyle(e.target);
// }
function getMarkerColour(addressPointType: string, housenumber: string | null) {
	let markerColor;

	switch (addressPointType) {
		case 'Property':
			markerColor = 'blue';
			break;
		case 'Building':
			markerColor = 'green';
			break;
		default:
			markerColor = 'black';
	}

	// Check if housenumber is null or not null
	if (housenumber === null) {
		// If housenumber is null, add a pattern to the marker color
		markerColor =
			markerColor +
			' repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.2) 5px, rgba(0,0,0,0.2) 10px)';
	} else {
		// If housenumber is not null, use a solid color
		markerColor = markerColor;
	}

	return markerColor;
}
function getAddressPointDivSymbol(addressPointType: string, housenumber: string | null, size = 6) {
	let markerColor;
	switch (addressPointType) {
		case 'Property':
			markerColor = 'blue';
			break;
		case 'Building':
			markerColor = 'green';
			break;
		default:
			markerColor = 'black';
	}
	let htmlContent;
	if (housenumber === null) {
		// If housenumber is null, use a diamond
		htmlContent = `<div style="border: solid 1px black; width: ${size}px; height: ${size}px; 
					transform: rotate(45deg); background: ${markerColor};"></div>`;
	} else {
		// If housenumber is not null, use a square
		htmlContent = `<div style="border: solid 1px black; width: ${size}px; height: ${size}px; background: ${markerColor};"></div>`;
	}
	return htmlContent;
}
function getRandomPastelColour() {
	const hue = Math.floor(Math.random() * 360);
	const saturation = Math.floor(Math.random() * 50) + 50; // Between 50% and 100%
	const lightness = Math.floor(Math.random() * 20) + 70; // Between 70% and 90%
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// ----Path Options-----
// An abstract class that contains options and constants shared between vector overlays (Polygon, Polyline, Circle).
// Do not use it directly. Extends Layer.
//      stroke	Boolean	true	Whether to draw stroke along the path. Set it to false to disable borders on polygons or circles.
//      color	String	'#3388ff'	Stroke color
//      weight	Number	3	Stroke width in pixels
//      opacity	Number	1.0	Stroke opacity
//      lineCap	String	'round'	A string that defines shape to be used at the end of the stroke.
//      lineJoin	String	'round'	A string that defines shape to be used at the corners of the stroke.
//      dashArray	String	null	A string that defines the stroke dash pattern. Doesn't work on Canvas-powered layers in some old browsers.
//      dashOffset	String	null	A string that defines the distance into the dash pattern to start the dash. Doesn't work on Canvas-powered layers in some old browsers.
//      fill	Boolean	depends	Whether to fill the path with color. Set it to false to disable filling on polygons or circles.
//      fillColor	String	*	Fill color. Defaults to the value of the color option
//      fillOpacity	Number	0.2	Fill opacity.
//      fillRule	String	'evenodd'	A string that defines how the inside of a shape is determined.
//      bubblingMouseEvents	Boolean	true	When true, a mouse event on this path will trigger the same event on the map (unless L.DomEvent.stopPropagation is used).
//      renderer	Renderer		Use this specific instance of Renderer for this path. Takes precedence over the map's default renderer.
//      className	String	null	Custom class name set on an element. Only for SVG renderers

// ----CircleMarker-----
// A circle of a fixed size with radius specified in pixels. Extends Path.
//      All of the above
//      radius	Number	10	Radius of the circle marker, in pixels
