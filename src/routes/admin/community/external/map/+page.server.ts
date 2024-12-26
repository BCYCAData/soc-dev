import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: externalCommunityMapData, error: externalCommunityMapDataError } =
		await supabase.rpc('get_community_data', { community_name: 'External' });
	if (externalCommunityMapDataError) {
		console.log('error getting External Community Map Data:', externalCommunityMapDataError);
		error(400, externalCommunityMapDataError);
	}
	const { community, mapExtent, addressPoints, registeredPoints } = externalCommunityMapData;

	return {
		community,
		mapExtent,
		addressPoints,
		registeredPoints
	};
};
