import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyPlaceAssetsFormData } from '$lib/server/form.utils';

import type { PropertyProfileData } from '$lib/custom.types';

let propertyProfileData: PropertyProfileData;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const pid = formData.get('property_key') as string;
		const body = getMyPlaceAssetsFormData(formData);
		const { data: myPlaceAssets, error: myPlaceAssetsError } = await supabase
			.from('property_profile')
			.update({
				live_stock_present: body.live_stock_present,
				live_stock_safe_area: body.live_stock_safe_area,
				share_livestock_safe_area: body.share_livestock_safe_area,
				number_birds: body.number_birds,
				number_cats: body.number_cats,
				number_dogs: body.number_dogs,
				number_other_pets: body.number_other_pets,
				other_essential_assets: body.other_essential_assets
			})
			.eq('id', pid)
			.select();
		if (myPlaceAssetsError) {
			console.log('error profileMyPlaceAssets update property_profile: ', myPlaceAssetsError);
			error(
				400,
				`error profileMyPlaceAssets update property_profile: ${myPlaceAssetsError.message}`
			);
		}
		if (myPlaceAssets.length === 1) {
			propertyProfileData = myPlaceAssets[0];
			return {
				propertyProfileData
			};
		}
		error(400, 'Could not POST Profile MyPlace Assets data');
	}
};
