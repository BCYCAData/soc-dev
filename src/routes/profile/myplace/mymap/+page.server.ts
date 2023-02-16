import { error, redirect } from '@sveltejs/kit';
import { geometryToGeoJson } from '$lib/utils';

import type { PageServerLoad } from './$types';
import type { MapDataJSON } from '$lib/types';
// import { map } from 'leaflet';

let mapLayers: MapDataJSON = { jsonLayers: [] };

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
	if (propertyGeometryData.length > 0) {
		mapLayers.jsonLayers[0] = geometryToGeoJson('property', propertyGeometryData[0].property);
		mapLayers.jsonLayers[1] = geometryToGeoJson(
			'address_point',
			propertyGeometryData[0].address_point
		);
		mapLayers.jsonLayers[2] = geometryToGeoJson('way_point', propertyGeometryData[0].way_point);
	}
	if (mapLayers.jsonLayers.length > 0) {
		return { mapLayers };
	}
	throw error(400, 'Something went wrong with getting the property geometry');
};
