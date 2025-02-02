import { AuthApiError } from '@supabase/supabase-js';
import { redirect, type Actions } from '@sveltejs/kit';
import { isEmailAllowed } from '$lib/server/auth/dev-config';

import { PUBLIC_GEOSCAPE_ADDRESS_API_KEY } from '$env/static/public';
import { logSignUpSignInError } from '$lib/server/errorLogging';
import { SITE_URL } from '$lib/constants';

interface ValidateActionResponse {
	apiData?: AddressValidationResponse;
	error: boolean;
	message?: string;
	success: boolean;
	formInputs?: {
		streetaddress: string;
		suburb: string;
	};
}

interface AddressValidationResponse {
	principaladdresssiteoid: string;
	validaddressstreet: string;
	validaddresssuburb: string;
	validaddresspostcode: string;
	searchaddressstreet: string;
	searchaddresssuburb: string;
	community: string;
	status: number;
}

export const actions: Actions = {
	validate: async ({ request, locals: { supabase } }): Promise<ValidateActionResponse> => {
		const formData = await request.formData();
		const searchaddressstreet = String(formData.get('streetaddress')).toUpperCase();
		const searchaddresssuburb = String(formData.get('suburb')).toUpperCase();
		const clientIp =
			request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
		const userAgent = request.headers.get('user-agent') || 'unknown';

		const { data: validationData, error: validationError } = await supabase.rpc(
			'get_addresspoint_from_address',
			{
				address_text: searchaddressstreet,
				given_suburb: searchaddresssuburb,
				out_srid_value: 7844,
				api_key: PUBLIC_GEOSCAPE_ADDRESS_API_KEY
			}
		);

		if (validationError) {
			console.log('validationError', validationError);
			await logSignUpSignInError(supabase, {
				errorType: 'VALIDATION_ERROR',
				errorMessage: validationError.message,
				errorDetails: validationError,
				clientIp,
				userAgent,
				status: Number(validationError?.code) || 500,
				metadata: { searchaddressstreet, searchaddresssuburb },
				table: 'address_validation_errors'
			});
			return {
				error: true,
				message: 'Failed to validate address',
				success: false,
				formInputs: {
					streetaddress: searchaddressstreet,
					suburb: searchaddresssuburb
				}
			};
		}
		const apiData = validationData[0] as AddressValidationResponse;
		console.log('apiData', apiData);
		return { apiData, error: false, success: true };
	},

	signup: async ({ url, request, locals: { supabase } }) => {
		const formData = await request.formData();
		const clientIp =
			request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
		const userAgent = request.headers.get('user-agent') || 'unknown';
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();
		const apiDataJson = formData.get('apiDatajson')?.toString() ?? '{}';
		const userMetadata = JSON.parse(apiDataJson) as AddressValidationResponse;
		let redirectType = 'signup';
		try {
			if (!email || !password) {
				await logSignUpSignInError(supabase, {
					errorType: 'VALIDATION_ERROR',
					errorMessage: 'Email and password are required',
					errorDetails: null,
					clientIp,
					userAgent,
					status: 400,
					metadata: { email: email || 'not_provided', userMetadata },
					table: 'signup_errors'
				});
				return {
					error: true,
					message: 'Email and password are required',
					success: false,
					apiData: userMetadata
				};
			}

			const allowed = await isEmailAllowed(email);

			if (!allowed) {
				await logSignUpSignInError(supabase, {
					errorType: 'EMAIL_NOT_ALLOWED',
					errorMessage: 'Email not in allowed list',
					errorDetails: null,
					clientIp,
					userAgent,
					status: 403,
					metadata: { email, userMetadata },
					table: 'signup_errors'
				});
				throw redirect(303, '/auth/redirect/email-not-allowed');
			}

			const { data: signupData, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						principaladdresssiteoid: userMetadata.principaladdresssiteoid,
						validaddressstreet: userMetadata.validaddressstreet,
						validaddresssuburb: userMetadata.validaddresssuburb,
						validaddresspostcode: userMetadata.validaddresspostcode,
						searchaddressstreet: userMetadata.searchaddressstreet,
						searchaddresssuburb: userMetadata.searchaddresssuburb,
						community: userMetadata.community
					},
					emailRedirectTo: `${SITE_URL}/auth/redirect/signup/personal-profile-form/`
				}
			});
			if (signUpError) {
				console.log('signUpError', signUpError);
				if (signUpError instanceof AuthApiError && signUpError.status === 400) {
					await logSignUpSignInError(supabase, {
						errorType: 'AUTH_ERROR',
						errorMessage: signUpError.message,
						errorDetails: signUpError,
						clientIp,
						userAgent,
						status: 400,
						metadata: { email, userMetadata },
						table: 'signup_errors'
					});
					return {
						error: true,
						message: 'Invalid email or password',
						success: false,
						apiData: userMetadata
					};
				}
				await logSignUpSignInError(supabase, {
					errorType: 'SERVER_ERROR',
					errorMessage: signUpError.message,
					errorDetails: signUpError,
					clientIp,
					userAgent,
					status: 500,
					metadata: { email, userMetadata },
					table: 'signup_errors'
				});
				return {
					error: true,
					message: 'Server error. Please try again later.',
					success: false,
					apiData: userMetadata
				};
			}
			if (signupData?.user?.identities?.length === 0) {
				await logSignUpSignInError(supabase, {
					errorType: 'EXISTING_USER',
					errorMessage: 'Email already exists',
					errorDetails: null,
					clientIp,
					userAgent,
					status: 409,
					metadata: { email, userMetadata },
					table: 'signup_errors'
				});
				redirectType = 'emailExists';
			}
		} catch (err) {
			const catchError = err as Error;
			await logSignUpSignInError(supabase, {
				errorType: 'UNEXPECTED_ERROR',
				errorMessage: catchError.message,
				errorDetails: { stack: catchError.stack },
				clientIp,
				userAgent,
				status: 500,
				metadata: {
					email: formData.get('email')?.toString() || 'unknown',
					formData: Object.fromEntries(formData)
				},
				table: 'signup_errors'
			});
			return {
				error: true,
				message: 'Server error. Please try again later.',
				success: false,
				apiData: userMetadata
			};
		}
		throw redirect(303, `/auth/redirect/signup/respond/?redirectType=${redirectType}`);
	}
};
