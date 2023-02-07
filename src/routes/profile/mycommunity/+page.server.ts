import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: userProfileData, error: userProfileError } = await locals.dbClient
		.from('user_profile')
		.select(
			'stay_in_touch_choices,postal_address_street,postal_address_suburb,postal_address_postcode,other_comments'
		)
		.eq('id', locals.session?.user.id);
	if (userProfileError) {
		console.log('error profileCommunity:', userProfileError);
		throw error(400, `get myCommunity Error ${userProfileError.message}`);
	}
	if (userProfileData.length === 1) {
		const myCommunityData = userProfileData[0];
		if (null == myCommunityData.stay_in_touch_choices) {
			myCommunityData.stay_in_touch_choices = [];
		}
		return {
			myCommunityData: myCommunityData
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile My Place Community data.');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const { data: myCommunityData, error: myCommunityError } = await locals.dbClient
			.from('user_profile')
			.update({
				stay_in_touch_choices: formData.getAll('stay_in_touch_choices'),
				postal_address_street: formData.get('postal_address_street'),
				postal_address_suburb: formData.get('postal_address_suburb'),
				postal_address_postcode: formData.get('postal_address_postcode'),
				other_comments: formData.get('other_comments')
			})
			.eq('id', locals.session.user.id)
			.select();
		if (myCommunityError) {
			console.log('update error profile myCommunity:', myCommunityError);
			throw error(400, `save Profile MyCommunity data Error ${myCommunityError.message}`);
		}
		if (myCommunityData.length === 1) {
			const profileResources = myCommunityData[0];
			return {
				user: locals.session.user,
				profileMyCommunity: profileResources
			};
		}
		throw error(400, 'Could not POST Profile MyCommunity data');
	}
};
