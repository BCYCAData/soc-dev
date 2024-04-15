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
	const { data: tinoneeInformationData, error: tinoneeInformationError } = await supabase.rpc(
		'get_user_tinonee_information_data',
		{}
	);
	if (tinoneeInformationError) {
		console.log('error get Tinonee Information Sheet Choices Data:', tinoneeInformationError);
		error(400, tinoneeInformationError.message);
	}
	return {
		tinoneeInformationData: tinoneeInformationData
	};
};
