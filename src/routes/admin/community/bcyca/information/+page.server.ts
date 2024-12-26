import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { data: bcycaInformationData, error: bcycaInformationError } = await supabase.rpc(
		'get_user_bcyca_information_data',
		{}
	);
	if (bcycaInformationError) {
		console.log('error get BCYCA Information Sheet Choices Data:', bcycaInformationError);
		error(400, bcycaInformationError.message);
	}
	return {
		bcycaInformationData: bcycaInformationData
	};
};
