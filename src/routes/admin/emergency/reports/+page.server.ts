import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import type { PropertyAddress } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// Get streets data
	const { data: streetsData, error: getStreetsError } = await supabase.rpc('get_street_list', {});

	if (getStreetsError) {
		console.log('error errorStreets:', getStreetsError);
		error(400, getStreetsError.message);
	}

	// Get property addresses data
	const { data: propertyData, error: getPropertyError } = await supabase.rpc(
		'get_property_address_list'
	);

	if (getPropertyError) {
		console.log('error propertyAddresses:', getPropertyError);
		error(400, getPropertyError.message);
	}

	if (streetsData.length > 0 && propertyData) {
		const streetList = streetsData.map(({ streets }: { streets: string }) => streets);
		return {
			streetList,
			propertyAddressList: propertyData.property_address_list as PropertyAddress[]
		};
	}

	error(400, 'Something went wrong retrieving the data');
};
