import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityBCYCAFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const hadUserPostalAddress = formData.get('had_user_postal_address') as string;
		const profileMyCommunityBCYCAFormData = getMyCommunityBCYCAFormData(formData);
		const havePostalAddress = profileMyCommunityBCYCAFormData.stay_in_touch_choices?.includes(5);
		const bcycaId = formData.get('community_bcyca_profile_id');
		if (bcycaId) {
			const { error: myCommunityBCYCAUserProfileError } = await supabase
				.from('community_bcyca_profile')
				.update({
					stay_in_touch_choices: profileMyCommunityBCYCAFormData.stay_in_touch_choices,
					other_comments: profileMyCommunityBCYCAFormData.other_comments
				})
				.eq('bcyca_profile_id', bcycaId);
			if (myCommunityBCYCAUserProfileError) {
				console.log(
					'error profileMyCommunityBCYCA update community_bcyca_profile: ',
					myCommunityBCYCAUserProfileError
				);
				error(
					400,
					`error profileMyCommunityBCYCAupdate user_profile: ${myCommunityBCYCAUserProfileError.message}`
				);
			} else {
				if (hadUserPostalAddress === 'true' && havePostalAddress) {
					const { error: userPostalAddressUpdateError } = await supabase
						.from('user_postal_address')
						.update({
							postal_address_street:
								profileMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_postcode
						})
						.eq('user_id', session?.user.id);
					if (userPostalAddressUpdateError) {
						console.log(
							'error profileMyCommunityBCYCAupdateUserPostalAddress: ',
							userPostalAddressUpdateError
						);
						error(
							400,
							`error profileMyCommunityBCYCAupdate UserPostalAddress: ${userPostalAddressUpdateError.message}`
						);
					}
				} else if (hadUserPostalAddress === 'true' && !havePostalAddress) {
					const { error: userPostalAddressDeleteError } = await supabase
						.from('user_postal_address')
						.delete()
						.eq('user_id', session?.user.id);
					if (userPostalAddressDeleteError) {
						console.log(
							'error profileMyCommunityBCYCAdelete UserPostalAddress: ',
							userPostalAddressDeleteError
						);
						error(
							400,
							`error profileMyCommunityBCYCAdelete UserPostalAddress ${userPostalAddressDeleteError.message}`
						);
					}
				} else if (hadUserPostalAddress === 'false' && havePostalAddress) {
					const { error: userPostalAddressUpsertError } = await supabase
						.from('user_postal_address')
						.upsert({
							user_id: session?.user.id,
							postal_address_street:
								profileMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileMyCommunityBCYCAFormData.userPostalAddressData?.postal_address_postcode
						});
					if (userPostalAddressUpsertError) {
						console.log(
							'error profileMyCommunityBCYCAupsertUserPostalAddress: ',
							userPostalAddressUpsertError
						);
						error(
							400,
							`error profileMyCommunityBCYCAupsertUserPostalAddress: ${userPostalAddressUpsertError.message}`
						);
					}
				}
			}
		}
		return {
			profileMyCommunityBCYCAFormData
		};
	}
};
