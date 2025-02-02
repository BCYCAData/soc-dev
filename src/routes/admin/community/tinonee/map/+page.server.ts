import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	setLoading(true);
	const { data: tinoneeCommunityMapData, error: tinoneeCommunityMapDataError } = await supabase.rpc(
		'get_community_data',
		{ community_name: 'Tinonee' }
	);
	setLoading(false);
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
