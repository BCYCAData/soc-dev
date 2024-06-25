import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityTinoneeFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const hadUserPostalAddress = formData.get('had_user_postal_address') as string;
		const profileMyCommunityTinoneeFormData = getMyCommunityTinoneeFormData(formData);
		const havePostalAddress = profileMyCommunityTinoneeFormData.stay_in_touch_choices?.includes(5);
		const tinoneeId = formData.get('community_tinonee_profile_id');
		if (tinoneeId) {
			const { error: myCommunityTinoneeUserProfileError } = await supabase
				.from('community_tinonee_profile')
				.update({
					stay_in_touch_choices: profileMyCommunityTinoneeFormData.stay_in_touch_choices,
					other_comments: profileMyCommunityTinoneeFormData.other_comments
				})
				.eq('tinonee_profile_id', tinoneeId);
			if (myCommunityTinoneeUserProfileError) {
				console.log(
					'error profileMyCommunityTinonee update community_tinonee_profile: ',
					myCommunityTinoneeUserProfileError
				);
				error(
					400,
					`error profileMyCommunityTinonee update user_profile: ${myCommunityTinoneeUserProfileError.message}`
				);
			} else {
				if (hadUserPostalAddress === 'true' && havePostalAddress) {
					const { error: userPostalAddressUpdateError } = await supabase
						.from('user_postal_address')
						.update({
							postal_address_street:
								profileMyCommunityTinoneeFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileMyCommunityTinoneeFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileMyCommunityTinoneeFormData.userPostalAddressData?.postal_address_postcode
						})
						.eq('user_id', user.id);
					if (userPostalAddressUpdateError) {
						console.log(
							'error profileMyCommunityTinonee updateUserPostalAddress: ',
							userPostalAddressUpdateError
						);
						error(
							400,
							`error profileMyCommunityTinonee update UserPostalAddress: ${userPostalAddressUpdateError.message}`
						);
					}
				} else if (hadUserPostalAddress === 'true' && !havePostalAddress) {
					const { error: userPostalAddressDeleteError } = await supabase
						.from('user_postal_address')
						.delete()
						.eq('user_id', user.id);
					if (userPostalAddressDeleteError) {
						console.log(
							'error profileMyCommunityTinonee delete UserPostalAddress: ',
							userPostalAddressDeleteError
						);
						error(
							400,
							`error profileMyCommunityTinonee delete UserPostalAddress ${userPostalAddressDeleteError.message}`
						);
					}
				} else if (hadUserPostalAddress === 'false' && havePostalAddress) {
					const { error: userPostalAddressUpsertError } = await supabase
						.from('user_postal_address')
						.upsert({
							user_id: user.id,
							postal_address_street:
								profileMyCommunityTinoneeFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileMyCommunityTinoneeFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileMyCommunityTinoneeFormData.userPostalAddressData?.postal_address_postcode
						});
					if (userPostalAddressUpsertError) {
						console.log(
							'error profileMyCommunityTinonee upsertUserPostalAddress: ',
							userPostalAddressUpsertError
						);
						error(
							400,
							`error profileMyCommunityTinonee upsertUserPostalAddress: ${userPostalAddressUpsertError.message}`
						);
					}
				}
			}
		}
		return {
			profileMyCommunityTinoneeFormData
		};
	}
};
