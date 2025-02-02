import { createServerClient } from '@supabase/ssr';
import { sequence } from '@sveltejs/kit/hooks';
import { guardRoute } from '$lib/server/auth/authguard';
import { getUserPermissions } from '$lib/server/auth/utility';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { getCommunityOptions } from '$lib/profile-options';
import { error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import type { Session, User } from '@supabase/supabase-js';
import type { KYNGArea } from '$lib/types';
import type { UserProfile } from '$lib/form.types';
import type { CommunityRequestOption } from '$lib/profile-options';

const supabase: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

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

	event.locals.getSessionAndUser = async (): Promise<{
		session: Session | null;
		user: User | null;
		userRoles: string[] | null;
		coordinatesKYNG: KYNGArea[] | null;
		propertyIds: string[] | null;
		userProfile: UserProfile | null;
	}> => {
		try {
			const {
				data: { session }
			} = await event.locals.supabase.auth.getSession();

			if (!session) {
				return {
					session: null,
					user: null,
					userRoles: null,
					coordinatesKYNG: null,
					propertyIds: null,
					userProfile: null
				};
			}

			const {
				data: { user },
				error
			} = await event.locals.supabase.auth.getUser();
			if (error || !user) {
				return {
					session: null,
					user: null,
					userRoles: null,
					coordinatesKYNG: null,
					propertyIds: null,
					userProfile: null
				};
			}

			const { data: userProfile } = await event.locals.supabase.rpc('get_profile_for_user', {
				id_input: user.id
			});

			const propertyIds = userProfile?.property_profile
				? Array.isArray(userProfile.property_profile)
					? userProfile.property_profile.map((p: { id: string }) => p.id)
					: [userProfile.property_profile.id]
				: [];

			const { user_roles, coordinates_kyng } = JSON.parse(atob(session.access_token.split('.')[1]));

			event.locals.userProfile = userProfile;
			event.locals.propertyIds = propertyIds;

			return {
				session,
				user,
				userRoles: user_roles,
				coordinatesKYNG: coordinates_kyng,
				propertyIds,
				userProfile
			};
		} catch (error) {
			return {
				session: null,
				user: null,
				userRoles: null,
				coordinatesKYNG: null,
				propertyIds: null,
				userProfile: null
			};
		}
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/assets/')) {
		return resolve(event);
	}

	const { session, user, userRoles, coordinatesKYNG, propertyIds } =
		await event.locals.getSessionAndUser();

	let permissions: string | null = null;
	if (session && user && userRoles) {
		permissions = await getUserPermissions(event.locals.supabase, user.id, userRoles);
	}

	// Add to event.locals for access in layouts
	event.locals.user = user;
	event.locals.permissions = permissions;
	event.locals.coordinatesKYNG = coordinatesKYNG;

	await guardRoute({
		path: event.url.pathname,
		session,
		user,
		userRoles,
		coordinatesKYNG,
		permissions,
		propertyIds: propertyIds || []
	});

	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard);
