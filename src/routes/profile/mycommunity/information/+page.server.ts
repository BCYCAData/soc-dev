import { error, redirect } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { UserBCYCAProfileData } from '$lib/db.types';

let userBCYCAData: UserBCYCAProfileData;

export const actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const body = getFormData(
			formData,
			session.user.id,
			session.user.app_metadata.principaladdresssiteoid
		);
		const { data: myCommunityInformation, error: myCommunityInformationError } = await supabase
			.from('user_bcyca_profile')
			.update({
				information_sheet_choices: body.userBCYCAProfileData.information_sheet_choices,
				other_information_sheet: body.userBCYCAProfileData.other_information_sheet
			})
			.eq('user_id', session.user.id)
			.select();
		if (myCommunityInformationError) {
			console.log(
				'error profileMyCommunityInformation update user_bcyca_profile: ',
				myCommunityInformationError
			);
			throw error(
				400,
				`error profileMyCommunityInformation update user_bcyca_profile: ${myCommunityInformationError.message}`
			);
		}
		if (myCommunityInformation.length === 1) {
			userBCYCAData = myCommunityInformation[0];
			return {
				userBCYCAData
			};
		}
		throw error(400, 'Could not POST Profile MyCommunity Information data');
	}
};
