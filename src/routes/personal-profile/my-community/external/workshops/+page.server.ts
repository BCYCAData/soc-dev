import { type Actions } from '@sveltejs/kit';
import { getMyCommunityExternalWorkshopsFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const formData = await request.formData();
		const myExternalCommunityWorkshopsFormData = getMyCommunityExternalWorkshopsFormData(formData);
		const externalId = formData.get('community_external_profile_id');
		if (externalId) {
			const { error: myExternalCommunityWorkshopsError } = await supabase
				.from('community_external_profile')
				.update({
					community_workshop_choices:
						myExternalCommunityWorkshopsFormData.community_workshop_choices,
					other_community_workshop: myExternalCommunityWorkshopsFormData.other_community_workshop,
					will_run_community_workshops:
						myExternalCommunityWorkshopsFormData.will_run_community_workshops
				})
				.eq('external_profile_id', externalId);
			if (myExternalCommunityWorkshopsError) {
				console.log(
					'error profileMyCommunityExternalWorkshops update community_external_profile: ',
					myExternalCommunityWorkshopsError
				);
				return {
					myExternalCommunityWorkshopsFormData,
					success: false,
					error: true,
					errorMessage: `${myExternalCommunityWorkshopsError.message}`
				};
			}
		}
		return { myExternalCommunityWorkshopsFormData, success: true, error: false, errorMessage: '' };
	}
};
