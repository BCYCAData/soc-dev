import { error, redirect } from '@sveltejs/kit';

import type { MapDataJSON } from '$lib/types';
import type { PageServerLoad } from './$types';

let mapData: MapDataJSON = { jsonLayers: [] };

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session?.user) {
		redirect(307, '/auth/signin');
	}
	const { data: allPoints, error: errorAll } = await supabase.rpc('get_address_point_extract');
	if (errorAll) {
		console.log('error get Addresspoints:', errorAll);
		error(400, errorAll);
	}

	if (allPoints.length > 0) {
		mapData.jsonLayers[0] = allPoints;
		const { data: registeredPoints, error: errorRegistered } = await supabase.rpc(
			'get_registered_addresspoints'
		);
		if (errorRegistered) {
			console.log('error get registered Addresspoints:', errorRegistered);
			error(400, errorRegistered);
		}
		if (registeredPoints.length > 0) {
			mapData.jsonLayers[1] = registeredPoints;
		}
	}
	if (mapData.jsonLayers.length > 0) {
		return { mapData };
	}
	error(400, 'Something went wrong with the map');
};
