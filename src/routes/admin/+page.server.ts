import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	// console.log(locals?.session?.user.id);
	// console.log(locals?.session?.user.app_metadata.claims);
	// const { error: adminDataError, data: adminData } = await locals.dbClient
	// 	.from('user_profile')
	// 	.select('*')
	// 	.eq('id', locals.session?.user.id);
	// if (adminDataError) {
	// 	throw error(400, `get Admin Data Error ${adminDataError.message}`);
	// }
	// if (adminData.length === 1) {
	return { adminData: 'It works' };
	// }
	// throw error(400, 'Something went wrong retrieving the Administration data.');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		// const { error: userProfileDataError, data: userProfileData } = await locals.dbClient
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
		// 	.eq('id', locals?.session?.user.id)
		// 	.select();
		// if (userProfileDataError) {
		// 	console.log('update error AboutMe:', userProfileDataError);
		// 	throw error(400, `save Profile  AboutMe data  Error ${userProfileDataError.message}`);
		// }
		// if (userProfileData.length === 1) {
		// 	const profileAboutMe = userProfileData[0];
		// 	return {
		// 		user: locals?.session?.user,
		// 		profileAboutMe: profileAboutMe
		// 	};
		// }
		// throw error(400, 'Could not POST Profile About Me data');
		return {};
	}
};
