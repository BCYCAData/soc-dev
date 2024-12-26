import { type Actions } from '@sveltejs/kit';
import { getMyCommunityBCYCAFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const { user } = await getSessionAndUser();
		const formData = await request.formData();
		const hadUserPostalAddress = formData.get('had_user_postal_address') as string;
		const profileBCYCAMyCommunityBCYCAFormData = getMyCommunityBCYCAFormData(formData);
		const havePostalAddress =
			profileBCYCAMyCommunityBCYCAFormData.stay_in_touch_choices?.includes(5);
		const bcycaId = formData.get('community_bcyca_profile_id');
		if (bcycaId) {
			const { error: myCommunityBCYCAUserProfileError } = await supabase
				.from('community_bcyca_profile')
				.update({
					stay_in_touch_choices: profileBCYCAMyCommunityBCYCAFormData.stay_in_touch_choices,
					other_comments: profileBCYCAMyCommunityBCYCAFormData.other_comments
				})
				.eq('bcyca_profile_id', bcycaId);
			if (myCommunityBCYCAUserProfileError) {
				console.log(
					'error profileBCYCAMyCommunity update community_bcyca_profile: ',
					myCommunityBCYCAUserProfileError
				);
				return {
					profileBCYCAMyCommunityBCYCAFormData,
					success: false,
					error: true,
					errorMessage: `${myCommunityBCYCAUserProfileError.message}`
				};
			} else {
				if (hadUserPostalAddress === 'true' && havePostalAddress) {
					const { error: userPostalAddressUpdateError } = await supabase
						.from('user_postal_address')
						.update({
							postal_address_street:
								profileBCYCAMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileBCYCAMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileBCYCAMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_postcode
						})
						.eq('user_id', user.id);
					if (userPostalAddressUpdateError) {
						console.log(
							'error profileBCYCAMyCommunityupdateUserPostalAddress: ',
							userPostalAddressUpdateError
						);
						return {
							profileBCYCAMyCommunityBCYCAFormData,
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
							'error profileBCYCAMyCommunitydelete UserPostalAddress: ',
							userPostalAddressDeleteError
						);
						return {
							profileBCYCAMyCommunityBCYCAFormData,
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
								profileBCYCAMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileBCYCAMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileBCYCAMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_postcode
						});
					if (userPostalAddressUpsertError) {
						console.log(
							'error profileBCYCAMyCommunityupsertUserPostalAddress: ',
							userPostalAddressUpsertError
						);
						return {
							profileBCYCAMyCommunityBCYCAFormData,
							success: false,
							error: true,
							errorMessage: `${userPostalAddressUpsertError.message}`
						};
					}
				}
			}
			return {
				profileBCYCAMyCommunityBCYCAFormData,
				success: true,
				error: false,
				errorMessage: ''
			};
		}
	}
};
