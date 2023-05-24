import type { AddressPointData } from '$lib/types';
import { AuthApiError } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
	const formData = await request.formData();
	const user_metadata: AddressPointData = JSON.parse(
		formData.get('addresspointdatajson')?.toString() || ''
	);
	let roles: string[] = [];
	const { data: signUpData, error: errorSignUp } = await locals.supabase.auth.signUp({
		email: formData.get('email') as string,
		password: formData.get('password') as string,
		options: {
			data: {
				principaladdresssiteoid: user_metadata.principaladdresssiteoid,
				addresspoint: JSON.stringify(user_metadata.addresspoint),
				kit: 1,
				kitdate: null,
				roles: roles,
				community: user_metadata.communityname,
				searchaddress: user_metadata.searchaddress,
				validaddress: user_metadata.validaddress
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
