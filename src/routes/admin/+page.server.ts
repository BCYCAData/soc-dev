import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session?.user) {
		throw redirect(307, '/auth/signin');
	}
	return {
		session,
		adminData: 'It works'
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		// const { error: userProfileDataError, data: userProfileData } = await supabase
		// 	.from('user_profile')
		// 	.update({
		// 		first_name: formData.get('first_name'),
		// 		family_name: formData.get('family_name'),
		// 		mobile: formData.get('mobile'),
		// 		rfs_survival_plan: formData.get('rfs_survival_plan'),
		// 		send_rfs_survival_plan: formData.get('send_rfs_survival_plan'),
		// 		fire_fighting_experience: formData.get('fire_fighting_experience'),
		// 		fire_trauma: formData.get('fire_trauma'),
		// 		plan_to_leave_before_fire: formData.get('plan_to_leave_before_fire'),
		// 		plan_to_leave_before_flood: formData.get('plan_to_leave_before_flood')
		// 	})
		// 	.eq('id', session?.user.id)
		// 	.select();
		// if (userProfileDataError) {
		// 	console.log('update error AboutMe:', userProfileDataError);
		// 	throw error(400, `save Profile  AboutMe data  Error ${userProfileDataError.message}`);
		// }
		// if (userProfileData.length === 1) {
		// 	const profileAboutMe = userProfileData[0];
		// 	return {
		// 		user: session?.user,
		// 		profileAboutMe: profileAboutMe
		// 	};
		// }
		// throw error(400, 'Could not POST Profile About Me data');
		return {};
	}
};
