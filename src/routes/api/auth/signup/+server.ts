import { AuthApiError } from '@supabase/supabase-js';
import { error, redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST = (async ({ locals, request }) => {
	// const formData = await request.formData();
	// let password = formData.get('password') as string;
	// let email = formData.get('email') as string;
	// let oid = formData.get('principaladdresssiteoid') as string;
	// let addresspoint = formData.get('addresspoint') as string;
	// let addressmetadata = formData.get('addressmetadata') as string;
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
			emailRedirectTo: `${locals.supabaseRedirectBase}/auth/redirect`
		}
	});
	if (errorSignUp) {
		if (errorSignUp instanceof AuthApiError && errorSignUp.status === 400) {
			throw error(400, 'Invalid email or password.');
		} else {
			throw error(500, 'Server error. Please try again later.');
		}
	}
	return new Response(undefined, { status: 302, headers: { Location: '/auth/redirect' } });
}) satisfies RequestHandler;
