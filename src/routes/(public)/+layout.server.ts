import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Get session (fast, local check)
	const {
		data: { session }
	} = await locals.supabase.auth.getSession();

	// Get user if session exists
	const {
		data: { user }
	} = session ? await locals.supabase.auth.getUser() : { data: { user: null } };

	// If already logged in and trying to access auth pages, redirect to profile
	if (session && url.pathname.startsWith('/auth')) {
		// Don't redirect from signout
		if (url.pathname !== '/auth/signout') {
			throw redirect(303, '/personal-profile');
		}
	}

	// Return auth data so navbar can show admin/KYNG buttons even on public routes
	return {
		session,
		user,
		userRole: locals.userRole,
		permissions: locals.permissions,
		propertyIds: locals.propertyIds,
		communities: locals.communities,
		coordinatesKYNG: locals.coordinatesKYNG
	};
};
