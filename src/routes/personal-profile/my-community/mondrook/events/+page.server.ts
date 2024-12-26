import { type Actions } from '@sveltejs/kit';
import { getMyCommunityMondrookEventsFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const formData = await request.formData();
		const myMondrookCommunityEventsFormData = getMyCommunityMondrookEventsFormData(formData);
		const mondrookId = formData.get('community_mondrook_profile_id');
		if (mondrookId) {
			const { error: myMondrookCommunityEventsError } = await supabase
				.from('community_mondrook_profile')
				.update({
					community_meeting_choices: myMondrookCommunityEventsFormData.community_meeting_choices,
					other_community_meeting: myMondrookCommunityEventsFormData.other_community_meeting
				})
				.eq('mondrook_profile_id', mondrookId);
			if (myMondrookCommunityEventsError) {
				console.log(
					'error profileMyCommunityMondrookEvents update community_mondrook_profile: ',
					myMondrookCommunityEventsError
				);
				return {
					myMondrookCommunityEventsFormData,
					success: false,
					error: true,
					errorMessage: `${myMondrookCommunityEventsError.message}`
				};
			}
		}
		return { myMondrookCommunityEventsFormData, success: true, error: false, errorMessage: '' };
	}
};
