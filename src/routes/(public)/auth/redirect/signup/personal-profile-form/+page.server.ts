import { redirect } from '@sveltejs/kit';
import { REDIRECT_SEE_OTHER } from '$lib/constants';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const {
		data: { user }
	} = await locals.supabase.auth.getUser();
	if (!user) {
		redirect(REDIRECT_SEE_OTHER, '/auth/signin');
	}
	const {
		data: { session }
	} = await locals.supabase.auth.getSession();
	return {
		session,
		user,
		userRole: locals.userRole,
		coordinatesKYNG: locals.coordinatesKYNG ?? null,
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
