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
	const { data: externalEventsData, error: externalEventsError } = await supabase.rpc(
		'get_user_external_events_data',
		{}
	);
	if (externalEventsError) {
		console.log('error get external Meeting Choices Data:', externalEventsError);
		error(400, externalEventsError.message);
	}
	return {
		externalEventsData: externalEventsData
	};
};
