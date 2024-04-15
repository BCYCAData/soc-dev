import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityBCYCAEventsFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getUser } }) => {
		const { user } = await getUser();
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const myCommunityBCYCAEventsFormData = getMyCommunityBCYCAEventsFormData(formData);
		const bcycaId = formData.get('community_bcyca_profile_id');
		if (bcycaId) {
			const { error: myCommunityBCYCAEventsError } = await supabase
				.from('community_bcyca_profile')
				.update({
					community_meeting_choices: myCommunityBCYCAEventsFormData.community_meeting_choices,
					other_community_meeting: myCommunityBCYCAEventsFormData.other_community_meeting
				})
				.eq('bcyca_profile_id', bcycaId);
			if (myCommunityBCYCAEventsError) {
				console.log(
					'error profileMyCommunityBCYCAEvents update community_bcyca_profile: ',
					myCommunityBCYCAEventsError
				);
				error(
					400,
					`error profileMyCommunityBCYCAEvents update community_bcyca_profile:  ${myCommunityBCYCAEventsError.message}`
				);
			}
		}
		return { myCommunityBCYCAEventsFormData };
	}
};
