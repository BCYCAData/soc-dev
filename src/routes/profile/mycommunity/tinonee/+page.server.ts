import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityFormData } from '$lib/server/form.utils';

import type { UserProfile } from '$lib/custom.types';

let userProfileData: UserProfile;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const body = getMyCommunityFormData(formData);
		const { data: userProfile, error: myCommunityUserProfileError } = await supabase
			.from('user_profile')
			.update({
				stay_in_touch_choices: body.myCommunitysData.stay_in_touch_choices,
				other_comments: body.myCommunitysData.other_comments
			})
			.eq('id', session.user.id)
			.select();
		if (myCommunityUserProfileError) {
			console.log('error profileMyCommunity update user_profile: ', myCommunityUserProfileError);
			error(
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
		error(400, 'Could not POST Profile MyCommunity data');
	}
};
