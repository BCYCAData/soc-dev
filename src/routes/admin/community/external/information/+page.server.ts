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
	const { data: externalInformationData, error: externalInformationError } = await supabase.rpc(
		'get_user_external_information_data',
		{}
	);
	if (externalInformationError) {
		console.log(
			'error get External Community Information Sheet Choices Data:',
			externalInformationError
		);
		error(400, externalInformationError.message);
	}
	return {
		externalInformationData: externalInformationData
	};
};
