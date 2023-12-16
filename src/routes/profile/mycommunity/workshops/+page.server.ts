import { error, redirect, type Actions } from '@sveltejs/kit';
import { getFormData } from '$lib/utils';

import type { UserBCYCAProfileData } from '$lib/custom.types';

let userBCYCAData: UserBCYCAProfileData;

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const body = getFormData(
			formData,
			session.user.id,
			session.user.app_metadata.principaladdresssiteoid
		);
		const { data: myCommunityWorkshops, error: myCommunityWorkshopsError } = await supabase
			.from('user_bcyca_profile')
			.update({
				community_workshop_choices: body.userBCYCAProfileData.community_workshop_choices,
				other_community_workshop: body.userBCYCAProfileData.other_community_workshop,
				will_run_community_workshops: body.userBCYCAProfileData.will_run_community_workshops
			})
			.eq('user_id', session.user.id)
			.select();
		if (myCommunityWorkshopsError) {
			console.log(
				'error profileMyCommunityWorkshops update user_bcyca_profile: ',
				myCommunityWorkshopsError
			);
			error(
            				400,
            				`error profileMyCommunityWorkshops update user_bcyca_profile: ${myCommunityWorkshopsError.message}`
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
