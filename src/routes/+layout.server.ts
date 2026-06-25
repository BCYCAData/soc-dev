import type { LayoutServerLoad } from './$types';
import { SESSION_POLICY, tierForRole } from '$lib/constants/sessionPolicy';
import { getSessionStart } from '$lib/server/auth/sessionTracking';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	// Get session (fast, local check)
	const {
		data: { session }
	} = await locals.supabase.auth.getSession();

	// Get user if session exists (optional here, required in protected layout)
	const {
		data: { user }
	} = session ? await locals.supabase.auth.getUser() : { data: { user: null } };

	// Surface the role's session window + absolute deadline so the timeout warning can
	// run a role-scoped countdown. The server enforces independently (hooks.server.ts), so
	// this is display-only — a tampered value can't extend the real session.
	const tier = tierForRole(locals.userRole, locals.permissions);
	const win = SESSION_POLICY[tier];
	const sessionStart = getSessionStart(cookies, locals.sessionId);
	const sessionPolicy = session
		? {
				tier,
				idleMs: win.idleMs,
				absoluteMs: win.absoluteMs,
				warningMs: win.warningMs,
				absoluteDeadline: sessionStart !== null ? sessionStart + win.absoluteMs : null
			}
		: null;

	// Return all auth-related data from locals and session check
	return {
		session,
		user,
		userRole: locals.userRole,
		permissions: locals.permissions,
		propertyIds: locals.propertyIds,
		communities: locals.communities,
		coordinatesKYNG: locals.coordinatesKYNG,
		sessionPolicy,
		userProfile: null
	};
};
