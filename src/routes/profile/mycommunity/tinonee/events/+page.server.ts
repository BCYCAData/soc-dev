import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityTinoneeEventsFormData } from '$lib/server/form.utils';

import type { CommunityBCYCAProfileData } from '$lib/custom.types';

let communityBCYCAProfile: CommunityBCYCAProfileData;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const myCommunityTinoneeEventsFormData = getMyCommunityTinoneeEventsFormData(formData);
		const tinoneeId = formData.get('community_tinonee_profile_id');
		if (tinoneeId) {
			const { error: myCommunityTinoneeEventsError } = await supabase
				.from('community_tinonee_profile')
				.update({
					community_meeting_choices: myCommunityTinoneeEventsFormData.community_meeting_choices,
					other_community_meeting: myCommunityTinoneeEventsFormData.other_community_meeting
				})
				.eq('tinonee_profile_id', tinoneeId);
			if (myCommunityTinoneeEventsError) {
				console.log(
					'error profileMyCommunityTinonee update community_tinonee_profile: ',
					myCommunityTinoneeEventsError
				);
				error(
					400,
					`error profileMyCommunity update user_profile: ${myCommunityTinoneeEventsError.message}`
				);
			}
		}
		return { myCommunityTinoneeEventsFormData };
	}
};
