import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: mondrookWorkshopsData, error: mondrookWorkshopsError } = await supabase.rpc(
		'get_user_mondrook_workshops_data',
		{}
	);
	if (mondrookWorkshopsError) {
		console.log('error get Mondrook Workshop Choices Data:', mondrookWorkshopsError);
		error(400, mondrookWorkshopsError.message);
	}
	return { mondrookWorkshopsData: mondrookWorkshopsData };
};
