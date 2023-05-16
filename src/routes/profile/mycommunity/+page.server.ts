import { error, redirect, type Actions } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { UserProfileData } from '$lib/db.types';

let userProfileData: UserProfileData;

export const actions: Actions = {
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
		const { data: userProfile, error: myCommunityUserProfileError } = await supabase
			.from('user_profile')
			.update({
				stay_in_touch_choices: body.userProfileData.stay_in_touch_choices,
				other_comments: body.userProfileData.other_comments
			})
			.eq('id', session.user.id)
			.select();
		if (myCommunityUserProfileError) {
			console.log('error profileMyCommunity update user_profile: ', myCommunityUserProfileError);
			throw error(
				400,
				`error profileMyCommunity update user_profile: ${myCommunityUserProfileError.message}`
			);
		}
		if (userProfile.length === 1) {
			userProfileData = userProfile[0];
			return {
				userProfileData
			};
		}
		throw error(400, 'Could not POST Profile MyCommunity data');
	}
};
