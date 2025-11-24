import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getCommunityOptions, type CommunityRequestOption } from '$lib/profile-options';

const emptyOptionsData = {
	object_names: [] as { object_name: string; options: { value: string; lable: string }[] }[]
};

export const load: LayoutServerLoad = async ({ locals: { supabase, user } }) => {
	if (!user) {
		error(401, 'Unauthorized');
	}

	// Fetch user profile data
	const { data: userProfile, error: profileError } = await supabase.rpc('get_profile_for_user', {
		id_input: user.id
	});

	if (profileError) {
		console.error('Error fetching user profile:', profileError);
		error(500, 'Failed to load user profile');
	}

	// Fetch community request options
	const { data, error: requestError } = await supabase.from('community_request_options_lut')
		.select(`
                index_value,
                lable,
                community_request_options_concordance!public_community_request_options_lut_concordance_fkey (
                    table_name,
                    object_name,
                    field_name
                )
            `);

	if (requestError) {
		console.error('Failed to fetch community request options:', requestError);
		throw error(400, `Failed to fetch community request options: ${requestError.message}`);
	}
	const optionsDataArray = getCommunityOptions(data as CommunityRequestOption[]);
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
	const { data: profileMessages, error: profileMessagesError } = await supabase.rpc(
		'get_profile_messages_for_user',
		{ id_input: user.id }
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
		userProfile,
		profileMessages,
		hadUserPostalAddress,
		communityProfiles,
		optionsData
	};
};
