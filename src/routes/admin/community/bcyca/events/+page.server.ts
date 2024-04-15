import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getUser } }) => {
	const { user } = await getUser();
	if (!user) {
		redirect(307, '/auth/signin');
	} else if (
		!(user?.app_metadata.roles.includes('tester') | user?.app_metadata.roles.includes('admin'))
	) {
		error(401, { message: 'Unauthorized' });
	}
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
