import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: bcycaCommunityMapData, error: bcycaCommunityMapDataError } = await supabase.rpc(
		'get_community_data',
		{ community_name: 'BCYCA' }
	);
	if (bcycaCommunityMapDataError) {
		console.log('error getting BCYCA Community Map Data:', bcycaCommunityMapDataError);
		error(400, bcycaCommunityMapDataError);
	}
	const { community, mapExtent, addressPoints, registeredPoints } = bcycaCommunityMapData;

	return {
		community,
		mapExtent,
		addressPoints,
		registeredPoints
	};
};
