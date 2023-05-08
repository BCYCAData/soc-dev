import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session) {
		// the user is not signed in
		throw error(401, { message: 'Unauthorized' });
	}
	return {
		session,
		usersAdminKitsData: {}
	};
};
