import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityExternalFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const hadUserPostalAddress = formData.get('had_user_postal_address') as string;
		const profileMyCommunityExternalFormData = getMyCommunityExternalFormData(formData);
		const havePostalAddress = profileMyCommunityExternalFormData.stay_in_touch_choices?.includes(5);
		const externalId = formData.get('community_external_profile_id');
		if (externalId) {
			const { error: myCommunityExternalUserProfileError } = await supabase
				.from('community_external_profile')
				.update({
					stay_in_touch_choices: profileMyCommunityExternalFormData.stay_in_touch_choices,
					other_comments: profileMyCommunityExternalFormData.other_comments
				})
				.eq('external_profile_id', externalId);
			if (myCommunityExternalUserProfileError) {
				console.log(
					'error profileMyCommunityExternal update community_external_profile: ',
					myCommunityExternalUserProfileError
				);
				error(
					400,
					`error profileMyCommunityExternal update user_profile: ${myCommunityExternalUserProfileError.message}`
				);
			} else {
				if (hadUserPostalAddress === 'true' && havePostalAddress) {
					console.log('Will update UserPostalAddress');
					const { error: userPostalAddressUpdateError } = await supabase
						.from('user_postal_address')
						.update({
							postal_address_street:
								profileMyCommunityExternalFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileMyCommunityExternalFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileMyCommunityExternalFormData.userPostalAddressData?.postal_address_postcode
						})
						.eq('user_id', user.id);
					if (userPostalAddressUpdateError) {
						console.log(
							'error profileMyCommunityExternal updateUserPostalAddress: ',
							userPostalAddressUpdateError
						);
						error(
							400,
							`error profileMyCommunityExternal update UserPostalAddress: ${userPostalAddressUpdateError.message}`
						);
					}
				} else if (hadUserPostalAddress === 'true' && !havePostalAddress) {
					const { error: userPostalAddressDeleteError } = await supabase
						.from('user_postal_address')
						.delete()
						.eq('user_id', user.id);
					if (userPostalAddressDeleteError) {
						console.log(
							'error profileMyCommunityExternal delete UserPostalAddress: ',
							userPostalAddressDeleteError
						);
						error(
							400,
							`error profileMyCommunityExternal delete UserPostalAddress ${userPostalAddressDeleteError.message}`
						);
					}
				} else if (hadUserPostalAddress === 'false' && havePostalAddress) {
					const { error: userPostalAddressUpsertError } = await supabase
						.from('user_postal_address')
						.upsert({
							user_id: user.id,
							postal_address_street:
								profileMyCommunityExternalFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileMyCommunityExternalFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileMyCommunityExternalFormData.userPostalAddressData?.postal_address_postcode
						});
					if (userPostalAddressUpsertError) {
						console.log(
							'error profileMyCommunityExternal upsertUserPostalAddress: ',
							userPostalAddressUpsertError
						);
						error(
							400,
							`error profileMyCommunityExternal upsertUserPostalAddress: ${userPostalAddressUpsertError.message}`
						);
					}
				}
			}
		}
		return {
			profileMyCommunityExternalFormData
		};
	}
};
