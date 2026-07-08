import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { clearSessionTracking } from '$lib/server/auth/sessionTracking';

export const actions: Actions = {
	default: async (event) => {
		const { error: logoutError } = await event.locals.supabase.auth.signOut();

		if (logoutError) {
			return {
				success: false,
				message: 'Failed to log out'
			};
		}

		// Clear the session cookies
		event.cookies.delete('sb-access-token', { path: '/' });
		event.cookies.delete('sb-refresh-token', { path: '/' });
		// Clear the session-lifetime tracking cookies (idle + absolute cap).
		clearSessionTracking(event.cookies);
		// Clear the profile-completion nag cookie so it doesn't linger past logout.
		event.cookies.delete('ppf_nag', { path: '/' });

		throw redirect(303, '/auth/signin');
	}
};
