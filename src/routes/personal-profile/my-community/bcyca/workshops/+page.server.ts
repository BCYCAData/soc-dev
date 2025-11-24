import { type Actions } from '@sveltejs/kit';
import { getMyCommunityBCYCAWorkshopsFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const myBCYCACommunityWorkshopsFormData = getMyCommunityBCYCAWorkshopsFormData(formData);
		const bcycaId = formData.get('community_bcyca_profile_id');
		if (bcycaId) {
			const { error: myCommunityBCYCAWorkshopsError } = await supabase
				.from('community_bcyca_profile')
				.update({
					community_workshop_choices: myBCYCACommunityWorkshopsFormData.community_workshop_choices,
					other_community_workshop: myBCYCACommunityWorkshopsFormData.other_community_workshop,
					will_run_community_workshops:
						myBCYCACommunityWorkshopsFormData.will_run_community_workshops
				})
				.eq('bcyca_profile_id', bcycaId);
			if (myCommunityBCYCAWorkshopsError) {
				console.log(
					'error profileMyCommunityBCYCAWorkshops update community_bcyca_profile: ',
					myCommunityBCYCAWorkshopsError
				);
				return {
					myBCYCACommunityWorkshopsFormData,
					success: false,
					error: true,
					errorMessage: `${myCommunityBCYCAWorkshopsError.message}`
				};
			}
		}
		return { myBCYCACommunityWorkshopsFormData, success: true, error: false, errorMessage: '' };
	}
};
