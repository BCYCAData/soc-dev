import { AuthApiError } from '@supabase/supabase-js';
import { error, redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const body = Object.fromEntries(await request.formData());
	const { data, error: errorSignUp } = await locals.dbClient.auth.signUp({
		email: body.email as string,
		password: body.password as string,
		options: {
			data: {
				principaladdresssiteoid: parseInt(body.principaladdresssiteoid as string),
				addresspoint: body.addresspoint as string,
				addressmetadata: body.addressmetadata as string
			},
			emailRedirectTo: `${locals.supabaseRedirectBase}/auth/redirect/signup/survey/`
		}
	});
	if (errorSignUp) {
		if (errorSignUp instanceof AuthApiError && errorSignUp.status === 400) {
			throw error(400, 'Invalid email or password.');
		} else {
			throw error(
				500,
				`Server error. Please try again later.
			${errorSignUp.message}`
			);
		}
	}
	if (data?.user?.identities?.length === 0) {
		return new Response(undefined, {
			status: 302,
			headers: { Location: '/auth/redirect/signup/userexists' }
		});
	}
	return new Response(undefined, {
		status: 302,
		headers: { Location: '/auth/redirect/checkemail' }
	});
};

// Success: a user is returned but session is null.
// If existing confirmed user: obfuscated/fake user object is returned
