import { type Actions } from '@sveltejs/kit';
import { getMyCommunityExternalFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const { user } = await getSessionAndUser();
		const formData = await request.formData();
		const hadUserPostalAddress = formData.get('had_user_postal_address') as string;
		const profileExternalMyCommunityFormData = getMyCommunityExternalFormData(formData);
		const havePostalAddress = profileExternalMyCommunityFormData.stay_in_touch_choices?.includes(5);
		const externalId = formData.get('community_external_profile_id');
		if (externalId) {
			const { error: myCommunityExternalUserProfileError } = await supabase
				.from('community_external_profile')
				.update({
					stay_in_touch_choices: profileExternalMyCommunityFormData.stay_in_touch_choices,
					other_comments: profileExternalMyCommunityFormData.other_comments
				})
				.eq('external_profile_id', externalId);
			if (myCommunityExternalUserProfileError) {
				console.log(
					'error profileExtenalMyCommunity update community_external_profile: ',
					myCommunityExternalUserProfileError
				);
				return {
					profileExternalMyCommunityFormData,
					success: false,
					error: true,
					errorMessage: `${myCommunityExternalUserProfileError.message}`
				};
			} else {
				if (hadUserPostalAddress === 'true' && havePostalAddress) {
					console.log('Will update UserPostalAddress');
					const { error: userPostalAddressUpdateError } = await supabase
						.from('user_postal_address')
						.update({
							postal_address_street:
								profileExternalMyCommunityFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileExternalMyCommunityFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileExternalMyCommunityFormData.userPostalAddressData?.postal_address_postcode
						})
						.eq('user_id', user.id);
					if (userPostalAddressUpdateError) {
						console.log(
							'error profileExtenalMyCommunity updateUserPostalAddress: ',
							userPostalAddressUpdateError
						);
						return {
							profileExternalMyCommunityFormData,
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
						console.log(
							'error profileExtenalMyCommunity delete UserPostalAddress: ',
							userPostalAddressDeleteError
						);
						return {
							profileExternalMyCommunityFormData,
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
								profileExternalMyCommunityFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileExternalMyCommunityFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileExternalMyCommunityFormData.userPostalAddressData?.postal_address_postcode
						});
					if (userPostalAddressUpsertError) {
						console.log(
							'error profileExtenalMyCommunity upsertUserPostalAddress: ',
							userPostalAddressUpsertError
						);
						return {
							profileExternalMyCommunityFormData,
							success: false,
							error: true,
							errorMessage: `${userPostalAddressUpsertError.message}`
						};
					}
				}
			}
		}
		return {
			profileExternalMyCommunityFormData,
			success: true,
			error: false,
			errorMessage: ''
		};
	}
};
