import { error, redirect, type Actions } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { PropertyProfileData } from '$lib/db.types';

let propertyProfileData: PropertyProfileData;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const pid = formData.get('property_key') as string;
		const body = getFormData(
			formData,
			session.user.id,
			session.user.app_metadata.principaladdresssiteoid
		);
		const { data: myPlaceAssets, error: myPlaceAssetsError } = await supabase
			.from('property_profile')
			.update({
				number_dogs: body.propertyProfileData.number_dogs,
				number_cats: body.propertyProfileData.number_cats,
				number_birds: body.propertyProfileData.number_birds,
				number_other_pets: body.propertyProfileData.number_other_pets,
				live_stock_present: body.propertyProfileData.live_stock_present,
				live_stock_safe_area: body.propertyProfileData.live_stock_safe_area,
				share_livestock_safe_area: body.propertyProfileData.share_livestock_safe_area,
				other_essential_assets: body.propertyProfileData.other_essential_assets
			})
			.eq('id', pid)
			.select();
		if (myPlaceAssetsError) {
			console.log('error profileMyPlaceAssets update property_profile: ', myPlaceAssetsError);
			throw error(
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
		throw error(400, 'Could not POST Profile MyPlace Assets data');
	}
};
