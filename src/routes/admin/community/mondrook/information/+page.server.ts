import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	setLoading(true);
	const { data: mondrookInformationData, error: mondrookInformationError } = await supabase.rpc(
		'get_user_mondrook_information_data',
		{}
	);
	setLoading(false);
	if (mondrookInformationError) {
		console.log('error get Mondrook Information Sheet Choices Data:', mondrookInformationError);
		error(400, mondrookInformationError.message);
	}
	return {
		mondrookInformationData: mondrookInformationData
	};
};
