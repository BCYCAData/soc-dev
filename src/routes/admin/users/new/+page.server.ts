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
	const { data: usersAdminNewUsersData, error: usersAdminNewUsersError } = await supabase.rpc(
		'get_user_vetting_data',
		{}
	);

	if (usersAdminNewUsersError) {
		console.log('error get New Users Admin Data:', usersAdminNewUsersError);
		throw error(400, usersAdminNewUsersError.message);
	}
	const { data: usersSendRFSPlanData, error: usersSendRFSPlanError } = await supabase.rpc(
		'get_user_sendrfsplan_data',
		{}
	);
	if (usersSendRFSPlanError) {
		console.log('error get New Users Admin Data:', usersSendRFSPlanError);
		throw error(400, usersSendRFSPlanError.message);
	}
	return {
		session,
		usersAdminNewUsersData: usersAdminNewUsersData,
		usersSendRFSPlanData: usersSendRFSPlanData
	};
};
