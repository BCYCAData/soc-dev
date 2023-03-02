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
	const { data: bcycaWorkshopsData, error: bcycaWorkshopsError } = await locals.dbClient.rpc(
		'get_user_bcyca_workshops_data',
		{}
	);
	if (bcycaWorkshopsError) {
		console.log('error get BCYCA Workshop Choices Data:', bcycaWorkshopsError);
		throw error(400, bcycaWorkshopsError.message);
	}
	return {
		bcycaWorkshopsData: bcycaWorkshopsData
	};
};
