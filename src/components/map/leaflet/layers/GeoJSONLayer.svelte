<script lang="ts">
	// export interface FeatureCollection<G = Geometry | GeometryCollection, P = Properties>
	// 	extends GeoJSONObject {
	// 	type: 'FeatureCollection';
	// 	features: Array<Feature<G, P>>;
	// }

	import type { PropertyGeometryGeoJSON } from '$lib/types';

	export let propertyGeometryData: PropertyGeometryGeoJSON[];

	const geoJsonData: any = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: propertyGeometryData[0].address_point,
				properties: {
					id: propertyGeometryData[0].id,
					principaladdresssiteoid: propertyGeometryData[0].principaladdresssiteoid,
					created_at: propertyGeometryData[0].created_at,
					last_updated: propertyGeometryData[0].last_updated,
					customStyle: {
						color: '#f97316'
					}
				}
			},
			{
				type: 'Feature',
				geometry: propertyGeometryData[0].way_point,
				properties: {
					id: propertyGeometryData[0].id,
					principaladdresssiteoid: propertyGeometryData[0].principaladdresssiteoid,
					created_at: propertyGeometryData[0].created_at,
					last_updated: propertyGeometryData[0].last_updated,
					customStyle: {
						color: '#d6d6d6'
					}
				}
			},
			{
				type: 'Feature',
				geometry: propertyGeometryData[0].property,
				properties: {
					id: propertyGeometryData[0].id,
					principaladdresssiteoid: propertyGeometryData[0].principaladdresssiteoid,
					created_at: propertyGeometryData[0].created_at,
					last_updated: propertyGeometryData[0].last_updated
				}
			}
		]
	};
	// Represents a GeoJSON object or an array of GeoJSON objects.
	// Allows you to parse GeoJSON data and display it on the map. Extends FeatureGroup.

	// Usage example
	// L.geoJSON(data, {
	//     style: function (feature) {
	//         return {color: feature.properties.color};
	//     }
	// }).bindPopup(function (layer) {
	//     return layer.feature.properties.description;
	// }).addTo(map);
</script>
