// src/hooks.server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/db.types';

/** Custom JWT claims this app issues, read via `getClaims()`. */
interface AppClaims {
	user_role?: string | null;
	permissions?: unknown;
	property_ids?: string[] | null;
	community_slugs?: string[];
	coordinates_kyng?: App.Locals['coordinatesKYNG'];
	[key: string]: unknown;
}

// IMPORTANT: No authGuard / guardRoute here.
// All auth logic happens inside route layouts now.

export const handle = async ({ event, resolve }) => {
	// 1. Create Supabase client for SSR
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: (): { name: string; value: string }[] => event.cookies.getAll(),
				setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) =>
					cookiesToSet.forEach(({ name, value, options }) =>
						event.cookies.set(name, value, { ...options, path: '/' })
					)
			}
		}
	);

	// 2. Get user (secure - validates with Supabase Auth server)
	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser();

	let claims: AppClaims = {};

	// Read verified JWT claims via getClaims() rather than a manual base64 decode
	// of the cookie token. NOTE: this project signs JWTs with a symmetric secret,
	// so getClaims() makes a server round-trip — gate it on `user` so anonymous
	// requests stay cheap.
	if (user) {
		const { data: claimsData, error: claimsError } = await event.locals.supabase.auth.getClaims();
		if (claimsError) {
			console.error('Failed to read JWT claims:', claimsError);
		} else if (claimsData) {
			claims = claimsData.claims as AppClaims;
		}
	}

	// 3. Make claims available to layouts/routes.
	// `permissions` arrives as an array of comma-joined bundles (e.g.
	// ["admin,admin.site,...", "kyng"]); flatten to individual dot-notation tokens
	// so hasPermission() works for authGuard, apiGuard, and the client UI.
	event.locals.userRole = claims.user_role ?? 'user';
	event.locals.permissions = Array.isArray(claims.permissions)
		? (claims.permissions as unknown[])
				.flatMap((p) => (typeof p === 'string' ? p.split(',') : []))
				.map((s) => s.trim())
				.filter(Boolean)
		: [];
	event.locals.propertyIds = claims.property_ids ?? [];
	event.locals.communities = claims.community_slugs ?? [];
	event.locals.coordinatesKYNG = claims.coordinates_kyng ?? null;
	// Standard Supabase claim; stable per login. Used to gate the profile nag.
	event.locals.sessionId = typeof claims.session_id === 'string' ? claims.session_id : null;

	// 4. Proceed normally
	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
