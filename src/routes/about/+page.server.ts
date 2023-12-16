import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: allPoints, error: errorAll } = await supabase.rpc(
		// 'get_address_point_extract_wgs84'
		'get_address_point_extract'
	);
	if (errorAll) {
		console.log('error get Addresspoints:', errorAll);
		error(400, errorAll);
	}
	if (allPoints.length > 0) {
		const { data: registeredPoints, error: errorRegistered } = await supabase.rpc(
			'get_registered_addresspoints'
		);
		if (errorRegistered) {
			console.log('error get registered Addresspoints:', errorRegistered);
			error(400, errorRegistered);
		}
		if (registeredPoints.length > 0) {
			return { allPoints, registeredPoints };
		}
	}
	error(400, 'Something went wrong with the map');
};
