import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async (event) => {
		const { error: logoutError } = await event.locals.supabase.auth.signOut();

		if (logoutError) {
			return {
				success: false,
				error: 'Failed to log out'
			};
		}

		// Clear the session cookies
		event.cookies.delete('sb-access-token', { path: '/' });
		event.cookies.delete('sb-refresh-token', { path: '/' });

		throw redirect(303, '/auth/signin');
	}
};
