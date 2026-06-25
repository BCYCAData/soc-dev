import { redirect, type Cookies } from '@sveltejs/kit';
import {
	REDIRECT_FOUND,
	REDIRECT_SEE_OTHER,
	RECOVERY_COOKIE_NAME,
	RECOVERY_COOKIE_PATH,
	RECOVERY_COOKIE_MAX_AGE
} from '$lib/constants';

import type { EmailOtpType } from '@supabase/supabase-js';
import type { RequestHandler } from './$types';
import { clearSessionTracking } from '$lib/server/auth/sessionTracking';

/**
 * Mark the current session as a genuine password-recovery session. The reset-password
 * page requires this short-lived, HttpOnly flag (alongside a session) before it will
 * render the "set new password" form.
 */
function markRecoverySession(cookies: Cookies): void {
	cookies.set(RECOVERY_COOKIE_NAME, '1', {
		path: RECOVERY_COOKIE_PATH,
		httpOnly: true,
		sameSite: 'lax',
		maxAge: RECOVERY_COOKIE_MAX_AGE
	});
}

export const GET: RequestHandler = async ({ url, cookies, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;
	const next = url.searchParams.get('next') ?? '/';

	const redirectTo = new URL(url);
	redirectTo.pathname = next;
	redirectTo.searchParams.delete('code');
	redirectTo.searchParams.delete('token_hash');
	redirectTo.searchParams.delete('type');
	redirectTo.searchParams.delete('next');

	// PKCE flow (@supabase/ssr default): Supabase's /auth/v1/verify validates the
	// `pkce_` token in the email link, then redirects here with `?code=<uuid>`.
	// Exchange it for a session (this also sets the auth cookies) and forward to
	// `next`, which the originating action sets per flow (e.g. resetpassword).
	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		if (error) {
			console.error('Code exchange error:', error);
			redirectTo.pathname = '/auth/error';
			redirectTo.searchParams.set('error', 'otp_verification_failed');
		} else if (redirectTo.pathname.startsWith(RECOVERY_COOKIE_PATH)) {
			// Recovery link (resetPasswordForEmail set next=/auth/redirect/resetpassword).
			markRecoverySession(cookies);
		}
		redirect(REDIRECT_SEE_OTHER, redirectTo);
	}

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
					markRecoverySession(cookies);
					redirectTo.pathname = '/auth/redirect/resetpassword/';
					redirect(REDIRECT_FOUND, redirectTo);
					break;
				case 'email_change':
					try {
						const { error: refreshError } = await supabase.auth.refreshSession();
						if (refreshError) throw refreshError;

						// Sign out after successful email change
						await supabase.auth.signOut();
						clearSessionTracking(cookies);
						redirectTo.pathname = '/auth/signin';
						redirectTo.searchParams.set('message', 'email_changed');
					} catch (error) {
						console.error('Session refresh error:', error);
						redirectTo.pathname = '/auth/error';
						redirectTo.searchParams.set('error', 'email_change_failed');
					}
					redirect(REDIRECT_SEE_OTHER, redirectTo);
					break;
			}
		}
	}

	// return the user to an error page with some instructions
	redirectTo.pathname = '/auth/error';
	redirectTo.searchParams.set('error', 'confirmation_failed');
	redirect(REDIRECT_SEE_OTHER, redirectTo);
};
