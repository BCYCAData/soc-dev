import { authGuard } from '$lib/server/auth/authguard';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// Central auth check - validates user and JWT
	const { session, user } = await authGuard({
		event,
		requireUser: true
	});

	// authGuard already handles:
	// - Redirecting unauthenticated users to /auth/signin
	// - Validating JWT with Supabase
	// - Checking route-specific permissions via routeMatchers
	// - Property ID and KYNG area authorization

	// Claim-derived fields are decoded once in hooks.server.ts and exposed on locals.
	const { userRole, permissions, propertyIds, communities, coordinatesKYNG } = event.locals;

	// Return auth data to all protected routes
	return {
		session,
		user,
		userRole: userRole ?? 'user',
		permissions: permissions ?? [],
		propertyIds: propertyIds ?? [],
		communities: communities ?? [],
		coordinatesKYNG: coordinatesKYNG ?? null
	};
};
