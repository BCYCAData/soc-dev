import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: mondrookInformationData, error: mondrookInformationError } = await supabase.rpc(
		'get_user_mondrook_information_data',
		{}
	);

	if (mondrookInformationError) {
		console.error('error get Mondrook Information Sheet Choices Data:', mondrookInformationError);
		error(400, mondrookInformationError.message);
	}
	return {
		mondrookInformationData: mondrookInformationData
	};
};
