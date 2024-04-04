import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const session = await safeGetSession();
	if (!session) {
		redirect(307, '/auth/signin');
	} else if (
		!(
			session?.user?.app_metadata.roles.includes('tester') |
			session?.user?.app_metadata.roles.includes('admin')
		)
	) {
		error(401, { message: 'Unauthorized' });
	}
	const { data: bcycaInformationData, error: bcycaInformationError } = await supabase.rpc(
		'get_user_bcyca_information_data',
		{}
	);
	if (bcycaInformationError) {
		console.log('error get BCYCA Information Sheet Choices Data:', bcycaInformationError);
		error(400, bcycaInformationError.message);
	}
	return {
		session: session,
		bcycaInformationData: bcycaInformationData
	};
};
