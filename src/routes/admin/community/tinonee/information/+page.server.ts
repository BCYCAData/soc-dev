import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSessionAndUser }, parent }) => {
	setLoading(true);
	const { data: tinoneeInformationData, error: tinoneeInformationError } = await supabase.rpc(
		'get_user_tinonee_information_data',
		{}
	);
	setLoading(false);
	if (tinoneeInformationError) {
		console.log('error get Tinonee Information Sheet Choices Data:', tinoneeInformationError);
		error(400, tinoneeInformationError.message);
	}
	return {
		tinoneeInformationData: tinoneeInformationData
	};
};
