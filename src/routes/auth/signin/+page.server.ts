import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { AuthError } from '@supabase/supabase-js';
import { logSignUpSignInError } from '$lib/server/errorLogging';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.getSessionAndUser();
	if (session.user) {
		redirect(303, '/');
	}
	return {
		session: session,
		user: null,
		userRoles: null,
		permissions: null,
		coordinatesKYNG: null,
		propertyIds: null,
		userProfile: null,
		optionsData: {
			userOptionsData: { object_names: [] },
			communityBCYCAOptionsData: { object_names: [] },
			communityExternalOptionsData: { object_names: [] },
			communityTinoneeOptionsData: { object_names: [] },
			communityMondrookOptionsData: { object_names: [] }
		}
	};
};

export const actions: Actions = {
	signin: async (event) => {
		const {
			request,
			locals: { supabase }
		} = event;

		const clientIp =
			request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
		const userAgent = request.headers.get('user-agent') || 'unknown';

		try {
			const formData = await request.formData();
			const email = formData.get('email')?.toString();
			const password = formData.get('password')?.toString();

			if (!email || !password) {
				await logSignUpSignInError(supabase, {
					errorType: 'VALIDATION_ERROR',
					errorMessage: 'Email and password are required',
					errorDetails: null,
					clientIp,
					userAgent,
					status: 400,
					metadata: { email: email || 'not_provided' },
					table: 'signin_errors'
				});
				return fail(400, {
					error: 'Email and password are required'
				});
			}

			const { data, error: signInError } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (signInError) {
				if (signInError instanceof AuthError) {
					if (signInError.status === 400) {
						await logSignUpSignInError(supabase, {
							errorType: 'AUTH_ERROR',
							errorMessage: signInError.message,
							errorDetails: signInError,
							clientIp,
							userAgent,
							status: 400,
							metadata: { email },
							table: 'signin_errors'
						});
						return fail(400, {
							error: 'Invalid credentials'
						});
					} else if (signInError.status === 429) {
						await logSignUpSignInError(supabase, {
							errorType: 'RATE_LIMIT_ERROR',
							errorMessage: signInError.message,
							errorDetails: signInError,
							clientIp,
							userAgent,
							status: 429,
							metadata: { email },
							table: 'signin_errors'
						});
						return fail(429, {
							error: 'Too many requests. Please try again later.'
						});
					}
				}

				await logSignUpSignInError(supabase, {
					errorType: 'SERVER_ERROR',
					errorMessage: signInError.message,
					errorDetails: signInError,
					clientIp,
					userAgent,
					status: 500,
					metadata: { email },
					table: 'signin_errors'
				});
				return fail(500, {
					error: 'An unexpected error occurred. Please try again.'
				});
			}

			if (!data.session) {
				await logSignUpSignInError(supabase, {
					errorType: 'SESSION_ERROR',
					errorMessage: 'Session not established after successful sign-in',
					errorDetails: null,
					clientIp,
					userAgent,
					status: 500,
					metadata: { email },
					table: 'signin_errors'
				});
				return fail(500, {
					error: 'Failed to establish session. Please try again.'
				});
			}

			throw redirect(303, '/personal-profile');
		} catch (error) {
			const catchError = error as Error;
			await logSignUpSignInError(supabase, {
				errorType: 'UNEXPECTED_ERROR',
				errorMessage: catchError.message,
				errorDetails: { stack: catchError.stack },
				clientIp,
				userAgent,
				status: 500,
				metadata: { email: 'unknown' },
				table: 'signin_errors'
			});
			return fail(500, {
				error: 'An unexpected error occurred. Please try again.'
			});
		}
	}
};
