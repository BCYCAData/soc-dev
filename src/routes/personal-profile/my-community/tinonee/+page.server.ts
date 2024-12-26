import {  type Actions } from '@sveltejs/kit';
import { getMyCommunityFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSessionAndUser } }) => {
		const { user } = await getSessionAndUser();
		const formData = await request.formData();
		const hadUserPostalAddress = formData.get('had_user_postal_address') as string;
		const profileTinoneeMyCommunityFormData = getMyCommunityFormData(formData);
		const havePostalAddress = profileTinoneeMyCommunityFormData.stay_in_touch_choices?.includes(5);
		const { error: myCommunityUserProfileError } = await supabase
			.from('user_profile')
			.update({
				stay_in_touch_choices: profileTinoneeMyCommunityFormData.stay_in_touch_choices,
				other_comments: profileTinoneeMyCommunityFormData.other_comments
			})
			.eq('id', user.id);
		if (myCommunityUserProfileError) {
			console.log('error profileMyCommunity update user_profile: ', myCommunityUserProfileError);
			return {
				profileTinoneeMyCommunityFormData,
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
							profileTinoneeMyCommunityFormData.userPostalAddressData?.postal_address_street,
						postal_address_suburb:
							profileTinoneeMyCommunityFormData.userPostalAddressData?.postal_address_suburb,
						postal_address_postcode:
							profileTinoneeMyCommunityFormData.userPostalAddressData?.postal_address_postcode
					})
					.eq('user_id', user.id);
				if (userPostalAddressUpdateError) {
					console.log(
						'error profileMyCommunity updateUserPostalAddress: ',
						userPostalAddressUpdateError
					);
					return {
						profileTinoneeMyCommunityFormData,
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
						profileTinoneeMyCommunityFormData,
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
							profileTinoneeMyCommunityFormData.userPostalAddressData?.postal_address_street,
						postal_address_suburb:
							profileTinoneeMyCommunityFormData.userPostalAddressData?.postal_address_suburb,
						postal_address_postcode:
							profileTinoneeMyCommunityFormData.userPostalAddressData?.postal_address_postcode
					});
				if (userPostalAddressUpsertError) {
					console.log(
						'error profileMyCommunity upsertUserPostalAddress: ',
						userPostalAddressUpsertError
					);
					return {
						profileTinoneeMyCommunityFormData,
						success: false,
						error: true,
						errorMessage: `${userPostalAddressUpsertError.message}`
					};
				}
			}
		}
		return {
			profileTinoneeMyCommunityFormData,
			success: true,
			error: false,
			errorMessage: ''
		};
	}
};
