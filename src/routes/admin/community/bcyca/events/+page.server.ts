import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	setLoading;
	const { data: bcycaEventsData, error: bcycaEventsError } = await supabase.rpc(
		'get_user_bcyca_events_data',
		{}
	);
	setLoading(false);
	if (bcycaEventsError) {
		console.log('error get BCYCA Meeting Choices Data:', bcycaEventsError);
		error(400, bcycaEventsError.message);
	}
	return {
		bcycaEventsData: bcycaEventsData
	};
};
