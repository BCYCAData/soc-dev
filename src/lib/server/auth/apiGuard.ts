/**
 * Auth helpers for standalone endpoints (`+server.ts`) and form actions.
 *
 * These do NOT go through the `(protected)` layout's `authGuard`, so they must
 * validate the caller themselves. `event.locals.user` is intentionally not set
 * by `hooks.server.ts`, so identity is validated with a fresh `getUser()` call,
 * while authorization uses the `permissions` claim already decoded into locals.
 */
import { error, type RequestEvent } from '@sveltejs/kit';
import type { User } from '@supabase/supabase-js';
import { hasPermission } from '$lib/server/permissions';

/**
 * Ensures the request is from an authenticated user. Throws 401 otherwise.
 * Returns the validated Supabase user.
 */
export async function requireUser(event: RequestEvent): Promise<User> {
	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser();
	if (!user) {
		throw error(401, 'Authentication required');
	}
	return user;
}

/**
 * Ensures the request is from an authenticated user holding `permission`
 * (hierarchical). Throws 401 if unauthenticated, 403 if unauthorized.
 */
export async function requirePermission(
	event: RequestEvent,
	permission: string | string[]
): Promise<User> {
	const user = await requireUser(event);
	if (!hasPermission(event.locals.permissions ?? [], permission)) {
		throw error(403, 'Insufficient permissions');
	}
	return user;
}
