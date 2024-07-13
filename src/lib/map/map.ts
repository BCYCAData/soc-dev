import { get } from 'svelte/store';
import { featuresStore, geoJSONLayersStore, userInfo } from '$stores/leaflet';

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
import type { Feature, GeoJsonObject } from 'geojson';

// ---------context---------------
export const leafletContext = Symbol();
export const mapContext = Symbol();
export const layerControlContext = Symbol();
export const esriLeafletContext = Symbol();

// ---------types---------------
export type UserInfo = {
	name: string;
	details: string;
};

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

let existingColors: Color[] = [];

export let kyngPropertyAreasGeoJsonOptions: L.GeoJSONOptions = {
	style: function (feature) {
		// const fillColour = stringToPastelColor((feature?.properties['Address']).toString());
		const fillColour = generateUniqueColorForKey(
			(feature?.properties['Principal Address Site OID']).toString(),
			existingColors
		);
		// const fillColour = stringToColor(
		// 	(feature?.properties['Principal Address Site OID']).toString()
		// );
		console.log('fillColour', fillColour);
		return {
			fillColor: fillColour,
			fillOpacity: 0.3,
			weight: 1,
			color: 'black'
		};
	},
	onEachFeature: function (feature, layer: L.GeoJSON) {
		// featuresStore.update((features) => [...features, feature]);
		layer.on({
			click: (e) => {
				// userInfo.set({
				// 	address: `Address: ${feature.properties['Address']}`,
				// 	details: `Details`
				// });
				console.log('1', feature);
				console.log('2', feature.properties.rowid);
				// // Toggle highlight property
				feature.properties.highlight = !feature.properties.highlight;
				// Update the store with the selected feature
				// featuresStore.update((features: Feature[]) => {
				// 	return features.map((f) =>
				// 		f.id === feature.id ? { ...f, ...feature, highlight: feature.properties.highlight } : f
				// 	);
				// });
			},
			mouseover: (e) => {
				// highlightFeature(e, feature.properties['Principal Address Site OID']);
				highlightFeature(e.target);
			},
			mouseout: (e) => {
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

// function highlightFeature(e: LeafletMouseEvent, principalsiteoid: number) {
// 	const layer = e.target;
function highlightFeature(feature: L.GeoJSON) {
	const layer = feature;
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

function stringToPastelColor(key: string): string {
	let hash = 0;
	for (let i = 0; i < key.length; i++) {
		// Introduce variability in how each character influences the hash
		hash = key.charCodeAt(i) * (i + 1) + ((hash << 5) - hash);
	}

	let color = '#';
	for (let i = 0; i < 3; i++) {
		// Use different operations for R, G, B to reduce collision chances
		let value = hash;
		if (i === 1) {
			// Green
			value = hash >> (i * 4); // Shift right by a smaller amount for green
		} else if (i === 2) {
			// Blue
			value = hash << (i * 4); // Shift left for blue
		}
		value = value & 0xff;

		// Ensure the value is within a range that avoids too light or too dark colors
		const minValue = 100; // Ensures some level of saturation
		const maxValue = 200; // Avoids near-white colors
		const adjustedValue = Math.min(maxValue, Math.max(value + minValue, minValue));

		color += ('00' + adjustedValue.toString(16)).slice(-2);
	}
	return color;
}

function stringToColor(key: string) {
	let hash = 0;
	for (let i = 0; i < key.length; i++) {
		hash = key.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = '#';
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff;
		color += ('00' + value.toString(16)).substr(-2);
	}
	console.log('Address: %c  Colour: %d', key, color);
	return color;
}

interface Color {
	r: number;
	g: number;
	b: number;
}

function hashStringToColor(input: string): Color {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = input.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Convert hash to RGB color
	const r = (hash & 0xff0000) >> 16;
	const g = (hash & 0x00ff00) >> 8;
	const b = hash & 0x0000ff;

	return { r, g, b };
}

function ensureUniqueColor(color: Color, existingColors: Color[]): Color {
	// Simple check for exact match; could be enhanced for "near-match"
	for (const existingColor of existingColors) {
		if (existingColor.r === color.r && existingColor.g === color.g && existingColor.b === color.b) {
			// Collision detected; adjust color slightly
			return { r: color.r, g: color.g, b: (color.b + 1) % 256 };
		}
	}
	return color; // No collision
}

function generateUniqueColorForKey(key: string, existingColors: Color[]): string {
	let color = hashStringToColor(key);
	color = ensureUniqueColor(color, existingColors);

	// Convert color object to hex string
	const toHex = (value: number) => value.toString(16).padStart(2, '0');
	return '#' + toHex(color.r) + toHex(color.g) + toHex(color.b);
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
