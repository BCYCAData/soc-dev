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
	const { data: externalWorkshopsData, error: externalWorkshopsError } = await supabase.rpc(
		'get_user_external_workshops_data',
		{}
	);
	if (externalWorkshopsError) {
		console.log('error get External Community Workshop Choices Data:', externalWorkshopsError);
		error(400, externalWorkshopsError.message);
	}
	return { externalWorkshopsData: externalWorkshopsData };
};
