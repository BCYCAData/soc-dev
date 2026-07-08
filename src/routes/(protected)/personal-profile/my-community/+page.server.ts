import { type Actions } from '@sveltejs/kit';
import { getMyCommunityFormData } from '$lib/server/form.utilities';

import type { PageServerLoad } from './$types';

const COMMUNITY_SLUGS = ['bcyca', 'external', 'mondrook', 'tinonee'] as const;

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const {
		data: { user }
	} = await supabase.auth.getUser();

	// RLS limits this to the caller's own rows (user_read_own_requests).
	const { data: accessRequests, error: accessRequestsError } = await supabase
		.from('community_access_requests')
		.select('requested_community_id, status, community_areas(community)')
		.eq('user_id', user?.id ?? '');

	if (accessRequestsError) {
		console.error('error getting community access requests:', accessRequestsError);
	}

	// Slug → request status for the connect buttons (latest request wins).
	const requestStatusByCommunity: Record<string, string> = {};
	for (const request of accessRequests ?? []) {
		const slug = request.community_areas?.community?.toLowerCase();
		if (slug) requestStatusByCommunity[slug] = request.status;
	}

	return { requestStatusByCommunity };
};

export const actions: Actions = {
	save: async ({ request, locals: { supabase } }) => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: true, errorMessage: 'Authentication required' };
		}
		const formData = await request.formData();
		const hadUserPostalAddress = formData.get('had_user_postal_address') as string;
		const profileMyCommunityFormData = getMyCommunityFormData(formData);
		const havePostalAddress = profileMyCommunityFormData.stay_in_touch_choices?.includes(5);
		const { error: myCommunityUserProfileError } = await supabase
			.from('user_profile')
			.update({
				stay_in_touch_choices: profileMyCommunityFormData.stay_in_touch_choices,
				other_comments: profileMyCommunityFormData.other_comments
			})
			.eq('id', user.id);
		if (myCommunityUserProfileError) {
			console.error('error profileMyCommunity update user_profile: ', myCommunityUserProfileError);
			return {
				profileMyCommunityFormData,
				success: false,
				error: true,
				errorMessage: `${myCommunityUserProfileError.message}`
			};
		} else {
			if (hadUserPostalAddress === 'true' && havePostalAddress) {
				const { error: userPostalAddressUpdateError } = await supabase
					.from('user_postal_address')
					.update({
						postal_address_street:
							profileMyCommunityFormData.userPostalAddressData?.postal_address_street,
						postal_address_suburb:
							profileMyCommunityFormData.userPostalAddressData?.postal_address_suburb,
						postal_address_postcode:
							profileMyCommunityFormData.userPostalAddressData?.postal_address_postcode
					})
					.eq('user_id', user.id);
				if (userPostalAddressUpdateError) {
					console.error(
						'error profileMyCommunity updateUserPostalAddress: ',
						userPostalAddressUpdateError
					);
					return {
						profileMyCommunityFormData,
						success: false,
						error: true,
						errorMessage: `${userPostalAddressUpdateError.message}`
					};
				}
			} else if (hadUserPostalAddress === 'true' && !havePostalAddress) {
				const { error: userPostalAddressDeleteError } = await supabase
					.from('user_postal_address')
					.delete()
					.eq('user_id', user.id);
				if (userPostalAddressDeleteError) {
					console.error(
						'error profileMyCommunity delete UserPostalAddress: ',
						userPostalAddressDeleteError
					);
					return {
						profileMyCommunityFormData,
						success: false,
						error: true,
						errorMessage: `${userPostalAddressDeleteError.message}`
					};
				}
			} else if (hadUserPostalAddress === 'false' && havePostalAddress) {
				const { error: userPostalAddressUpsertError } = await supabase
					.from('user_postal_address')
					.upsert({
						user_id: user.id,
						postal_address_street:
							profileMyCommunityFormData.userPostalAddressData?.postal_address_street,
						postal_address_suburb:
							profileMyCommunityFormData.userPostalAddressData?.postal_address_suburb,
						postal_address_postcode:
							profileMyCommunityFormData.userPostalAddressData?.postal_address_postcode
					});
				if (userPostalAddressUpsertError) {
					console.error(
						'error profileMyCommunity upsertUserPostalAddress: ',
						userPostalAddressUpsertError
					);
					return {
						profileMyCommunityFormData,
						success: false,
						error: true,
						errorMessage: `${userPostalAddressUpsertError.message}`
					};
				}
			}
		}
		return {
			profileMyCommunityFormData,
			success: true,
			error: false,
			errorMessage: ''
		};
	},

	requestAccess: async ({ request, locals: { supabase } }) => {
		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return { success: false, error: true, errorMessage: 'Authentication required' };
		}

		const formData = await request.formData();
		const community = (formData.get('community') as string | null)?.toLowerCase() ?? '';
		if (!(COMMUNITY_SLUGS as readonly string[]).includes(community)) {
			return { success: false, error: true, errorMessage: 'Unknown community' };
		}

		const { data: area, error: areaError } = await supabase
			.from('community_areas')
			.select('id, community')
			.ilike('community', community)
			.single();
		if (areaError || !area) {
			console.error('error resolving community area:', areaError);
			return { success: false, error: true, errorMessage: 'Could not find that community' };
		}

		const { data: existing } = await supabase
			.from('community_access_requests')
			.select('id, status')
			.eq('user_id', user.id)
			.eq('requested_community_id', area.id)
			.eq('status', 'pending')
			.maybeSingle();
		if (existing) {
			return {
				success: false,
				error: true,
				errorMessage: `You already have a pending request for the ${area.community} community.`
			};
		}

		const { error: insertError } = await supabase
			.from('community_access_requests')
			.insert({ user_id: user.id, requested_community_id: area.id });
		if (insertError) {
			console.error('error creating community access request:', insertError);
			return {
				success: false,
				error: true,
				errorMessage: 'Your request could not be sent. Please try again.'
			};
		}

		return {
			success: true,
			error: false,
			errorMessage: '',
			requestedCommunity: area.community
		};
	}
};
