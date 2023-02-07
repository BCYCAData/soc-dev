import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: myCommunityInformationData, error: myCommunityInformationError } =
		await locals.dbClient
			.from('user_bcyca_profile')
			.select('information_sheet_choices,other_information_sheet')
			.eq('user_id', locals.session.user.id);
	if (myCommunityInformationError) {
		console.log('error myCommunityInformation:', myCommunityInformationError);
		throw error(400, `get myCommunity Information Error ${myCommunityInformationError.message}`);
	}
	if (myCommunityInformationData.length === 1) {
		const myCommunityInformation = myCommunityInformationData[0];
		if (null == myCommunityInformation.information_sheet_choices) {
			myCommunityInformation.information_sheet_choices = [];
		}
		return {
			myCommunityInformationData: myCommunityInformation
		};
	}
	throw error(400, 'Something went wrong retrieving the Profile My Community Information data.');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const { data: myCommunityInformationData, error: myCommunityInformationError } =
			await locals.dbClient
				.from('user_bcyca_profile')
				.update({
					information_sheet_choices: formData.getAll('information_sheet_choices'),
					other_information_sheet: formData.get('other_information_sheet')
				})
				.eq('user_id', locals.session.user.id)
				.select();
		if (myCommunityInformationError) {
			console.log('update error profile myCommunityInformation:', myCommunityInformationError);
			throw error(
				400,
				`save Profile MyCommunity Information data Error ${myCommunityInformationError.message}`
			);
		}
		if (myCommunityInformationData.length === 1) {
			const profileInformation = myCommunityInformationData[0];
			return {
				user: locals.session.user,
				profileMyCommunityInformation: profileInformation
			};
		}
		throw error(400, 'Could not POST Profile MyCommunity Information data');
	}
};
