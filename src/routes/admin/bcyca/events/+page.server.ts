import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session) {
		throw redirect(307, '/auth/signin');
	} else if (
		!(
			session?.user?.app_metadata.roles.includes('tester') |
			session?.user?.app_metadata.roles.includes('admin')
		)
	) {
		throw error(401, { message: 'Unauthorized' });
	}
	const { data: bcycaEventsData, error: bcycaEventsError } = await supabase.rpc(
		'get_user_bcyca_events_data',
		{}
	);
	if (bcycaEventsError) {
		console.log('error get BCYCA Meeting Choices Data:', bcycaEventsError);
		throw error(400, bcycaEventsError.message);
	}
	return {
		session: session,
		bcycaEventsData: bcycaEventsData
	};
};
