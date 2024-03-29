import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyPlaceAssetsFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
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
			error(
				400,
				`error profileMyPlaceAssets update property_profile: ${myPlaceAssetsError.message}`
			);
		}
		return { profileMyPlaceAssetsFormData };
	}
};
