import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: myPlaceAssetsData, error: myPlaceAssetsError } = await locals.dbClient
		.from('property_profile')
		.select(
			'id,number_dogs,number_cats,number_birds,number_other_pets,live_stock_present, live_stock_safe_area,share_livestock_safe_area,other_essential_assets, user_profile(id), temp_user:user_profile!inner(id)'
		)
		.in('temp_user.id', [locals.session?.user.id]);
	if (myPlaceAssetsError) {
		console.log('error profileAssets:', myPlaceAssetsError);
		throw error(400, `get myPlace Assets Error ${myPlaceAssetsError.message}`);
	}
	if (myPlaceAssetsData?.length === 1) {
		return {
			assetsData: myPlaceAssetsData[0]
		};
	}
	throw error(400, 'Something went wrong retrieving the My Place Assets data.');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const { data: myPlaceAssetsData, error: myPlaceAssetsError } = await locals.dbClient
			.from('property_profile')
			.update({
				number_dogs: parseInt(formData.get('number_dogs') as string) || 0,
				number_cats: parseInt(formData.get('number_cats') as string) || 0,
				number_birds: parseInt(formData.get('number_birds') as string) || 0,
				number_other_pets: parseInt(formData.get('number_other_pets') as string) || 0,
				live_stock_present: formData.get('live_stock_present'),
				live_stock_safe_area: formData.get('live_stock_safe_area'),
				share_livestock_safe_area: formData.get('share_livestock_safe_area'),
				other_essential_assets: formData.get('other_essential_assets')
			})
			.eq('id', formData.get('property_key'))
			.select();
		if (myPlaceAssetsError) {
			console.log('update error profileAssets:', myPlaceAssetsError);
			throw error(400, `save Profile MyPlace Assets data Error ${myPlaceAssetsError.message}`);
		}
		if (myPlaceAssetsData.length === 1) {
			const profileAssets = myPlaceAssetsData[0];
			return {
				user: locals.session.user,
				profileMyPlaceAssets: profileAssets
			};
		}
		throw error(400, 'Could not POST Profile MyPlace Assets data');
	}
};
