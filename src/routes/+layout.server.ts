import { getUserPermissions } from '$lib/server/auth/utility';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { supabase, getSessionAndUser },
	cookies
}) => {
	const { session, user, userRoles, coordinatesKYNG } = await getSessionAndUser();
	let permissions;

	if (!session) {
		return {
			session: null,
			user: null,
			userRoles: null,
			permissions: null,
			coordinatesKYNG: null
		};
	}

	if (session && user && userRoles) {
		permissions = await getUserPermissions(supabase, user.id, userRoles);
		if (coordinatesKYNG && coordinatesKYNG.length > 0) {
			permissions = `${permissions},kyng`;
		}
	}

	return {
		session,
		cookies: cookies.getAll(),
		user,
		userRoles,
		permissions,
		coordinatesKYNG
	};
};
