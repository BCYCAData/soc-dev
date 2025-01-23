import type { PageServerLoad } from './$types';

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
