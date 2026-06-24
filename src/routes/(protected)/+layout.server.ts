import { authGuard } from '$lib/server/auth/authguard';
import { getProfileCompletion } from '$lib/server/profile-requirements';
import type { LayoutServerLoad } from './$types';

// The form users complete — never nag them while they're on it.
const PROFILE_FORM_PATH = '/personal-profile-form';
// Cookie holding the session id for which the nag has been resolved (dismissed or
// already complete). Not httpOnly: the dismiss button sets it client-side.
const NAG_COOKIE = 'ppf_nag';
const NAG_COOKIE_MAX_AGE = 60 * 60 * 12; // 12h, comfortably within a login

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

	// Gentle, once-per-login nag for users whose profile is incomplete against the
	// admin-configured required-question set. No hard redirect — users keep full
	// access; they just see a dismissible reminder. We only compute completion when
	// the nag hasn't already been resolved this login (dismissed or found complete),
	// so the underlying profile RPC runs at most once per login while a user is
	// incomplete, and not at all once resolved.
	let profileNag: App.PageData['profileNag'] = null;
	const sessionId = event.locals.sessionId;
	const onFormRoute = event.url.pathname.startsWith(PROFILE_FORM_PATH);

	if (user && sessionId && !onFormRoute && event.cookies.get(NAG_COOKIE) !== sessionId) {
		const completion = await getProfileCompletion(event.locals.supabase, user.id);
		if (completion.isComplete) {
			// Nothing to nag about this login — mark resolved so we stop recomputing.
			event.cookies.set(NAG_COOKIE, sessionId, {
				path: '/',
				httpOnly: false,
				sameSite: 'lax',
				maxAge: NAG_COOKIE_MAX_AGE
			});
		} else {
			profileNag = {
				percent: completion.percent,
				answered: completion.answered,
				total: completion.total,
				sessionId
			};
		}
	}

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
		coordinatesKYNG: coordinatesKYNG ?? null,
		profileNag
	};
};
