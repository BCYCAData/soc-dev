import { type Actions } from '@sveltejs/kit';
import { getMyCommunityMondrookWorkshopsFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const myMondrookCommunityWorkshopsFormData = getMyCommunityMondrookWorkshopsFormData(formData);
		const mondrookId = formData.get('community_mondrook_profile_id');
		if (mondrookId) {
			const { error: myMondrookCommunityWorkshopsError } = await supabase
				.from('community_mondrook_profile')
				.update({
					community_workshop_choices:
						myMondrookCommunityWorkshopsFormData.community_workshop_choices,
					other_community_workshop: myMondrookCommunityWorkshopsFormData.other_community_workshop,
					will_run_community_workshops:
						myMondrookCommunityWorkshopsFormData.will_run_community_workshops
				})
				.eq('mondrook_profile_id', mondrookId);
			if (myMondrookCommunityWorkshopsError) {
				console.log(
					'error profileMyCommunityMondrookWorkshops update community_mondrook_profile: ',
					myMondrookCommunityWorkshopsError
				);
				return {
					myMondrookCommunityWorkshopsFormData,
					success: false,
					error: true,
					errorMessage: `${myMondrookCommunityWorkshopsError.message}`
				};
			}
		}
		return { myMondrookCommunityWorkshopsFormData, success: true, error: false, errorMessage: '' };
	}
};
