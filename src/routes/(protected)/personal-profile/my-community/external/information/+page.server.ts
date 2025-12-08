import { type Actions } from '@sveltejs/kit';
import { getMyCommunityExternalInformationFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const myExternalCommunityInformationFormData =
			getMyCommunityExternalInformationFormData(formData);
		const externalId = formData.get('community_external_profile_id');
		if (externalId) {
			const { error: myCommunityExternalInformationError } = await supabase
				.from('community_external_profile')
				.update({
					information_sheet_choices:
						myExternalCommunityInformationFormData.information_sheet_choices,
					other_information_sheet: myExternalCommunityInformationFormData.other_information_sheet
				})
				.eq('external_profile_id', externalId);
			if (myCommunityExternalInformationError) {
				console.log(
					'error profileMyCommunityExternalInformation update community_external_profile: ',
					myCommunityExternalInformationError
				);
				return {
					myExternalCommunityInformationFormData,
					success: false,
					error: true,
					errorMessage: `${myCommunityExternalInformationError.message}`
				};
			}
		}
		return {
			myExternalCommunityInformationFormData,
			success: true,
			error: false,
			errorMessage: ''
		};
	}
};
