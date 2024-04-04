import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityMondrookEventsFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const myCommunityMondrookEventsFormData = getMyCommunityMondrookEventsFormData(formData);
		const mondrookId = formData.get('community_mondrook_profile_id');
		if (mondrookId) {
			const { error: myCommunityMondrookEventsError } = await supabase
				.from('community_mondrook_profile')
				.update({
					community_meeting_choices: myCommunityMondrookEventsFormData.community_meeting_choices,
					other_community_meeting: myCommunityMondrookEventsFormData.other_community_meeting
				})
				.eq('mondrook_profile_id', mondrookId);
			if (myCommunityMondrookEventsError) {
				console.log(
					'error profileMyCommunityMondrookEvents update community_mondrook_profile: ',
					myCommunityMondrookEventsError
				);
				error(
					400,
					`error profileMyCommunityMondrookEvents update community_mondrook_profile:  ${myCommunityMondrookEventsError.message}`
				);
			}
		}
		return { myCommunityMondrookEventsFormData };
	}
};
