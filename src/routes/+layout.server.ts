import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Get session (fast, local check)
	const {
		data: { session }
	} = await locals.supabase.auth.getSession();

	// Get user if session exists (optional here, required in protected layout)
	const {
		data: { user }
	} = session ? await locals.supabase.auth.getUser() : { data: { user: null } };

	// Return all auth-related data from locals and session check
	return {
		session,
		user,
		userRole: locals.userRole,
		permissions: locals.permissions,
		propertyIds: locals.propertyIds,
		communities: locals.communities,
		coordinatesKYNG: locals.coordinatesKYNG,
		userProfile: locals.userProfile
	};
};
