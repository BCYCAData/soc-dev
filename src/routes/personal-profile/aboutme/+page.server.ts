import { getAboutMeFormData } from '$lib/server/form.utilities';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const { user } = await getSessionAndUser();
		const formData = await request.formData();
		const profileAboutMeFormData = getAboutMeFormData(formData);
		const { error: aboutMeDataError } = await supabase
			.from('user_profile')
			.update(profileAboutMeFormData)
			.eq('id', user?.id);
		if (aboutMeDataError) {
			console.log('error profileAboutMe update user_profile: ', aboutMeDataError);
			return {
				profileAboutMeFormData,
				success: false,
				error: true,
				errorMessage: `${aboutMeDataError?.message}`
			};
		}
		return { profileAboutMeFormData, success: true, error: false, errorMessage: '' };
	}
};
