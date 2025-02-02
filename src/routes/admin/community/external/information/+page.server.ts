import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	setLoading(true);
	const { data: externalInformationData, error: externalInformationError } = await supabase.rpc(
		'get_user_external_information_data',
		{}
	);
	setLoading(false);
	if (externalInformationError) {
		console.log('error get External Information Sheet Choices Data:', externalInformationError);
		error(400, externalInformationError.message);
	}
	return {
		externalInformationData: externalInformationData
	};
};
