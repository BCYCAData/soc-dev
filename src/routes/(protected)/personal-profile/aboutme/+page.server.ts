import { getAboutMeFormData } from '$lib/server/form.utilities';
import { fail } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		const formData = await request.formData();
		const profileAboutMeFormData = getAboutMeFormData(formData);
		const { error: aboutMeDataError } = await supabase
			.from('user_profile')
			.update(profileAboutMeFormData)
			.eq('id', user?.id);
		if (aboutMeDataError) {
			console.log('error profileAboutMe update user_profile: ', aboutMeDataError);
			return fail(400, {
				success: false,
				message: `Failed to update profile: ${aboutMeDataError?.message}`
			});
		}
		return {
			success: true,
			message: 'Profile updated successfully'
		};
	}
};
