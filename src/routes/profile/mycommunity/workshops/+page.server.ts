import { error, redirect } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { Actions } from './$types';
import type { UserBCYCAProfileData } from '$lib/db.types';

let userBCYCAData: UserBCYCAProfileData;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const body = getFormData(formData, locals.session.user.id);
		const { data: myCommunityWorkshops, error: myCommunityWorkshopsError } = await locals.dbClient
			.from('user_bcyca_profile')
			.update({
				community_workshop_choices: body.userBCYCAProfileData.community_workshop_choices,
				other_community_workshop: body.userBCYCAProfileData.other_community_workshop,
				will_run_community_workshops: body.userBCYCAProfileData.will_run_community_workshops
			})
			.eq('user_id', locals.session.user.id)
			.select();
		if (myCommunityWorkshopsError) {
			console.log(
				'error profileMyCommunityWorkshops update user_bcyca_profile: ',
				myCommunityWorkshopsError
			);
			throw error(
				400,
				`error profileMyCommunityWorkshops update user_bcyca_profile: ${myCommunityWorkshopsError.message}`
			);
		}
		if (myCommunityWorkshops.length === 1) {
			userBCYCAData = myCommunityWorkshops[0];
			return {
				userBCYCAData
			};
		}
		throw error(400, 'Could not POST Profile MyCommunity Workshops data');
	}
};
