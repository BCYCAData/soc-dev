import { AuthApiError } from '@supabase/supabase-js';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { PUBLIC_GEOSCAPE_ADDRESS_API_KEY } from '$env/static/public';

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
	validate: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const searchaddressstreet = String(formData.get('streetaddress')).toUpperCase();
		const searchaddresssuburb = String(formData.get('suburb')).toUpperCase();

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
			console.error('Address validation error:', validationError);
			// TODO: Implement log Address validation error
			return {
				error: true,
				message: 'Failed to validate address',
				success: false
			};
		}

		const apiData = validationData[0] as AddressValidationResponse;

		return {
			apiData,
			error: false,
			success: true
		};
	},

	signup: async ({ url, request, locals: { supabase } }) => {
		const formData = await request.formData();
		const userMetadata = JSON.parse(
			formData.get('apiDatajson')?.toString() ?? '{}'
		) as AddressValidationResponse;
		const email = formData.get('email')?.toString();
		const password = formData.get('password')?.toString();

		if (!email || !password) {
			throw error(400, 'Email and password are required');
		}

		const { error: signUpError } = await supabase.auth.signUp({
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
				emailRedirectTo: `${url.origin}/auth/redirect/signup/personal-profile-form/`
			}
		});

		if (signUpError) {
			if (signUpError instanceof AuthApiError && signUpError.status === 400) {
				// TODO: Implement log signUpError error
				throw error(400, 'Invalid email or password');
			}
			throw error(500, 'Server error. Please try again later.');
		}

		throw redirect(303, '/auth/redirect/checkemail');
	}
};
