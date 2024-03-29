import { error, redirect, type Actions } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { UserProfileData } from '$lib/custom.types';

let userProfileData: UserProfileData;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const body = getFormData(
			formData,
			session.user.id,
			session.user.app_metadata.principaladdresssiteoid,
			session.user.app_metadata.community,
			session.user.app_metadata.kyng
		);
		const { error: userProfileDataError, data: userProfile } = await supabase
			.from('user_profile')
			.update({
				first_name: body.userProfileData.first_name,
				family_name: body.userProfileData.family_name,
				mobile: body.userProfileData.mobile,
				fire_fighting_experience: body.userProfileData.fire_fighting_experience,
				fire_trauma: body.userProfileData.fire_trauma,
				plan_to_leave_before_fire: body.userProfileData.plan_to_leave_before_fire,
				plan_to_leave_before_flood: body.userProfileData.plan_to_leave_before_flood
			})
			.eq('id', session?.user.id)
			.select();
		if (userProfileDataError) {
			console.log('error profileAboutMe update user_profile: ', userProfileDataError);
			error(400, `error profileAboutMe update user_profile: ${userProfileDataError.message}`);
		}
		if (userProfile.length === 1) {
			userProfileData = userProfile[0];
			return {
				userProfileData
			};
		}
		error(400, 'Could not POST Profile About Me data');
	}
};
