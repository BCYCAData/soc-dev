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
			await locals.supabase.rpc('get_validated_addresspoint_from_address', {
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
		return { success: true, validatedAddressData };
	},

	checkGNAFAddress: async ({ request, locals }) => {
		const formData = await request.formData();
		const { data: checkedAddressData, error: checkedAddressError } = await locals.supabase.rpc(
			'check_gnaf_address_match',
			{
				input_number: formData.get('number'),
				input_street: formData.get('street'),
				input_street_type: formData.get('streetType'),
				input_locality: formData.get('locality'),
				api_key: PUBLIC_GEOSCAPE_ADDRESS_API_KEY
			}
		);

		if (checkedAddressError) {
			return { success: false, message: 'Failed to check address' };
		}

		return { success: true, checkedAddressData };
	},
	upsertAddress: async ({ request, locals }) => {
		const formData = await request.formData();
		const addressData = {
			address: formData.get('address') + '' + formData.get('suburb'),
			community: formData.get('community'),
			principaladdresssiteoid: Number(formData.get('principaladdresssiteoid')) || null,
			kyng: formData.get('kyng'),
			suburb: formData.get('suburb'),
			postcode: formData.get('postcode'),
			addresspoint_geom: formData.get('addresspoint_geom')
		};

		const id = formData.get('id');
		if (id) {
			// Update existing address
			const { data: updatedAddressData, error: updateAddressDataError } = await locals.supabase
				.from('custom_address')
				.update(addressData)
				.eq('id', id);
			if (updateAddressDataError) {
				console.error('validatedAddressDataError', updateAddressDataError);
				return { success: false, message: 'Failed to validate address' };
			}
			return { success: true, updatedAddressData };
		} else {
			// Insert new address
			const { data: insertedAddressData, error: insertAddressDataError } = await locals.supabase
				.from('custom_address')
				.insert(addressData);
			if (insertAddressDataError) {
				console.error('insertAddressDataError', insertAddressDataError);
				return { success: false, message: 'Failed to validate address' };
			}
			return { success: true, insertedAddressData };
		}
	}
};
