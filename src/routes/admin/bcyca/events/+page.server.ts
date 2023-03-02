import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (
		!(
			locals.session?.user?.app_metadata.claims.includes('tester') |
			locals.session?.user?.app_metadata.claims.includes('admin')
		)
	) {
		throw redirect(307, '/auth/signin');
	}
	const { data: bcycaEventsData, error: bcycaEventsError } = await locals.dbClient.rpc(
		'get_user_bcyca_events_data',
		{}
	);
	if (bcycaEventsError) {
		console.log('error get BCYCA Meeting Choices Data:', bcycaEventsError);
		throw error(400, bcycaEventsError.message);
	}
	return {
		bcycaEventsData: bcycaEventsData
	};
};
