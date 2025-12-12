/**
 * @fileoverview Server-side authentication guard for route protection.
 *
 * This module provides the core `authGuard` function that validates user authentication
 * and authorization for protected routes. It implements a multi-layered security approach:
 *
 * 1. **Session Validation**: Verifies Supabase session state (fast, local)
 * 2. **User Verification**: Validates user against Supabase auth (network call)
 * 3. **JWT Claims Extraction**: Decodes permissions, roles, and access rights from JWT
 * 4. **Route-Based Authorization**: Enforces access rules for different route types:
 *    - KYNG coordinator routes
 *    - Personal property routes
 *    - Permission-based admin routes
 *
 * @module lib/server/auth/authguard
 * @see {@link module:lib/server/auth/routematchers} for route matching utilities
 * @see {@link module:lib/server/permissions} for permission validation
 * @see {@link https://supabase.com/docs/guides/auth/server-side} Supabase SSR Auth
 *
 * @example
 * // In a SvelteKit layout server load function
 * import { authGuard } from '$lib/server/auth/authguard';
 *
 * export const load = async (event) => {
 *   const { session, user, claims } = await authGuard({ event });
 *   return { session, user, permissions: claims.permissions };
 * };
 */

// src/lib/server/auth/authGuardServer.ts
import { error, redirect } from '@sveltejs/kit';
import type { KYNGArea } from '$lib/types';
import { routeMatchers } from '$lib/server/auth/routematchers';
import { hasPermission } from '$lib/server/permissions';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Server-side authentication and authorization guard for protected routes.
 *
 * Validates user access by checking Supabase session, verifying user identity,
 * and enforcing route-specific authorization rules based on JWT claims.
 *
 * **Security Flow:**
 * 1. Reads session from Supabase (local, fast)
 * 2. Skips validation for public routes
 * 3. Validates user identity if `requireUser` is true (network call)
 * 4. Decodes JWT claims (permissions, property_ids, coordinates_kyng)
 * 5. Enforces route-specific access rules:
 *    - KYNG routes: Requires `coordinates_kyng` array with matching area
 *    - Property routes: Requires property ID in `property_ids` claim
 *    - Admin routes: Requires hierarchical permission (e.g., 'admin.site.messages')
 *
 * **JWT Claims Structure:**
 * ```typescript
 * {
 *   user_role: 'admin' | 'kyng_coordinator' | 'user',
 *   property_ids: string[],      // UUIDs of properties user can access
 *   community_slugs: string[],    // Community identifiers
 *   permissions: string[],        // Hierarchical permissions (e.g., 'admin.site')
 *   coordinates_kyng: Array<{     // KYNG coordinator assignments
 *     kyngAreaId: string,
 *     kyngAreaName: string
 *   }>
 * }
 * ```
 *
 * @param {Object} params - Guard configuration
 * @param {RequestEvent} params.event - SvelteKit request event containing URL, locals, etc.
 * @param {boolean} [params.requireUser=true] - Whether to validate user identity (network call)
 *
 * @returns {Promise<Object>} Authentication result
 * @returns {Session | null} returns.session - Supabase session object (null for public routes)
 * @returns {User | null} returns.user - Validated Supabase user object (null if not required)
 * @returns {Object} returns.claims - Decoded JWT claims containing permissions and access rights
 *
 * @throws {Redirect} 303 to `/auth/signin` - When user validation fails or user not found
 * @throws {Error} 403 'Not authorized as KYNG coordinator' - When KYNG route accessed without coordinator role
 * @throws {Error} 403 'Not authorized for this KYNG area' - When accessing KYNG area not assigned to user
 * @throws {Error} 403 'Not authorized to view this property' - When property ID not in user's property_ids
 * @throws {Error} 403 'Insufficient permissions' - When user lacks required hierarchical permission
 *
 * @example
 * // Basic usage in protected layout
 * export const load = async (event) => {
 *   const { session, user, claims } = await authGuard({ event });
 *   return { session, user };
 * };
 *
 * @example
 * // Skip user validation for faster performance (session-only check)
 * export const load = async (event) => {
 *   const { session, claims } = await authGuard({
 *     event,
 *     requireUser: false
 *   });
 *   return { session };
 * };
 *
 * @example
 * // Access permissions from claims in server actions
 * export const actions = {
 *   default: async (event) => {
 *     const { claims } = await authGuard({ event });
 *     const permissions = claims.permissions || [];
 *
 *     if (!hasPermission(permissions, 'admin.site.messages')) {
 *       throw error(403, 'Insufficient permissions');
 *     }
 *     // ... perform authorized action
 *   }
 * };
 *
 * @see {@link routeMatchers} for route pattern matching utilities
 * @see {@link hasPermission} for hierarchical permission checking
 */
export async function authGuard({
	event,
	requireUser = true
}: {
	event: RequestEvent;
	requireUser?: boolean;
}) {
	// 1. Fast local read of the session (no network)
	const {
		data: { session }
	} = await event.locals.supabase.auth.getSession();

	// 2. If route is public → skip checks
	if (routeMatchers.isPublicRoute(event.url.pathname)) {
		return { session: null, user: null, claims: {} };
	}

	// 3. If user required → validate against Supabase (network call)
	let user = null;
	if (requireUser) {
		const {
			data: { user: validatedUser },
			error: userError
		} = await event.locals.supabase.auth.getUser();

		if (userError || !validatedUser) {
			throw redirect(303, '/auth/signin');
		}
		user = validatedUser;
	}

	// 4. Decode JWT claims from access token (fast, local)
	let claims: any = {};
	if (session?.access_token) {
		try {
			const payload = session.access_token.split('.')[1];
			claims = JSON.parse(Buffer.from(payload, 'base64').toString());
		} catch (e) {
			console.error('Failed to decode JWT:', e);
		}
	}

	const permissions = Array.isArray(claims.permissions) ? claims.permissions.join(',') : '';

	// ---------- MATCHERS & RULES ----------

	// KYNG route
	if (routeMatchers.isKYNGRoute(event.url.pathname)) {
		if (!claims.coordinates_kyng?.length) {
			throw error(403, 'Not authorized as KYNG coordinator');
		}
		const kyngArea = routeMatchers.getKYNGArea(event.url.pathname);
		if (
			kyngArea &&
			!claims.coordinates_kyng.some((area: KYNGArea) => area.kyngAreaId === kyngArea)
		) {
			throw error(403, 'Not authorized for this KYNG area');
		}
	}

	// Property route
	if (routeMatchers.isPropertyRoute(event.url.pathname)) {
		const routePropertyId = routeMatchers.getPropertyId(event.url.pathname);
		const propertyIds: string[] = Array.isArray(claims.property_ids) ? claims.property_ids : [];
		if (routePropertyId && !propertyIds.includes(routePropertyId)) {
			throw error(403, 'Not authorized to view this property');
		}
	}

	// Permission-based route
	const requiredPermission = routeMatchers.getRequiredPermission(event.url.pathname);
	if (requiredPermission) {
		const permissionArray = permissions ? permissions.split(',') : [];
		if (!hasPermission(permissionArray, requiredPermission)) {
			throw error(403, 'Insufficient permissions');
		}
	}

	// Everything passed
	return { session, user, claims };
}
