import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	setLoading(true);
	const { data: tinoneeWorkshopsData, error: tinoneeWorkshopsError } = await supabase.rpc(
		'get_user_tinonee_workshops_data',
		{}
	);
	setLoading(false);
	if (tinoneeWorkshopsError) {
		console.log('error get Tinonee Workshop Choices Data:', tinoneeWorkshopsError);
		error(400, tinoneeWorkshopsError.message);
	}
	return { tinoneeWorkshopsData: tinoneeWorkshopsData };
};
