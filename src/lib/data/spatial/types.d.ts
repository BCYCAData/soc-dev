interface AddressPointsGeoJSON {
	allAddresspoints: GeoJSON.FeatureCollection<GeoJSON.Point, AllAddressPointProperties>;
	registeredAddresspoints: GeoJSON.FeatureCollection<
		GeoJSON.Point,
		RegisteredAddressPointProperties
	>;
	initialExtent: L.LatLngBoundsExpression | [[number, number], [number, number]];
	centre: L.LatLngExpression | [number, number];
}

interface AllAddressPointProperties {
	id: number;
	addresspointoid: number;
	enddate: string;
}

interface RegisteredAddressPointProperties {
	addresspointtype: string;
}

export interface GeoscapeLayer {
	tilejson: string;
	vector_layers: {
		id: string;
		fields: Record<string, string>;
		minzoom: number;
		maxzoom: number;
		geometry: string;
	}[];
	tiles: string[];
	attribution: string;
	bounds: [number, number, number, number];
	center: [number, number, number];
	description: string;
}
