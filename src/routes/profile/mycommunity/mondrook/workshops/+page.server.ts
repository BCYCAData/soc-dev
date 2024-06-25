import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityMondrookWorkshopsFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const myCommunityMondrookWorkshopsFormData = getMyCommunityMondrookWorkshopsFormData(formData);
		const mondrookId = formData.get('community_mondrook_profile_id');
		if (mondrookId) {
			const { error: myCommunityMondrookWorkshopsError } = await supabase
				.from('community_mondrook_profile')
				.update({
					community_workshop_choices:
						myCommunityMondrookWorkshopsFormData.community_workshop_choices,
					other_community_workshop: myCommunityMondrookWorkshopsFormData.other_community_workshop,
					will_run_community_workshops:
						myCommunityMondrookWorkshopsFormData.will_run_community_workshops
				})
				.eq('mondrook_profile_id', mondrookId);
			if (myCommunityMondrookWorkshopsError) {
				console.log(
					'error profileMyCommunityMondrookWorkshops update community_mondrook_profile: ',
					myCommunityMondrookWorkshopsError
				);
				error(
					400,
					`error profileMyCommunityMondrookWorkshops update community_mondrook_profile: ${myCommunityMondrookWorkshopsError.message}`
				);
			}
		}
		return { myCommunityMondrookWorkshopsFormData };
	}
};
