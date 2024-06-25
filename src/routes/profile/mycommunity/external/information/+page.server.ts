import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityExternalInformationFormData } from '$lib/server/form.utils';

import type { CommunityBCYCAProfileData } from '$lib/custom.types';

let communityBCYCAProfile: CommunityBCYCAProfileData;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const myCommunityExternalInformationFormData =
			getMyCommunityExternalInformationFormData(formData);
		const externalId = formData.get('community_external_profile_id');
		if (externalId) {
			const { error: myCommunityExternalInformationError } = await supabase
				.from('community_external_profile')
				.update({
					information_sheet_choices:
						myCommunityExternalInformationFormData.information_sheet_choices,
					other_information_sheet: myCommunityExternalInformationFormData.other_information_sheet
				})
				.eq('external_profile_id', externalId);
			if (myCommunityExternalInformationError) {
				console.log(
					'error profileMyCommunityExternalInformation update community_external_profile: ',
					myCommunityExternalInformationError
				);
				error(
					400,
					`error profileMyCommunityExternalInformation update community_external_profile: ${myCommunityExternalInformationError.message}`
				);
			}
		}
		return { myCommunityExternalInformationFormData };
	}
};
