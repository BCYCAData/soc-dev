import { error, redirect, type Actions } from '@sveltejs/kit';
import { getBCYCACommunityEventsFormData } from '$lib/server/form.utils';

import type { CommunityBCYCAProfileData } from '$lib/custom.types';

let communityBCYCAProfile: CommunityBCYCAProfileData;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const body = getBCYCACommunityEventsFormData(formData);
		const { data: myCommunityEvents, error: myCommunityEventsError } = await supabase
			.from('community_bcyca_profile')
			.update({
				community_meeting_choices: body.community_meeting_choices,
				other_community_meeting: body.other_community_meeting
			})
			.eq('user_id', session.user.id)
			.select();
		if (myCommunityEventsError) {
			console.log(
				'error profileMyCommunityEvents update community_bcyca_profile: ',
				myCommunityEventsError
			);
			error(
				400,
				`error profileMyCommunityEvents update community_bcyca_profile:  ${myCommunityEventsError.message}`
			);
		}
		if (myCommunityEvents.length === 1) {
			communityBCYCAProfile = myCommunityEvents[0];
			return {
				communityBCYCAProfile
			};
		}
		error(400, 'Could not POST Profile MyCommunity Events data');
	}
};
