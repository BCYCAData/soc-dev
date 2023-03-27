import { redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	resetPassword: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const { data, error } = await supabase.auth.updateUser({
			password: formData.get('password') as string
		});
		if (error) {
			console.log('update password settings error:', error.message);
			return {
				error: true,
				success: false
			};
		}
		return {
			error: false,
			success: true
		};
	}
};
