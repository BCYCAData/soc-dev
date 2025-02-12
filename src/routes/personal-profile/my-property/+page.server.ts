import { PUBLIC_GEOSCAPE_ADDRESS_API_KEY } from '$env/static/public';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	const parentData = await parent();
	const propertyIds = parentData.propertyIds;

	const { data: properties, error } = await supabase
		.from('property_profile')
		.select('id, property_address_street, property_address_suburb, property_address_postcode')
		.in('id', propertyIds);

	if (error) {
		throw error;
	}

	return {
		properties
	};
};

export const actions: Actions = {
	validate: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const searchaddressstreet = String(formData.get('streetaddress')).toUpperCase();
		const searchaddresssuburb = String(formData.get('suburb')).toUpperCase();

		try {
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
				return {
					type: 'error',
					error: 'Failed to validate address'
				};
			}

			if (!validationData) {
				return {
					type: 'error',
					error: 'Address not found'
				};
			}

			return {
				type: 'success',
				data: validationData
			};
		} catch (error) {
			return {
				type: 'error',
				error: 'Network or server error occurred'
			};
		}
	},
	addproperty: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const { user } = await getSessionAndUser();
		const formData = await request.formData();

		const { error } = await supabase.rpc('create_property_for_user', {
			user_id: user.id,
			var_principaladdresssiteoid: Number(formData.get('principaladdresssiteoid')),
			var_valid_address_street: String(formData.get('validaddressstreet')),
			var_valid_address_suburb: String(formData.get('validaddresssuburb')),
			var_valid_address_postcode: String(formData.get('validaddresspostcode')),
			var_search_address_street: String(formData.get('streetaddress')),
			var_search_address_suburb: String(formData.get('suburb'))
		});

		if (error) {
			return {
				type: 'error',
				error: 'Failed to add property'
			};
		}

		return {
			type: 'success',
			data: { message: 'Property added successfully' }
		};
	}
};
