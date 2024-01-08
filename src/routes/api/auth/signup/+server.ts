import { AuthApiError } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import { getURL } from '$lib/utils';

import type { RequestHandler } from './$types';
import type { AddressPointData } from '$lib/types';

export const POST: RequestHandler = async (event) => {
	const { locals, request } = event
	// const url = getURL();
	const formData = await request.formData();
	const user_metadata: AddressPointData = JSON.parse(
		formData.get('addresspointdatajson')?.toString() || ''
	);
	const roles: string[] = [];
	console.log('user_metadata', JSON.stringify(user_metadata),)
	const { data: signUpData, error: errorSignUp } = await locals.supabase.auth.signUp({
		email: formData.get('email') as string,
		password: formData.get('password') as string,
		options: {
			data: {
				// user_metadata: JSON.stringify(user_metadata),
				principaladdresssiteoid: user_metadata.principaladdresssiteoid,
				addresspoint: JSON.stringify(user_metadata.addresspoint),
				kit: 1,
				kitdate: null,
				roles: roles,
				community: '',
				searchaddress: user_metadata.searchaddress,
				validaddress: user_metadata.validaddress
			},
			emailRedirectTo: `${locals.supabaseRedirectBase}/auth/redirect/signup/survey/`
		}
	});
	if (errorSignUp) {
		console.log("SignUpError: ", errorSignUp.message)
		if (errorSignUp instanceof AuthApiError && errorSignUp.status === 400) {
			error(400, 'Invalid email or password.');
		} else {
			error(
				500,
				`Server error. Please try again later.
			${errorSignUp.message}`
			);
		}
	}
	if (signUpData?.user?.identities?.length === 0) {
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
