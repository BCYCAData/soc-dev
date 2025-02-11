import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	const { data: bcycaEventsData, error: bcycaEventsError } = await supabase.rpc(
		'get_user_bcyca_events_data',
		{}
	);

	if (bcycaEventsError) {
		console.log('error get BCYCA Meeting Choices Data:', bcycaEventsError);
		error(400, bcycaEventsError.message);
	}
	return {
		bcycaEventsData: bcycaEventsData
	};
};
