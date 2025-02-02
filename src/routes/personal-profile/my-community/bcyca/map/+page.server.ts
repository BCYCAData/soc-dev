import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	setLoading(true);
	const { data: bcycaCommunityMapData, error: bcycaCommunityMapDataError } = await supabase.rpc(
		'get_community_data',
		{ community_name: 'BCYCA' }
	);
	setLoading(false);
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
