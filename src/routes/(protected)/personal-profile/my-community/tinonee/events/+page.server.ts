import { type Actions } from '@sveltejs/kit';
import { getMyCommunityTinoneeEventsFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
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
					'error profileTinoneeMyCommunity update community_tinonee_profile: ',
					myCommunityTinoneeEventsError
				);
				return {
					myCommunityTinoneeEventsFormData,
					success: false,
					error: true,
					errorMessage: `${myCommunityTinoneeEventsError.message}`
				};
			}
		}
		return { myCommunityTinoneeEventsFormData, success: true, error: false, errorMessage: '' };
	}
};
