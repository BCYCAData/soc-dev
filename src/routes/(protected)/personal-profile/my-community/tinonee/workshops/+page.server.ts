import { type Actions } from '@sveltejs/kit';
import { getMyCommunityTinoneeWorkshopsFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const myCommunityTinoneeWorkshopsFormData = getMyCommunityTinoneeWorkshopsFormData(formData);
		const tinoneeId = formData.get('community_tinonee_profile_id');
		if (tinoneeId) {
			const { error: myCommunityTinoneeWorkshopsError } = await supabase
				.from('community_tinonee_profile')
				.update({
					community_workshop_choices:
						myCommunityTinoneeWorkshopsFormData.community_workshop_choices,
					other_community_workshop: myCommunityTinoneeWorkshopsFormData.other_community_workshop,
					will_run_community_workshops:
						myCommunityTinoneeWorkshopsFormData.will_run_community_workshops
				})
				.eq('tinonee_profile_id', tinoneeId);
			if (myCommunityTinoneeWorkshopsError) {
				console.log(
					'error profileTinoneeMyCommunityWorkshops update community_tinonee_profile: ',
					myCommunityTinoneeWorkshopsError
				);
				return {
					myCommunityTinoneeWorkshopsFormData,
					success: false,
					error: true,
					errorMessage: `${myCommunityTinoneeWorkshopsError.message}`
				};
			}
		}
		return { myCommunityTinoneeWorkshopsFormData, success: true, error: false, errorMessage: '' };
	}
};
