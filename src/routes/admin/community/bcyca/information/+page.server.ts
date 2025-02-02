import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	setLoading(true);
	const { data: bcycaInformationData, error: bcycaInformationError } = await supabase.rpc(
		'get_user_bcyca_information_data',
		{}
	);
	setLoading(false);
	if (bcycaInformationError) {
		console.log('error get BCYCA Information Sheet Choices Data:', bcycaInformationError);
		error(400, bcycaInformationError.message);
	}
	return {
		bcycaInformationData: bcycaInformationData
	};
};
