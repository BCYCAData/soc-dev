import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_GEOSCAPE_ADDRESS_API_KEY } from '$env/static/public';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: customAddresses, error: customAddressesError } = await locals.supabase
		.from('custom_address')
		.select('*');

	if (customAddressesError) {
		throw error(500, 'Failed to load data');
	}

	return { customAddresses };
};

export const actions: Actions = {
	validateAddress: async ({ request, locals }) => {
		const formData = await request.formData();
		const address = formData.get('address');
		const suburb = formData.get('suburb');

		const { data: validatedAddressData, error: validatedAddressDataError } =
			await locals.supabase.rpc('get_addresspoint_from_address', {
				address_text: address,
				given_suburb: suburb,
				out_srid_value: 7844,
				api_key: PUBLIC_GEOSCAPE_ADDRESS_API_KEY
			});

		if (validatedAddressDataError) {
			console.error('validatedAddressDataError', validatedAddressDataError);
			if (validatedAddressDataError.message === 'canceling statement due to statement timeout') {
				return {
					success: false,
					message: 'The network is slow. Please tap `Validate Address` again.'
				};
			}
			return { success: false, message: 'Failed to validate address' };
		}

		console.log('validatedAddressData', validatedAddressData);
		return { success: true, validatedAddressData };
	},

	upsertAddress: async ({ request, locals }) => {
		const formData = await request.formData();
		const addressData = {
			address: formData.get('address'),
			community: formData.get('community'),
			principaladdresssiteoid: formData.get('principaladdresssiteoid'),
			kyng: formData.get('kyng'),
			suburb: formData.get('suburb'),
			postcode: formData.get('postcode'),
			addresspoint_geom: formData.get('addresspoint_geom')
		};

		const id = formData.get('id');
		if (id) {
			// Update existing address
			await locals.supabase.from('custom_address').update(addressData).eq('id', id);
		} else {
			// Insert new address
			await locals.supabase.from('custom_address').insert(addressData);
		}

		return { success: true };
	}
};
