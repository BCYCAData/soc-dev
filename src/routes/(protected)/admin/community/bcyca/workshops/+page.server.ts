import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: bcycaWorkshopsData, error: bcycaWorkshopsError } = await supabase.rpc(
		'get_user_bcyca_workshops_data',
		{}
	);

	if (bcycaWorkshopsError) {
		console.log('error get BCYCA Workshop Choices Data:', bcycaWorkshopsError);
		error(400, bcycaWorkshopsError.message);
	}
	return { bcycaWorkshopsData: bcycaWorkshopsData };
};
