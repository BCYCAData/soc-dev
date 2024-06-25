import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityBCYCAWorkshopsFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const myCommunityBCYCAWorkshopsFormData = getMyCommunityBCYCAWorkshopsFormData(formData);
		const bcycaId = formData.get('community_bcyca_profile_id');
		if (bcycaId) {
			const { error: myCommunityBCYCAWorkshopsError } = await supabase
				.from('community_bcyca_profile')
				.update({
					community_workshop_choices: myCommunityBCYCAWorkshopsFormData.community_workshop_choices,
					other_community_workshop: myCommunityBCYCAWorkshopsFormData.other_community_workshop,
					will_run_community_workshops:
						myCommunityBCYCAWorkshopsFormData.will_run_community_workshops
				})
				.eq('bcyca_profile_id', bcycaId);
			if (myCommunityBCYCAWorkshopsError) {
				console.log(
					'error profileMyCommunityBCYCAWorkshops update community_bcyca_profile: ',
					myCommunityBCYCAWorkshopsError
				);
				error(
					400,
					`error profileMyCommunityBCYCAWorkshops update community_bcyca_profile: ${myCommunityBCYCAWorkshopsError.message}`
				);
			}
		}
		return { myCommunityBCYCAWorkshopsFormData };
	}
};
