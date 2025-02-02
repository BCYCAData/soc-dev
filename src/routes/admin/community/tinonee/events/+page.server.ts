import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	setLoading(true);
	const { data: tinoneeEventsData, error: tinoneeEventsError } = await supabase.rpc(
		'get_user_tinonee_events_data',
		{}
	);
	setLoading(false);
	if (tinoneeEventsError) {
		console.log('error get Tinonee Meeting Choices Data:', tinoneeEventsError);
		error(400, tinoneeEventsError.message);
	}
	return {
		tinoneeEventsData: tinoneeEventsData
	};
};
