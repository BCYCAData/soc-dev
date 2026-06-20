import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getCommunityRequestOptions } from '$lib/server/community-options';

const emptyOptionsData = {
	object_names: [] as { object_name: string; options: { value: string; lable: string }[] }[]
};

export const load: LayoutServerLoad = async ({ parent, locals }) => {
	const parentData = await parent();

	// Parent layout already validated user
	// Load user-specific profile data
	const { data: userProfile, error: profileError } = await locals.supabase.rpc(
		'get_profile_for_user',
		{
			id_input: parentData.user.id
		}
	);

	if (profileError) {
		console.error('Error fetching user profile:', profileError);
		throw error(500, 'Failed to load user profile');
	}
	// Fetch community request options
	const optionsDataArray = await getCommunityRequestOptions(locals.supabase);
	const optionsData = {
		userOptionsData:
			optionsDataArray.find((item) => item.table_name === 'user_profile') ?? emptyOptionsData,
		communityBCYCAOptionsData:
			optionsDataArray.find((item) => item.table_name === 'community_bcyca_profile') ??
			emptyOptionsData,
		communityExternalOptionsData:
			optionsDataArray.find((item) => item.table_name === 'community_external_profile') ??
			emptyOptionsData,
		communityTinoneeOptionsData:
			optionsDataArray.find((item) => item.table_name === 'community_tinonee_profile') ??
			emptyOptionsData,
		communityMondrookOptionsData:
			optionsDataArray.find((item) => item.table_name === 'community_mondrook_profile') ??
			emptyOptionsData
	};

	// Fetch profile messages
	const { data: profileMessages, error: profileMessagesError } = await locals.supabase.rpc(
		'get_profile_messages_for_user',
		{ id_input: parentData.user.id }
	);

	if (profileMessagesError) {
		console.error('Error fetching profile messages:', profileMessagesError);
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
		...parentData,
		userProfile,
		profileMessages,
		hadUserPostalAddress,
		communityProfiles,
		optionsData
	};
};
