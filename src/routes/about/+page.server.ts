import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: projectAddressPoints, error: errorAll } = await supabase.rpc(
		'get_addresspoints_geojson'
	);
	console.log('projectAddressPoints:', projectAddressPoints);
	if (errorAll) {
		console.log('error get project AddressPoints:', errorAll);
		error(400, errorAll);
	}
	return { projectAddressPoints };
};
