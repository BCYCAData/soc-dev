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
	const { data: mondrookWorkshopsData, error: mondrookWorkshopsError } = await supabase.rpc(
		'get_user_mondrook_workshops_data',
		{}
	);
	if (mondrookWorkshopsError) {
		console.log('error get Mondrook Workshop Choices Data:', mondrookWorkshopsError);
		error(400, mondrookWorkshopsError.message);
	}
	return { mondrookWorkshopsData: mondrookWorkshopsData };
};
