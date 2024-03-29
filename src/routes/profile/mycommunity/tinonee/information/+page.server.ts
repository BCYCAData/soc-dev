import { error, redirect, type Actions } from '@sveltejs/kit';
import { getBCYCACommunityInformationFormData } from '$lib/server/form.utils';

import type { CommunityBCYCAProfileData } from '$lib/custom.types';

let communityBCYCAProfile: CommunityBCYCAProfileData;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const body = getBCYCACommunityInformationFormData(formData);
		const { data: myCommunityInformation, error: myCommunityInformationError } = await supabase
			.from('community_bcyca_profile')
			.update({
				information_sheet_choices: body.information_sheet_choices,
				other_information_sheet: body.other_information_sheet
			})
			.eq('user_id', session.user.id)
			.select();
		if (myCommunityInformationError) {
			console.log(
				'error profileMyCommunityInformation update community_bcyca_profile: ',
				myCommunityInformationError
			);
			error(
				400,
				`error profileMyCommunityInformation update community_bcyca_profile: ${myCommunityInformationError.message}`
			);
		}
		if (myCommunityInformation.length === 1) {
			communityBCYCAProfile = myCommunityInformation[0];
			return {
				communityBCYCAProfile
			};
		}
		error(400, 'Could not POST Profile MyCommunity Information data');
	}
};
