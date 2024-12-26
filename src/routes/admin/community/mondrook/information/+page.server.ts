import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	const { data: mondrookInformationData, error: mondrookInformationError } = await supabase.rpc(
		'get_user_mondrook_information_data',
		{}
	);
	if (mondrookInformationError) {
		console.log('error get Mondrook Information Sheet Choices Data:', mondrookInformationError);
		error(400, mondrookInformationError.message);
	}
	return {
		mondrookInformationData: mondrookInformationData
	};
};
