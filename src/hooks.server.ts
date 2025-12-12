// src/hooks.server.ts
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// IMPORTANT: No authGuard / guardRoute here.
// All auth logic happens inside route layouts now.

export const handle = async ({ event, resolve }) => {
	// 1. Create Supabase client for SSR
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: (): { name: string; value: string }[] => event.cookies.getAll(),
			setAll: (cookiesToSet: { name: string; value: string; options: Record<string, any> }[]) =>
				cookiesToSet.forEach(
					({
						name,
						value,
						options
					}: {
						name: string;
						value: string;
						options: Record<string, any>;
					}) => event.cookies.set(name, value, { ...options, path: '/' })
				)
		}
	});

	// 2. Get user (secure - validates with Supabase Auth server)
	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser();

	let claims: any = {};

	// Decode JWT claims from the authenticated user's access token
	if (user) {
		// Get the session to access the validated access_token
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (session?.access_token) {
			try {
				const payload = session.access_token.split('.')[1];
				claims = JSON.parse(Buffer.from(payload, 'base64').toString());
			} catch (e) {
				console.error('Failed to decode JWT:', e);
			}
		}
	}

	// 3. Make claims available to layouts/routes
	event.locals.userRole = claims.user_role ?? 'user';
	event.locals.permissions = Array.isArray(claims.permissions) ? claims.permissions : [];
	event.locals.propertyIds = claims.property_ids ?? [];
	event.locals.communities = claims.community_slugs ?? [];
	event.locals.coordinatesKYNG = claims.coordinates_kyng ?? null;

	// 4. Proceed normally
	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
