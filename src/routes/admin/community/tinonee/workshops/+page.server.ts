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
	const { data: tinoneeWorkshopsData, error: tinoneeWorkshopsError } = await supabase.rpc(
		'get_user_tinonee_workshops_data',
		{}
	);
	if (tinoneeWorkshopsError) {
		console.log('error get Tinonee Workshop Choices Data:', tinoneeWorkshopsError);
		error(400, tinoneeWorkshopsError.message);
	}
	return { tinoneeWorkshopsData: tinoneeWorkshopsData };
};
