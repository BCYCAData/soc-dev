import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityMondrookFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getUser } }) => {
		const { user } = await getUser();
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const hadUserPostalAddress = formData.get('had_user_postal_address') as string;
		const profileMyCommunityMondrookFormData = getMyCommunityMondrookFormData(formData);
		const havePostalAddress = profileMyCommunityMondrookFormData.stay_in_touch_choices?.includes(5);
		const mondrookId = formData.get('community_mondrook_profile_id');
		if (mondrookId) {
			const { error: myCommunityMondrookUserProfileError } = await supabase
				.from('community_mondrook_profile')
				.update({
					stay_in_touch_choices: profileMyCommunityMondrookFormData.stay_in_touch_choices,
					other_comments: profileMyCommunityMondrookFormData.other_comments
				})
				.eq('mondrook_profile_id', mondrookId);
			if (myCommunityMondrookUserProfileError) {
				console.log(
					'error profileMyCommunityMondrook update community_mondrook_profile: ',
					myCommunityMondrookUserProfileError
				);
				error(
					400,
					`error profileMyCommunityMondrookupdate user_profile: ${myCommunityMondrookUserProfileError.message}`
				);
			} else {
				if (hadUserPostalAddress === 'true' && havePostalAddress) {
					const { error: userPostalAddressUpdateError } = await supabase
						.from('user_postal_address')
						.update({
							postal_address_street:
								profileMyCommunityMondrookFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileMyCommunityMondrookFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileMyCommunityMondrookFormData.userPostalAddressData?.postal_address_postcode
						})
						.eq('user_id', user.id);
					if (userPostalAddressUpdateError) {
						console.log(
							'error profileMyCommunityMondrookupdateUserPostalAddress: ',
							userPostalAddressUpdateError
						);
						error(
							400,
							`error profileMyCommunityMondrookupdate UserPostalAddress: ${userPostalAddressUpdateError.message}`
						);
					}
				} else if (hadUserPostalAddress === 'true' && !havePostalAddress) {
					const { error: userPostalAddressDeleteError } = await supabase
						.from('user_postal_address')
						.delete()
						.eq('user_id', user.id);
					if (userPostalAddressDeleteError) {
						console.log(
							'error profileMyCommunityMondrookdelete UserPostalAddress: ',
							userPostalAddressDeleteError
						);
						error(
							400,
							`error profileMyCommunityMondrookdelete UserPostalAddress ${userPostalAddressDeleteError.message}`
						);
					}
				} else if (hadUserPostalAddress === 'false' && havePostalAddress) {
					const { error: userPostalAddressUpsertError } = await supabase
						.from('user_postal_address')
						.upsert({
							user_id: user.id,
							postal_address_street:
								profileMyCommunityMondrookFormData.userPostalAddressData?.postal_address_street,
							postal_address_suburb:
								profileMyCommunityMondrookFormData.userPostalAddressData?.postal_address_suburb,
							postal_address_postcode:
								profileMyCommunityMondrookFormData.userPostalAddressData?.postal_address_postcode
						});
					if (userPostalAddressUpsertError) {
						console.log(
							'error profileMyCommunityMondrookupsertUserPostalAddress: ',
							userPostalAddressUpsertError
						);
						error(
							400,
							`error profileMyCommunityMondrookupsertUserPostalAddress: ${userPostalAddressUpsertError.message}`
						);
					}
				}
			}
		}
		return {
			profileMyCommunityMondrookFormData
		};
	}
};
