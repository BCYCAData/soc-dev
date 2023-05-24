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
	const { data: bcycaWorkshopsData, error: bcycaWorkshopsError } = await supabase.rpc(
		'get_user_bcyca_workshops_data',
		{}
	);
	if (bcycaWorkshopsError) {
		console.log('error get BCYCA Workshop Choices Data:', bcycaWorkshopsError);
		throw error(400, bcycaWorkshopsError.message);
	}
	return {
		session: session,
		bcycaWorkshopsData: bcycaWorkshopsData
	};
};
