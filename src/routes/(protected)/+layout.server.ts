import { authGuard } from '$lib/server/auth/authguard';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// Central auth check - validates user and JWT
	const { session, user, claims } = await authGuard({
		event,
		requireUser: true
	});

	// authGuard already handles:
	// - Redirecting unauthenticated users to /auth/signin
	// - Validating JWT with Supabase
	// - Checking route-specific permissions via routeMatchers
	// - Property ID and KYNG area authorization

	// Return auth data to all protected routes
	return {
		session,
		user,
		userRole: claims.user_role ?? 'user',
		permissions: Array.isArray(claims.permissions) ? claims.permissions : [],
		propertyIds: claims.property_ids ?? [],
		communities: claims.community_slugs ?? [],
		coordinatesKYNG: claims.coordinates_kyng ?? null
	};
};
