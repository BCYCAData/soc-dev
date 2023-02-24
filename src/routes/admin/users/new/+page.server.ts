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
	const { data: usersAdminNewUsersData, error: usersAdminNewUsersError } =
		await locals.dbClient.rpc('get_user_vetting_data', {});

	if (usersAdminNewUsersError) {
		console.log('error get New Users Admin Data:', usersAdminNewUsersError);
		throw error(400, usersAdminNewUsersError.message);
	}
	const { data: usersSendRFSPlanData, error: usersSendRFSPlanError } = await locals.dbClient.rpc(
		'get_user_sendrfsplan_data',
		{}
	);
	if (usersSendRFSPlanError) {
		console.log('error get New Users Admin Data:', usersSendRFSPlanError);
		throw error(400, usersSendRFSPlanError.message);
	}
	return {
		usersAdminNewUsersData: usersAdminNewUsersData,
		usersSendRFSPlanData: usersSendRFSPlanData
	};
};
