import { error } from '@sveltejs/kit';
import { setLoading } from '$stores/loading';

import type { LayoutServerLoad } from './$types';

const emptyOptionsData = {
	object_names: [] as { object_name: string; options: { value: string; lable: string }[] }[]
};

export const load: LayoutServerLoad = async ({
	locals: { supabase, getSessionAndUser, getCommunityRequestOptions }
}) => {
	const { user, session, userRoles, coordinatesKYNG, propertyIds, userProfile } =
		await getSessionAndUser();

	const optionsDataArray = await getCommunityRequestOptions();

	// Transform array into object structure
	const optionsData = optionsDataArray.reduce(
		(acc, item) => {
			if (item.table_name === 'user_profile') {
				acc.userOptionsData = item;
			} else if (item.table_name === 'community_bcyca_profile') {
				acc.communityBCYCAOptionsData = item;
			} else if (item.table_name === 'community_external_profile') {
				acc.communityExternalOptionsData = item;
			} else if (item.table_name === 'community_tinonee_profile') {
				acc.communityTinoneeOptionsData = item;
			} else if (item.table_name === 'community_mondrook_profile') {
				acc.communityMondrookOptionsData = item;
			}
			return acc;
		},
		{} as Record<string, any>
	);
	const { data: profileMessages, error: profileMessagesError } = await supabase.rpc(
		'get_profile_messages_for_user',
		{ id_input: user.id }
	);
	setLoading(false);
	if (profileMessagesError) {
		console.log('error get Profile Messages for User:', profileMessagesError);
		error(400, profileMessagesError.message);
	}

	const hadUserPostalAddress = userProfile?.had_user_postal_address || false;
	const communityProfiles: Record<string, string | null> = {
		community_bcyca_profile_id: userProfile?.community_bcyca_profile?.bcyca_profile_id || null,
		community_tinonee_profile_id:
			userProfile?.community_tinonee_profile?.tinonee_profile_id || null,
		community_mondrook_profile_id:
			userProfile?.community_mondrook_profile?.mondrook_profile_id || null,
		community_external_profile_id:
			userProfile?.community_external_profile?.external_profile_id || null
	};

	return {
		session,
		user,
		userRoles,
		coordinatesKYNG,
		propertyIds,
		userProfile,
		profileMessages,
		hadUserPostalAddress,
		communityProfiles,
		optionsData: {
			userOptionsData: optionsData.userOptionsData ?? emptyOptionsData,
			communityBCYCAOptionsData: optionsData.communityBCYCAOptionsData ?? emptyOptionsData,
			communityExternalOptionsData: optionsData.communityExternalOptionsData ?? emptyOptionsData,
			communityTinoneeOptionsData: optionsData.communityTinoneeOptionsData ?? emptyOptionsData,
			communityMondrookOptionsData: optionsData.communityMondrookOptionsData ?? emptyOptionsData
		}
	};
};
