import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const { session, user, userRole, permissions, propertyIds, communities, coordinatesKYNG } =
		locals;
	if (!session) {
		return {
			session: null,
			cookies: null,
			user: null,
			userRole: null,
			permissions: null,
			propertyIds: null,
			communities: null,
			coordinatesKYNG: null
		};
	}

	return {
		session,
		cookies: cookies.getAll(),
		user,
		userRole,
		permissions,
		propertyIds,
		communities,
		coordinatesKYNG
	};
};
