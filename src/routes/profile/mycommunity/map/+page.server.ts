import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import type { MapDataJSON } from '$lib/types';

let mapData: MapDataJSON = { jsonLayers: [] };

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: allPoints, error: errorAll } = await locals.dbClient.rpc(
		'get_address_point_extract_wgs84'
	);
	if (errorAll) {
		console.log('error get Addresspoints:', errorAll);
		throw error(400, errorAll);
	}

	if (allPoints.length > 0) {
		mapData.jsonLayers[0] = allPoints;
		const { data: registeredPoints, error: errorRegistered } = await locals.dbClient.rpc(
			'get_registered_addresspoints'
		);
		if (errorRegistered) {
			console.log('error get registered Addresspoints:', errorRegistered);
			throw error(400, errorRegistered);
		}
		if (registeredPoints.length > 0) {
			mapData.jsonLayers[1] = registeredPoints;
			console.log(registeredPoints);
		}
	}
	if (mapData.jsonLayers.length > 0) {
		return { mapData };
	}
	throw error(400, 'Something went wrong with the map');
};
