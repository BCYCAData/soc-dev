import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: mondrookCommunityMapData, error: mondrookCommunityMapDataError } =
		await supabase.rpc('get_community_data', { community_name: 'Mondrook' });
	if (mondrookCommunityMapDataError) {
		console.log('error getting Mondrook Community Map Data:', mondrookCommunityMapDataError);
		error(400, mondrookCommunityMapDataError);
	}
	const { community, mapExtent, addressPoints, registeredPoints } = mondrookCommunityMapData;

	return {
		community,
		mapExtent,
		addressPoints,
		registeredPoints
	};
};
