import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	return {
		session,
		emergencyAdminData: {}
	};
};
