import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { permissions, coordinatesKYNG, supabase },
	parent
}) => {
	const parentData = await parent();
	// Parent layout already validated user
	// authGuard already checked KYNG permissions via routeMatchers
	// Just verify coordinatesKYNG data exists
	if (!parentData.coordinatesKYNG?.length) {
		throw error(403, 'KYNG coordinator access required');
	}

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
		...parentData,
		kyngMessages: kyngMessagesData || []
	};
};
