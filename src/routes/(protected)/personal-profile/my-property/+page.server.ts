import { PUBLIC_GEOSCAPE_ADDRESS_API_KEY } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface PropertyProfile {
	id: string;
	property_address_street: string;
	property_address_suburb: string;
	property_address_postcode: string;
	linked_users: string[];
}

export const load: PageServerLoad = async ({ locals: { supabase }, parent }) => {
	const parentData = await parent();
	const propertyIds = parentData.propertyIds;
	const propertyProfiles = parentData.userProfile.property_profile;

	const { data: properties, error } = await supabase
		.from('property_profile')
		.select('id, property_address_street, property_address_suburb, property_address_postcode')
		.in('id', propertyIds);

	if (error) {
		throw error;
	}

	const propertiesWithLinkedUsers = properties.map(
		(property: Omit<PropertyProfile, 'linked_users'>) => {
			const matchingProfile = propertyProfiles.find(
				(profile: PropertyProfile) => profile.id === property.id
			);
			return {
				...property,
				linked_users: matchingProfile?.linked_users || []
			};
		}
	);

	return {
		properties: propertiesWithLinkedUsers
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
				return fail(400, {
					success: false,
					message: 'Failed to validate address'
				});
			}

			if (!validationData) {
				return fail(404, {
					success: false,
					message: 'Address not found'
				});
			}

			return {
				success: true,
				message: 'Address validated successfully',
				data: validationData
			};
		} catch (error) {
			return fail(500, {
				success: false,
				message: 'Network or server error occurred'
			});
		}
	},
	addproperty: async ({ request, locals: { supabase, user } }) => {
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
			console.log('error', error);
			return fail(400, {
				success: false,
				message: 'Failed to add property'
			});
		}

		return {
			success: true,
			message: 'Property added successfully'
		};
	}
};
