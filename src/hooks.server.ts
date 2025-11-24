import { createServerClient } from '@supabase/ssr';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { error, type Handle } from '@sveltejs/kit';
import { getCommunityOptions, type CommunityRequestOption } from '$lib/profile-options';

const supabaseHandle: Handle = async ({ event, resolve }) => {
	// Create server supabase client with cookie passthrough
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) =>
				cookiesToSet.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				)
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();

		if (error || !user) {
			return { session: null, user: null };
		}

		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		return { session, user };
	};

	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	// Read custom claims from JWT access_token
	// Custom Access Token Hook adds claims to the JWT payload
	let claims: any = {};
	if (session?.access_token) {
		try {
			const payload = session.access_token.split('.')[1];
			claims = JSON.parse(atob(payload));
		} catch (e) {
			console.error('Failed to decode JWT:', e);
		}
	}

	// Set locals from JWT claims
	event.locals.userRole = claims.user_role ?? 'user';
	event.locals.permissions = Array.isArray(claims.permissions) ? claims.permissions : [];
	event.locals.propertyIds = Array.isArray(claims.property_ids) ? claims.property_ids : [];
	event.locals.communities = Array.isArray(claims.community_slugs) ? claims.community_slugs : [];
	event.locals.coordinatesKYNG = claims.coordinates_kyng ?? null;

	event.locals.getCommunityRequestOptions = async () => {
		const { data, error: requestError } = await event.locals.supabase.from(
			'community_request_options_lut'
		).select(`
                index_value,
                lable,
                community_request_options_concordance!public_community_request_options_lut_concordance_fkey (
                    table_name,
                    object_name,
                    field_name
                )
            `);

		if (requestError) {
			console.error('Failed to fetch community request options:', requestError);
			throw error(400, `Failed to fetch community request options: ${requestError.message}`);
		}
		const transformedData = getCommunityOptions(data as CommunityRequestOption[]);
		return transformedData;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

// Minimal UX guard - NOT for security (RLS handles that)
// Only redirects for better user experience
const uxGuard: Handle = async ({ event, resolve }) => {
	// Allow public paths
	const publicPaths = ['/', '/auth', '/.well-known', '/assets'];
	if (publicPaths.some((p) => event.url.pathname.startsWith(p))) {
		return resolve(event);
	}

	// Redirect unauthenticated users from protected pages (UX only)
	if (!event.locals.session) {
		const redirectTo = encodeURIComponent(event.url.pathname + event.url.search);
		return new Response(null, {
			status: 303,
			headers: { Location: `/auth/signin?redirectTo=${redirectTo}` }
		});
	}

	// Optional: Basic UX guards for obviously wrong routes
	// (RLS will still enforce security at the database level)
	const path = event.url.pathname;

	// Property route check (UX - prevents confusion, not security)
	const propertyMatch = path.match(/\/personal-profile\/my-property\/([^\/]+)/);
	if (propertyMatch) {
		const propertyId = propertyMatch[1];
		if (!event.locals.propertyIds || !event.locals.propertyIds.includes(propertyId)) {
			return new Response(null, {
				status: 303,
				headers: { Location: '/personal-profile/my-property' }
			});
		}
	}

	// Community route check (UX - prevents confusion, not security)
	const communityMatch = path.match(/\/personal-profile\/my-community\/([^\/]+)/);
	if (communityMatch) {
		const slug = communityMatch[1];
		const validSlugs = ['bcyca', 'external', 'mondrook', 'tinonee'];
		if (validSlugs.includes(slug) && !event.locals.communities.includes(slug)) {
			return new Response(null, {
				status: 303,
				headers: { Location: '/personal-profile/my-community' }
			});
		}
	}

	return resolve(event);
};

export const handle = sequence(supabaseHandle, uxGuard);
