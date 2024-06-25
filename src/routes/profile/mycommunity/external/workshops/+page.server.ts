import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityExternalWorkshopsFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const myCommunityExternalWorkshopsFormData = getMyCommunityExternalWorkshopsFormData(formData);
		const externalId = formData.get('community_external_profile_id');
		if (externalId) {
			const { error: myCommunityExternalWorkshopsError } = await supabase
				.from('community_external_profile')
				.update({
					community_workshop_choices:
						myCommunityExternalWorkshopsFormData.community_workshop_choices,
					other_community_workshop: myCommunityExternalWorkshopsFormData.other_community_workshop,
					will_run_community_workshops:
						myCommunityExternalWorkshopsFormData.will_run_community_workshops
				})
				.eq('external_profile_id', externalId);
			if (myCommunityExternalWorkshopsError) {
				console.log(
					'error profileMyCommunityExternalWorkshops update community_external_profile: ',
					myCommunityExternalWorkshopsError
				);
				error(
					400,
					`error profileMyCommunityExternalWorkshops update community_external_profile: ${myCommunityExternalWorkshopsError.message}`
				);
			}
		}
		return { myCommunityExternalWorkshopsFormData };
	}
};
