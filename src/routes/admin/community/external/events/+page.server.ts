import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	setLoading(true);
	const { data: externalEventsData, error: externalEventsError } = await supabase.rpc(
		'get_user_external_events_data',
		{}
	);
	setLoading(false);
	if (externalEventsError) {
		console.log('error get External Meeting Choices Data:', externalEventsError);
		error(400, externalEventsError.message);
	}
	return {
		externalEventsData: externalEventsData
	};
};
