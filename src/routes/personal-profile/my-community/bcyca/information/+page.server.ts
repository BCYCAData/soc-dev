import { type Actions } from '@sveltejs/kit';
import { getMyCommunityBCYCAInformationFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const formData = await request.formData();
		const myBCYCACommunityInformationFormData = getMyCommunityBCYCAInformationFormData(formData);
		const bcycaId = formData.get('community_bcyca_profile_id');
		if (bcycaId) {
			const { error: myCommunityBCYCAInformationError } = await supabase
				.from('community_bcyca_profile')
				.update({
					information_sheet_choices: myBCYCACommunityInformationFormData.information_sheet_choices,
					other_information_sheet: myBCYCACommunityInformationFormData.other_information_sheet
				})
				.eq('bcyca_profile_id', bcycaId);
			if (myCommunityBCYCAInformationError) {
				console.log(
					'error profileMyCommunityBCYCAInformation update community_bcyca_profile: ',
					myCommunityBCYCAInformationError
				);
				return {
					profileBCYCAMyCommunityInformationFormData: myBCYCACommunityInformationFormData,
					success: false,
					error: true,
					errorMessage: `${myCommunityBCYCAInformationError.message}`
				};
			}
		}
		return {
			profileBCYCAMyCommunityInformationFormData: myBCYCACommunityInformationFormData,
			success: true,
			error: false,
			errorMessage: ''
		};
	}
};
