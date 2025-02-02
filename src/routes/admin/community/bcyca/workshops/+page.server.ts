import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	setLoading(true);
	const { data: bcycaWorkshopsData, error: bcycaWorkshopsError } = await supabase.rpc(
		'get_user_bcyca_workshops_data',
		{}
	);
	setLoading(false);
	if (bcycaWorkshopsError) {
		console.log('error get BCYCA Workshop Choices Data:', bcycaWorkshopsError);
		error(400, bcycaWorkshopsError.message);
	}
	return { bcycaWorkshopsData: bcycaWorkshopsData };
};
