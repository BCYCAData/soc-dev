import { type Actions } from '@sveltejs/kit';
import { getMyCommunityFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, user } }) => {
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
			console.log('error profileMyCommunity update user_profile: ', myCommunityUserProfileError);
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
					console.log(
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
					console.log(
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
					console.log(
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
	}
};
