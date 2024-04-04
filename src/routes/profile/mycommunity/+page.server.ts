import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
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
			.eq('id', session.user.id);
		if (myCommunityUserProfileError) {
			console.log('error profileMyCommunity update user_profile: ', myCommunityUserProfileError);
			error(
				400,
				`error profileMyCommunity update user_profile: ${myCommunityUserProfileError.message}`
			);
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
					.eq('user_id', session?.user.id);
				if (userPostalAddressUpdateError) {
					console.log(
						'error profileMyCommunity updateUserPostalAddress: ',
						userPostalAddressUpdateError
					);
					error(
						400,
						`error profileMyCommunity update UserPostalAddress: ${userPostalAddressUpdateError.message}`
					);
				}
			} else if (hadUserPostalAddress === 'true' && !havePostalAddress) {
				const { error: userPostalAddressDeleteError } = await supabase
					.from('user_postal_address')
					.delete()
					.eq('user_id', session?.user.id);
				if (userPostalAddressDeleteError) {
					console.log(
						'error profileMyCommunity delete UserPostalAddress: ',
						userPostalAddressDeleteError
					);
					error(
						400,
						`error profileMyCommunity delete UserPostalAddress ${userPostalAddressDeleteError.message}`
					);
				}
			} else if (hadUserPostalAddress === 'false' && havePostalAddress) {
				const { error: userPostalAddressUpsertError } = await supabase
					.from('user_postal_address')
					.upsert({
						user_id: session?.user.id,
						postal_address_street:
							profileMyCommunityFormData.userPostalAddressData?.postal_address_street,
						postal_address_suburb:
							profileMyCommunityFormData.userPostalAddressData?.postal_address_suburb,
						postal_address_postcode:
							profileMyCommunityFormData.userPostalAddressData?.postal_address_postcode
					});
				if (userPostalAddressUpsertError) {
					console.log(
						'error profileMyCommunity upsertUserPostalAddress: ',
						userPostalAddressUpsertError
					);
					error(
						400,
						`error profileMyCommunity upsertUserPostalAddress: ${userPostalAddressUpsertError.message}`
					);
				}
			}
		}
		return {
			profileMyCommunityFormData
		};
	}
};
