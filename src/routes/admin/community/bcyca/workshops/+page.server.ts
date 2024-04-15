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
	const { data: bcycaWorkshopsData, error: bcycaWorkshopsError } = await supabase.rpc(
		'get_user_bcyca_workshops_data',
		{}
	);
	if (bcycaWorkshopsError) {
		console.log('error get BCYCA Workshop Choices Data:', bcycaWorkshopsError);
		error(400, bcycaWorkshopsError.message);
	}
	return { bcycaWorkshopsData: bcycaWorkshopsData };
};
