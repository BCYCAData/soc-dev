import { type Actions } from '@sveltejs/kit';
import { getMyPlaceAssetsFormData } from '$lib/server/form.utilities';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const pid = formData.get('property_key') as string;
		const profileMyPlaceAssetsFormData = getMyPlaceAssetsFormData(formData);
		const { error: myPlaceAssetsError } = await supabase
			.from('property_profile')
			.update({
				live_stock_present: profileMyPlaceAssetsFormData.live_stock_present,
				live_stock_safe_area: profileMyPlaceAssetsFormData.live_stock_safe_area,
				share_livestock_safe_area: profileMyPlaceAssetsFormData.share_livestock_safe_area,
				number_birds: profileMyPlaceAssetsFormData.number_birds,
				number_cats: profileMyPlaceAssetsFormData.number_cats,
				number_dogs: profileMyPlaceAssetsFormData.number_dogs,
				number_other_pets: profileMyPlaceAssetsFormData.number_other_pets,
				other_essential_assets: profileMyPlaceAssetsFormData.other_essential_assets
			})
			.eq('id', pid);
		if (myPlaceAssetsError) {
			console.log('error profileMyPlaceAssets update property_profile: ', myPlaceAssetsError);
			return {
				profileMyPlaceAssetsFormData,
				success: false,
				error: true,
				errorMessage: `${myPlaceAssetsError.message}`
			};
		}
		return { profileMyPlaceAssetsFormData, success: true, error: false, errorMessage: '' };
	}
};
