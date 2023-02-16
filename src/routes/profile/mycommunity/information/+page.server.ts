import { error, redirect } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { Actions } from './$types';
import type { UserBCYCAProfileData } from '$lib/db.types';

let userBCYCAData: UserBCYCAProfileData;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const body = getFormData(formData, locals.session.user.id);
		const { data: myCommunityInformation, error: myCommunityInformationError } =
			await locals.dbClient
				.from('user_bcyca_profile')
				.update({
					information_sheet_choices: body.userBCYCAProfileData.information_sheet_choices,
					other_information_sheet: body.userBCYCAProfileData.other_information_sheet
				})
				.eq('user_id', locals.session.user.id)
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
