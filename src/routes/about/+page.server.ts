import { error } from '@sveltejs/kit';

import type { MapDataJSON } from '$lib/types';

let mapData: MapDataJSON = { jsonLayers: [] };

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	const { data: allPoints, error: errorAll } = await supabase.rpc(
		'get_address_point_extract_wgs84'
	);
	if (errorAll) {
		console.log('error get Addresspoints:', errorAll);
		throw error(400, errorAll);
	}
	if (allPoints.length > 0) {
		mapData.jsonLayers[0] = allPoints;
		const { data: registeredPoints, error: errorRegistered } = await supabase.rpc(
			'get_registered_addresspoints'
		);
		if (errorRegistered) {
			console.log('error get registered Addresspoints:', errorRegistered);
			throw error(400, errorRegistered);
		}
		if (registeredPoints.length > 0) {
			mapData.jsonLayers[1] = registeredPoints;
		}
	}
	if (mapData.jsonLayers.length > 0) {
		return { session, mapData };
	}
	throw error(400, 'Something went wrong with the map');
};
