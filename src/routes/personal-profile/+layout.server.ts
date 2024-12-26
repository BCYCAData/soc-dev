import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const emptyOptionsData = {
	object_names: [] as { object_name: string; options: { value: string; lable: string }[] }[]
};

export const load: LayoutServerLoad = async ({
	locals: { supabase, getSessionAndUser, getCommunityRequestOptions }
}) => {
	const { user, session, userRoles, coordinatesKYNG, propertyIds, userProfile } =
		await getSessionAndUser();

	const { data: profileMessages, error: profileMessagesError } = await supabase.rpc(
		'get_profile_messages_for_user',
		{ id_input: user.id }
	);

	if (profileMessagesError) {
		console.log('error get Profile Messages for User:', profileMessagesError);
		error(400, profileMessagesError.message);
	}

	const { userOptionsData } = await getCommunityRequestOptions();

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
			userOptionsData: userOptionsData ?? emptyOptionsData,
			communityBCYCAOptionsData: emptyOptionsData,
			communityExternalOptionsData: emptyOptionsData,
			communityTinoneeOptionsData: emptyOptionsData,
			communityMondrookOptionsData: emptyOptionsData
		}
	};
};
