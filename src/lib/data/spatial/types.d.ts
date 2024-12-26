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
