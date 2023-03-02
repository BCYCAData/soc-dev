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
	const { data: bcycaInformationData, error: bcycaInformationError } = await locals.dbClient.rpc(
		'get_user_bcyca_information_data',
		{}
	);
	if (bcycaInformationError) {
		console.log('error get BCYCA Information Sheet Choices Data:', bcycaInformationError);
		throw error(400, bcycaInformationError.message);
	}
	return {
		bcycaInformationData: bcycaInformationData
	};
};
