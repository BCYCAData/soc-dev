import { error, redirect, type Actions } from '@sveltejs/kit';
import { getBCYCACommunityWorkshopsFormData } from '$lib/server/form.utils';

import type { CommunityBCYCAProfileData } from '$lib/custom.types';

let userBCYCAData: CommunityBCYCAProfileData;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const body = getBCYCACommunityWorkshopsFormData(formData);
		const { data: myCommunityWorkshops, error: myCommunityWorkshopsError } = await supabase
			.from('community_bcyca_profile')
			.update({
				community_workshop_choices: body.community_workshop_choices,
				other_community_workshop: body.other_community_workshop,
				will_run_community_workshops: body.will_run_community_workshops
			})
			.eq('user_id', session.user.id)
			.select();
		if (myCommunityWorkshopsError) {
			console.log(
				'error profileMyCommunityWorkshops update community_bcyca_profile: ',
				myCommunityWorkshopsError
			);
			error(
				400,
				`error profileMyCommunityWorkshops update community_bcyca_profile: ${myCommunityWorkshopsError.message}`
			);
		}
		if (myCommunityWorkshops.length === 1) {
			userBCYCAData = myCommunityWorkshops[0];
			return {
				userBCYCAData
			};
		}
		error(400, 'Could not POST Profile MyCommunity Workshops data');
	}
};
