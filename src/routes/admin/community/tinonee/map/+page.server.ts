import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: tinoneeCommunityMapData, error: tinoneeCommunityMapDataError } = await supabase.rpc(
		'get_community_data',
		{ community_name: 'Tinonee' }
	);

	if (tinoneeCommunityMapDataError) {
		console.log('error getting Tinonee Community Map Data:', tinoneeCommunityMapDataError);
		error(400, tinoneeCommunityMapDataError);
	}
	const { community, mapExtent, addressPoints, registeredPoints } = tinoneeCommunityMapData;

	return {
		community,
		mapExtent,
		addressPoints,
		registeredPoints
	};
};
