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
	const { data: tinoneeEventsData, error: tinoneeEventsError } = await supabase.rpc(
		'get_user_tinonee_events_data',
		{}
	);
	if (tinoneeEventsError) {
		console.log('error get Tinonee Meeting Choices Data:', tinoneeEventsError);
		error(400, tinoneeEventsError.message);
	}
	console.log('tinoneeEventsData:', tinoneeEventsData);
	return {
		tinoneeEventsData: tinoneeEventsData
	};
};
