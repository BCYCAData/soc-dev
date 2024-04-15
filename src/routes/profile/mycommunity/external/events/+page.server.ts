import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityExternalEventsFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getUser } }) => {
		const { user } = await getUser();
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const myCommunityExternalEventsFormData = getMyCommunityExternalEventsFormData(formData);
		const externalId = formData.get('community_external_profile_id');
		if (externalId) {
			const { error: myCommunityExternalEventsError } = await supabase
				.from('community_external_profile')
				.update({
					community_meeting_choices: myCommunityExternalEventsFormData.community_meeting_choices,
					other_community_meeting: myCommunityExternalEventsFormData.other_community_meeting
				})
				.eq('external_profile_id', externalId);
			if (myCommunityExternalEventsError) {
				console.log(
					'error profileMyCommunityExternalEvents update community_external_profile: ',
					myCommunityExternalEventsError
				);
				error(
					400,
					`error profileMyCommunitExternalEvents update community_external_profile:  ${myCommunityExternalEventsError.message}`
				);
			}
		}
		return { myCommunityExternalEventsFormData };
	}
};
