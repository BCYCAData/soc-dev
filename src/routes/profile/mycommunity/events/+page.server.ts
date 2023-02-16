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
		const { data: myCommunityEvents, error: myCommunityEventsError } = await locals.dbClient
			.from('user_bcyca_profile')
			.update({
				community_meeting_choices: body.userBCYCAProfileData.community_meeting_choices,
				other_community_meeting: body.userBCYCAProfileData.other_community_meeting
			})
			.eq('user_id', locals.session.user.id)
			.select();
		if (myCommunityEventsError) {
			console.log(
				'error profileMyCommunityEvents update user_bcyca_profile: ',
				myCommunityEventsError
			);
			throw error(
				400,
				`error profileMyCommunityEvents update user_bcyca_profile:  ${myCommunityEventsError.message}`
			);
		}
		if (myCommunityEvents.length === 1) {
			userBCYCAData = myCommunityEvents[0];
			return {
				userBCYCAData
			};
		}
		throw error(400, 'Could not POST Profile MyCommunity Events data');
	}
};
