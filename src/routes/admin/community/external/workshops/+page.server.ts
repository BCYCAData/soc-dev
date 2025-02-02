import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	setLoading(true);
	const { data: externalWorkshopsData, error: externalWorkshopsError } = await supabase.rpc(
		'get_user_external_workshops_data',
		{}
	);
	setLoading(false);
	if (externalWorkshopsError) {
		console.log('error get External Workshop Choices Data:', externalWorkshopsError);
		error(400, externalWorkshopsError.message);
	}
	return { externalWorkshopsData: externalWorkshopsData };
};
