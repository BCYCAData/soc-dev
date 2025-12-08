import { type Actions } from '@sveltejs/kit';
import { getMyCommunityBCYCAEventsFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const myBCYCACommunityEventsFormData = getMyCommunityBCYCAEventsFormData(formData);
		const bcycaId = formData.get('community_bcyca_profile_id');
		if (bcycaId) {
			const { error: myCommunityBCYCAEventsError } = await supabase
				.from('community_bcyca_profile')
				.update({
					community_meeting_choices: myBCYCACommunityEventsFormData.community_meeting_choices,
					other_community_meeting: myBCYCACommunityEventsFormData.other_community_meeting
				})
				.eq('bcyca_profile_id', bcycaId);
			if (myCommunityBCYCAEventsError) {
				console.log(
					'error profileMyCommunityBCYCAEvents update community_bcyca_profile: ',
					myCommunityBCYCAEventsError
				);
				return {
					myBCYCACommunityEventsFormData,
					success: false,
					error: true,
					errorMessage: `${myCommunityBCYCAEventsError.message}`
				};
			}
		}
		return { myBCYCACommunityEventsFormData, success: true, error: false, errorMessage: '' };
	}
};
