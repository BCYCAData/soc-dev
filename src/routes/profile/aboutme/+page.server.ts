import { error, redirect } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { Actions } from './$types';
import type { UserProfileData } from '$lib/db.types';

let userProfileData: UserProfileData;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const body = getFormData(formData, locals.session.user.id);
		const { error: userProfileDataError, data: userProfile } = await locals.dbClient
			.from('user_profile')
			.update({
				first_name: body.userProfileData.first_name,
				family_name: body.userProfileData.family_name,
				mobile: body.userProfileData.mobile,
				rfs_survival_plan: body.userProfileData.rfs_survival_plan,
				send_rfs_survival_plan: body.userProfileData.send_rfs_survival_plan,
				fire_fighting_experience: body.userProfileData.fire_fighting_experience,
				fire_trauma: body.userProfileData.fire_trauma,
				plan_to_leave_before_fire: body.userProfileData.plan_to_leave_before_fire,
				plan_to_leave_before_flood: body.userProfileData.plan_to_leave_before_flood
			})
			.eq('id', locals?.session?.user.id)
			.select();
		if (userProfileDataError) {
			console.log('error profileAboutMe update user_profile: ', userProfileDataError);
			throw error(400, `error profileAboutMe update user_profile: ${userProfileDataError.message}`);
		}
		if (userProfile.length === 1) {
			userProfileData = userProfile[0];
			return {
				userProfileData
			};
		}
		throw error(400, 'Could not POST Profile About Me data');
	}
};
