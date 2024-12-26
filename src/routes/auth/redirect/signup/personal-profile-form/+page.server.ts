import { redirect } from '@sveltejs/kit';
import { REDIRECT_SEE_OTHER } from '$lib/constants';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { getSessionAndUser } }) => {
	const { session, user } = await getSessionAndUser();
	if (!user) {
		redirect(REDIRECT_SEE_OTHER, '/auth/signin');
	}
	return {
		session,
		user,
		userRoles: user.roles || [],
		coordinatesKYNG: user.coordinatesKYNG || null,
		propertyIds: null,
		userProfile: null,
		optionsData: {
			userOptionsData: { object_names: [] },
			communityBCYCAOptionsData: { object_names: [] },
			communityExternalOptionsData: { object_names: [] },
			communityTinoneeOptionsData: { object_names: [] },
			communityMondrookOptionsData: { object_names: [] }
		}
	};
};
