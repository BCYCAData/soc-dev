// ---------context---------------
export const mapContext = Symbol();
export const layerControlContext = Symbol();
export const esriLeafletContext = Symbol();

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

export interface Geometry {
	type: string;
	crs: object;
	coordinates: number[];
}

export interface LeafletGeoJSON {
	type: string;
	properties: {
		id: string;
		principaladdresssiteoid: number;
		created_at: string;
		last_updated: string;
		featureType: string;
	};
	geometry: Geometry;
}

export function convertToLeafletGeoJSON(inputJSON: any[]): LeafletGeoJSON[] {
	return inputJSON.flatMap((item) => {
		const { id, principaladdresssiteoid, created_at, last_updated } = item;

		const addressPoint: Geometry = {
			type: item.address_point.type,
			crs: item.address_point.crs,
			coordinates: item.address_point.coordinates
		};

		const wayPoint: Geometry = {
			type: item.way_point.type,
			crs: item.way_point.crs,
			coordinates: item.way_point.coordinates
		};

		const property: Geometry = {
			type: item.property.type,
			crs: item.property.crs,
			coordinates: item.property.coordinates
		};

		const leafletGeoJSON: LeafletGeoJSON[] = [
			{
				type: 'Feature',
				properties: {
					id,
					principaladdresssiteoid,
					created_at,
					last_updated,
					featureType: 'AddressPoint'
				},
				geometry: addressPoint
			},
			{
				type: 'Feature',
				properties: {
					id,
					principaladdresssiteoid,
					created_at,
					last_updated,
					featureType: 'WayPoint'
				},
				geometry: wayPoint
			},
			{
				type: 'Feature',
				properties: {
					id,
					principaladdresssiteoid,
					created_at,
					last_updated,
					featureType: 'Property'
				},
				geometry: property
			}
		];

		return leafletGeoJSON;
	});
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
