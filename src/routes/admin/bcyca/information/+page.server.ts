import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (
		!(
			session?.user?.app_metadata.roles.includes('tester') |
			session?.user?.app_metadata.roles.includes('admin')
		)
	) {
		throw redirect(307, '/auth/signin');
	}
	const { data: bcycaInformationData, error: bcycaInformationError } = await supabase.rpc(
		'get_user_bcyca_information_data',
		{}
	);
	if (bcycaInformationError) {
		console.log('error get BCYCA Information Sheet Choices Data:', bcycaInformationError);
		throw error(400, bcycaInformationError.message);
	}
	return {
		session: session,
		bcycaInformationData: bcycaInformationData
	};
};
