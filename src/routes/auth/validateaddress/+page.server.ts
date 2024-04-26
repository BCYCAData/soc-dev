import { AuthApiError } from '@supabase/supabase-js';
import { PUBLIC_GEOSCAPE_ADDRESS_API_KEY } from '$env/static/public';
import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { APIData } from '$lib/types';

export const actions: Actions = {
	validate: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const searchaddressstreet = String(formData?.get('streetaddress')).toUpperCase();
		const searchaddresssuburb = String(formData.get('suburb')).toUpperCase();
		const {
			data: validationData,
			status,
			error: getValidationDataError
		} = await supabase.rpc('get_addresspoint_from_address', {
			address_text: searchaddressstreet,
			given_suburb: searchaddresssuburb,
			out_srid_value: 7844,
			api_key: PUBLIC_GEOSCAPE_ADDRESS_API_KEY
		});
		if (getValidationDataError) {
			console.log('Validate Address Error:', getValidationDataError);
			let emailSubject: PostgRestErrorEmailSubject = {
				type: `Validate Address Error.`,
				user: `Address:: ${searchaddressstreet}  ${searchaddresssuburb}.`,
				time: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
			};
			sendPostgRestErrorEmail(emailSubject, getValidationDataError);
			error(400, `Validate Address:  Error ${getValidationDataError.message}`);
			return {
				error: true,
				success: false
			};
		}
		const apiData = { ...validationData[0] };
		if (status !== 200) {
			console.log(`Validate Address Failure: Status ${status}`, getValidationDataError);
			let emailSubject: PostgRestErrorEmailSubject = {
				type: `Validate Address Failure: Status ${status}`,
				user: `Address:: ${searchaddressstreet}  ${searchaddresssuburb}.`,
				time: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
			};
			if (getValidationDataError) {
				sendPostgRestErrorEmail(emailSubject, getValidationDataError);
				return {
					apiData,
					error: true,
					success: false
				};
			}
			let emptyValidationError = {
				message: `Could not validate address`,
				details: 'No error from PostgRest',
				hint: 'na',
				code: 'na'
			};
			sendPostgRestErrorEmail(emailSubject, emptyValidationError);
			return {
				apiData,
				error: false,
				success: false
			};
		}
		return {
			apiData,
			error: false,
			success: apiData.status === 200
		};
	},
	signup: async ({ url, request, locals: { supabase } }) => {
		const formData = await request.formData();
		const user_metadata: APIData = JSON.parse(formData.get('apiDatajson')?.toString() || '');
		const { data: signUpData, error: errorSignUp } = await supabase.auth.signUp({
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			options: {
				data: {
					principaladdresssiteoid: user_metadata.principaladdresssiteoid,
					validaddressstreet: user_metadata.validaddressstreet,
					validaddresssuburb: user_metadata.validaddresssuburb,
					validaddresspostcode: user_metadata.validaddresspostcode,
					searchaddressstreet: user_metadata.searchaddressstreet,
					searchaddresssuburb: user_metadata.searchaddresssuburb,
					community: user_metadata.community
				},
				emailRedirectTo: `${url.origin}/auth/redirect/signup/survey/`
			}
		});
		if (errorSignUp) {
			console.log('SignUpError: ', JSON.stringify(errorSignUp));
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
			redirect(302, '/auth/redirect/signup/userexists');
		}
		redirect(302, '/auth/redirect/checkemail');
		return {
			error: false,
			success: true
		};
	}
};
