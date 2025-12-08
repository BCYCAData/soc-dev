// src/lib/server/auth/authGuardServer.ts
import { error, redirect } from '@sveltejs/kit';
import type { KYNGArea } from '$lib/types';
import { routeMatchers } from '$lib/server/auth/routematchers';
import { hasPermission } from '$lib/server/permissions';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Server-side route guard.
 * Called only inside protected layouts/pages.
 * Validates the Supabase session + JWT claims.
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
