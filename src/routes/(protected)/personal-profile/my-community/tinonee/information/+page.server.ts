import { type Actions } from '@sveltejs/kit';
import { getMyCommunityTinoneeInformationFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
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
					'error profileTinoneeMyCommunityInformation update community_tinonee_profile: ',
					myCommunityTinoneeInformationError
				);
				return {
					myCommunityTinoneeInformationFormData,
					success: false,
					error: true,
					errorMessage: `${myCommunityTinoneeInformationError.message}`
				};
			}
		}
		return { myCommunityTinoneeInformationFormData, success: true, error: false, errorMessage: '' };
	}
};
