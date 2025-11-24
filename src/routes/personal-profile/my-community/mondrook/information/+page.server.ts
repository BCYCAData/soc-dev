import { type Actions } from '@sveltejs/kit';
import { getMyCommunityMondrookInformationFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const myMondrookCommunityInformationFormData =
			getMyCommunityMondrookInformationFormData(formData);
		const mondrookId = formData.get('community_mondrook_profile_id');
		if (mondrookId) {
			const { error: myMondrookCommunityInformationError } = await supabase
				.from('community_mondrook_profile')
				.update({
					information_sheet_choices:
						myMondrookCommunityInformationFormData.information_sheet_choices,
					other_information_sheet: myMondrookCommunityInformationFormData.other_information_sheet
				})
				.eq('mondrook_profile_id', mondrookId);
			if (myMondrookCommunityInformationError) {
				console.log(
					'error profileMyCommunityMondrookInformation update community_mondrook_profile: ',
					myMondrookCommunityInformationError
				);
				return {
					myMondrookCommunityInformationFormData,
					success: false,
					error: true,
					errorMessage: `${myMondrookCommunityInformationError.message}`
				};
			}
		}
		return {
			myMondrookCommunityInformationFormData,
			success: true,
			error: false,
			errorMessage: ''
		};
	}
};
