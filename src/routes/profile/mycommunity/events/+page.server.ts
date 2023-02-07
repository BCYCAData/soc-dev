import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: myCommunityEventsData, error: myCommunityEventsError } = await locals.dbClient
		.from('user_bcyca_profile')
		.select('community_meeting_choices,other_community_meeting')
		.eq('user_id', locals.session.user.id);
	if (myCommunityEventsError) {
		console.log('error myCommunityEvents:', myCommunityEventsError);
		throw error(400, `get myCommunity Events Error ${myCommunityEventsError.message}`);
	}
	if (myCommunityEventsData.length === 1) {
		const profileEvents = myCommunityEventsData[0];
		if (null == profileEvents.community_meeting_choices) {
			profileEvents.community_meeting_choices = [];
		}
		return {
			myCommunityEventsData: profileEvents
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile My Community Events data.');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const { data: myCommunityEventsData, error: myCommunityEventsError } = await locals.dbClient
			.from('user_bcyca_profile')
			.update({
				community_meeting_choices: formData.getAll('community_meeting_choices'),
				other_community_meeting: formData.get('other_community_meeting')
			})
			.eq('user_id', locals.session.user.id)
			.select();
		if (myCommunityEventsError) {
			console.log('update error profile myCommunityEvents:', myCommunityEventsError);
			throw error(
				400,
				`save Profile MyCommunity Events data Error ${myCommunityEventsError.message}`
			);
		}
		if (myCommunityEventsData.length === 1) {
			const profileResources = myCommunityEventsData[0];
			return {
				user: locals.session.user,
				profileMyCommunityEvents: profileResources
			};
		}
		throw error(400, 'Could not POST Profile MyCommunity Events data');
	}
};
