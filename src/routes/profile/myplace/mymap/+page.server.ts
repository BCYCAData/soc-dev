import { error, redirect } from '@sveltejs/kit';
import { geometryToGeoJson } from '$lib/utils';

import type { MapDataJSON } from '$lib/types';
import type { PageServerLoad } from './$types';

let mapLayers: MapDataJSON = { jsonLayers: [] };

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session?.user) {
		redirect(307, '/auth/signin');
	}

	const { data: propertyGeometryData, error: propertyGeometryError } = await supabase.rpc(
		'get_property_geometry_for_user',
		{ id_input: session?.user.id }
	);
	if (propertyGeometryError) {
		console.log('error get Property Geometry:', propertyGeometryError);
		error(400, propertyGeometryError);
	}

	if (propertyGeometryData.length > 0) {
		mapLayers.jsonLayers[0] = geometryToGeoJson('property', propertyGeometryData[0].property);
		mapLayers.jsonLayers[1] = geometryToGeoJson(
			'address_point',
			propertyGeometryData[0].address_point
		);
		mapLayers.jsonLayers[2] = geometryToGeoJson('way_point', propertyGeometryData[0].way_point);
	}
	const minZoom: number = 19;

	if (mapLayers.jsonLayers.length > 0) {
		const mapCentre: [number, number] = [
			mapLayers.jsonLayers[1].geometry.coordinates[1],
			mapLayers.jsonLayers[1].geometry.coordinates[0]
		];
		return { mapLayers, mapCentre, minZoom };
	}
	error(400, 'Something went wrong with getting the property geometry');
};
