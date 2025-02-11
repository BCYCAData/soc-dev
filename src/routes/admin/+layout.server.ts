import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({
	locals: { supabase, getSessionAndUser },
	parent
}) => {
	const parentData = await parent();

	const { data: adminMessagesData, error: adminMessagesError } = await supabase.rpc(
		'get_admin_messages_for_user',
		{
			id_input: (await getSessionAndUser()).user?.id
		}
	);

	if (adminMessagesError) {
		console.error('Error getting admin messages:', adminMessagesError);
		throw error(400, adminMessagesError.message);
	}

	return {
		adminMessages: adminMessagesData || [],
		session: parentData.session,
		user: parentData.user,
		userRoles: null,
		permissions: parentData.permissions,
		coordinatesKYNG: parentData.coordinatesKYNG,
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
