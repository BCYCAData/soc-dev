import { error, redirect } from '@sveltejs/kit';
import { getAboutMeFormData } from '$lib/server/form.utils';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session?.user) return redirect(307, '/auth/signin');
		const formData = await request.formData();
		const profileAboutMeFormData = getAboutMeFormData(formData);
		const { error: aboutMeDataError } = await supabase
			.from('user_profile')
			.update(profileAboutMeFormData)
			.eq('id', session?.user.id);
		if (aboutMeDataError) {
			console.log('error profileAboutMe update user_profile: ', aboutMeDataError);
			return error(400, `error profileAboutMe update user_profile: ${aboutMeDataError.message}`);
		}
		return { profileAboutMeFormData };
	}
};
