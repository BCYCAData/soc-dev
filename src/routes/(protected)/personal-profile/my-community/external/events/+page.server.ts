import { type Actions } from '@sveltejs/kit';
import { getMyCommunityExternalEventsFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const myExternalCommunityEventsFormData = getMyCommunityExternalEventsFormData(formData);
		const externalId = formData.get('community_external_profile_id');
		if (externalId) {
			const { error: myCommunityExternalEventsError } = await supabase
				.from('community_external_profile')
				.update({
					community_meeting_choices: myExternalCommunityEventsFormData.community_meeting_choices,
					other_community_meeting: myExternalCommunityEventsFormData.other_community_meeting
				})
				.eq('external_profile_id', externalId);
			if (myCommunityExternalEventsError) {
				console.log(
					'error profileMyCommunityExternalEvents update community_external_profile: ',
					myCommunityExternalEventsError
				);
				return {
					myExternalCommunityEventsFormData,
					success: false,
					error: true,
					errorMessage: `${myCommunityExternalEventsError.message}`
				};
			}
		}
		return { myExternalCommunityEventsFormData, success: true, error: false, errorMessage: '' };
	}
};
