import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: myCommunityWorkshopsData, error: myCommunityWorkshopsError } = await locals.dbClient
		.from('user_bcyca_profile')
		.select('community_workshop_choices,other_community_workshop,will_run_community_workshops')
		.eq('user_id', locals.session.user.id);
	if (myCommunityWorkshopsError) {
		console.log('error myCommunityEvents:', myCommunityWorkshopsError);
		throw error(400, `get myCommunity Workshops Error ${myCommunityWorkshopsError.message}`);
	}
	if (myCommunityWorkshopsData.length === 1) {
		const profileWorkshops = myCommunityWorkshopsData[0];
		if (null == profileWorkshops.community_workshop_choices) {
			profileWorkshops.community_workshop_choices = [];
		}
		return {
			myCommunityWorkshopsData: profileWorkshops
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile My Community Workshops data.');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const { data: myCommunityWorkshopsData, error: myCommunityWorkshopsError } =
			await locals.dbClient
				.from('user_bcyca_profile')
				.update({
					community_workshop_choices: formData.getAll('community_workshop_choices'),
					other_community_workshop: formData.get('other_community_workshop'),
					will_run_community_workshops: formData.get('will_run_community_workshops')
				})
				.eq('user_id', locals.session.user.id)
				.select();
		if (myCommunityWorkshopsError) {
			console.log('update error profile myCommunityWorkshops:', myCommunityWorkshopsError);
			throw error(
				400,
				`save Profile MyCommunity Workshops data Error ${myCommunityWorkshopsError.message}`
			);
		}
		if (myCommunityWorkshopsData.length === 1) {
			const profileResources = myCommunityWorkshopsData[0];
			return {
				user: locals.session.user,
				profileMyCommunityWorkshops: profileResources
			};
		}
		throw error(400, 'Could not POST Profile MyCommunity Workshops data');
	}
};
