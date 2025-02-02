import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	setLoading(true);
	const { data: usersAdminNewUsersData, error: usersAdminNewUsersError } = await supabase.rpc(
		'get_user_vetting_data',
		{}
	);
	setLoading(false);
	if (usersAdminNewUsersError) {
		console.log('error get New Users Admin Data:', usersAdminNewUsersError);
		error(400, usersAdminNewUsersError.message);
	}
	return {
		usersAdminNewUsersData: usersAdminNewUsersData
	};
};
