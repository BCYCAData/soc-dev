import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityTinoneeInformationFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const myCommunityTinoneeInformationFormData =
			getMyCommunityTinoneeInformationFormData(formData);
		const tinoneeId = formData.get('community_tinonee_profile_id');
		if (tinoneeId) {
			const { error: myCommunityTinoneeInformationError } = await supabase
				.from('community_tinonee_profile')
				.update({
					information_sheet_choices:
						myCommunityTinoneeInformationFormData.information_sheet_choices,
					other_information_sheet: myCommunityTinoneeInformationFormData.other_information_sheet
				})
				.eq('tinonee_profile_id', tinoneeId);
			if (myCommunityTinoneeInformationError) {
				console.log(
					'error profileMyCommunityTinoneeInformation update community_tinonee_profile: ',
					myCommunityTinoneeInformationError
				);
				error(
					400,
					`error profileMyCommunityTinoneeInformation update community_tinonee_profile: ${myCommunityTinoneeInformationError.message}`
				);
			}
		}
		return { myCommunityTinoneeInformationFormData };
	}
};
