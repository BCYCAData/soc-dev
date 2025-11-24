import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase }, parent }) => {
	const parentData = await parent();

	const { data: kyngMessagesData, error: kyngMessagesError } = await supabase.rpc(
		'get_kyng_coordinator_messages_for_user',
		{
			id_input: parentData.user.id as string
		}
	);

	if (kyngMessagesError) {
		console.log('error get KYNG Coordinator Messages for User:', kyngMessagesError);
		error(400, kyngMessagesError.message);
	}

	return {
		kyngMessages: kyngMessagesData || [],
		userRole: null,
		propertyIds: null,
		userProfile: null,
		optionsData: {
			userOptionsData: { object_names: [] },
			communityBCYCAOptionsData: { object_names: [] },
			communityExternalOptionsData: { object_names: [] },
			communityTinoneeOptionsData: { object_names: [] },
			communityMondrookOptionsData: { object_names: [] }
		}
	};
};
