import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: mondrookEventsData, error: mondrookEventsError } = await supabase.rpc(
		'get_user_mondrook_events_data',
		{}
	);

	if (mondrookEventsError) {
		console.log('error get Mondrook Meeting Choices Data:', mondrookEventsError);
		error(400, mondrookEventsError.message);
	}
	return {
		mondrookEventsData: mondrookEventsData
	};
};
