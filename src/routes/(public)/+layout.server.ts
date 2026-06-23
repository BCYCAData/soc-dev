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

	// If already logged in and trying to access auth pages, redirect to profile.
	// Exceptions:
	//  - /auth/signout: needs the session to sign out.
	//  - /auth/redirect/*: post-verification flow-completion pages (reset password,
	//    signup profile form, email change) that legitimately run with the session
	//    just established by exchangeCodeForSession/verifyOtp.
	if (session && url.pathname.startsWith('/auth')) {
		const isSignout = url.pathname === '/auth/signout';
		const isRedirectFlow = url.pathname.startsWith('/auth/redirect');
		if (!isSignout && !isRedirectFlow) {
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
