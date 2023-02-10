import { error, redirect } from '@sveltejs/kit';
import { geometryToGeoJson } from '$lib/utils';

import type { PageServerLoad } from './$types';
import type { MapDataJSON } from '$lib/types';
// import { map } from 'leaflet';

let mapData: MapDataJSON = { jsonLayers: [] };

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: propertyGeometryData, error: propertyGeometryError } = await locals.dbClient.rpc(
		'get_property_geometry_for_user',
		{ id_input: locals.session?.user.id }
	);
	if (propertyGeometryError) {
		console.log('error get Property Geometry:', propertyGeometryError);
		throw error(400, propertyGeometryError);
	}
	console.log(propertyGeometryData);

	if (propertyGeometryData.length > 0) {
		console.log(propertyGeometryData[0].property);

		mapData.jsonLayers[0] = geometryToGeoJson('property', propertyGeometryData[0].property);
		console.log(mapData.jsonLayers[0]);
	}
	if (mapData.jsonLayers.length > 0) {
		return { mapData: mapData };
	}
	throw error(400, 'Something went wrong with the map');
};
