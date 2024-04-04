import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityTinoneeWorkshopsFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
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
					'error profileMyCommunityTinoneeWorkshops update community_tinonee_profile: ',
					myCommunityTinoneeWorkshopsError
				);
				error(
					400,
					`error profileMyCommunityTinoneeWorkshops update community_tinonee_profile: ${myCommunityTinoneeWorkshopsError.message}`
				);
			}
		}
		return { myCommunityTinoneeWorkshopsFormData };
	}
};
