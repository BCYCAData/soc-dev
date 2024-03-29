import { error, redirect, type Actions } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { UserBCYCAProfileData } from '$lib/custom.types';

let userBCYCAData: UserBCYCAProfileData;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const body = getFormData(
			formData,
			session.user.id,
			session.user.app_metadata.principaladdresssiteoid,
			session.user.app_metadata.community,
			session.user.app_metadata.kyng
		);
		const { data: myCommunityEvents, error: myCommunityEventsError } = await supabase
			.from('user_bcyca_profile')
			.update({
				community_meeting_choices: body.userBCYCAProfileData.community_meeting_choices,
				other_community_meeting: body.userBCYCAProfileData.other_community_meeting
			})
			.eq('user_id', session.user.id)
			.select();
		if (myCommunityEventsError) {
			console.log(
				'error profileMyCommunityEvents update user_bcyca_profile: ',
				myCommunityEventsError
			);
			error(
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
		error(400, 'Could not POST Profile MyCommunity Events data');
	}
};
