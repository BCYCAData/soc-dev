import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityBCYCAInformationFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getUser } }) => {
		const { user } = await getUser();
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const myCommunityBCYCAInformationFormData = getMyCommunityBCYCAInformationFormData(formData);
		const bcycaId = formData.get('community_bcyca_profile_id');
		if (bcycaId) {
			const { error: myCommunityBCYCAInformationError } = await supabase
				.from('community_bcyca_profile')
				.update({
					information_sheet_choices: myCommunityBCYCAInformationFormData.information_sheet_choices,
					other_information_sheet: myCommunityBCYCAInformationFormData.other_information_sheet
				})
				.eq('bcyca_profile_id', bcycaId);
			if (myCommunityBCYCAInformationError) {
				console.log(
					'error profileMyCommunityBCYCAInformation update community_bcyca_profile: ',
					myCommunityBCYCAInformationError
				);
				error(
					400,
					`error profileMyCommunityBCYCAInformation update community_bcyca_profile: ${myCommunityBCYCAInformationError.message}`
				);
			}
		}
		return { myCommunityBCYCAInformationFormData };
	}
};
