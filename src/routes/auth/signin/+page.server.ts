import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	signin: async (event) => {
		const {
			request,
			url,
			locals: { supabase }
		} = event;
		const body = Object.fromEntries(await request.formData());
		const { error } = await supabase.auth.signInWithPassword({
			email: body.email as string,
			password: body.password as string
		});

		if (error) {
			console.log('Sign in Error:- ', error);
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: 'Invalid credentials'
				});
			}
			return fail(500, {
				message: 'Server error. Try again later.'
			});
		}
		redirect(303, '/profile');
	}
};
