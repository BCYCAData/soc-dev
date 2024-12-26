import { redirect } from '@sveltejs/kit';
import { REDIRECT_FOUND, REDIRECT_SEE_OTHER } from '$lib/constants';

import type { EmailOtpType } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;
	const next = url.searchParams.get('next') ?? '/';

	console.log('token_hash:', token_hash);

	const redirectTo = new URL(url);
	redirectTo.pathname = next;
	redirectTo.searchParams.delete('token_hash');
	redirectTo.searchParams.delete('type');

	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({ token_hash, type });
		if (error) {
			console.error('OTP verification error:', error);
			redirectTo.pathname = '/auth/error';
			redirectTo.searchParams.set('error', 'otp_verification_failed');
		} else {
			switch (type) {
				case 'email':
					redirectTo.pathname = '/auth/redirect/signup/personal-profile-form/';
					redirect(REDIRECT_FOUND, redirectTo);
					break;
				case 'signup':
					console.log('Is signup confirmed');
					break;
				case 'invite':
					console.log('Is invite confirmed');
					break;
				case 'recovery':
					console.log('Is recovery confirmed');
					redirectTo.pathname = '/auth/redirect/resetpassword/';
					redirect(REDIRECT_FOUND, redirectTo);
					break;
				case 'email_change':
					console.log('Is email_change confirmed');
					break;
			}
		}
	}

	// return the user to an error page with some instructions
	redirectTo.pathname = '/auth/error';
	redirectTo.searchParams.set('error', 'confirmation_failed');
	redirect(REDIRECT_SEE_OTHER, redirectTo);
};
