import { error, redirect, type Actions } from '@sveltejs/kit';
import { getMyCommunityMondrookInformationFormData } from '$lib/server/form.utils';

export const actions: Actions = {
	default: async ({ request, locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session?.user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const myCommunityMondrookInformationFormData =
			getMyCommunityMondrookInformationFormData(formData);
		const mondrookId = formData.get('community_mondrook_profile_id');
		if (mondrookId) {
			const { error: myCommunityMondrookInformationError } = await supabase
				.from('community_mondrook_profile')
				.update({
					information_sheet_choices:
						myCommunityMondrookInformationFormData.information_sheet_choices,
					other_information_sheet: myCommunityMondrookInformationFormData.other_information_sheet
				})
				.eq('mondrook_profile_id', mondrookId);
			if (myCommunityMondrookInformationError) {
				console.log(
					'error profileMyCommunityMondrookInformation update community_mondrook_profile: ',
					myCommunityMondrookInformationError
				);
				error(
					400,
					`error profileMyCommunityMondrookInformation update community_mondrook_profile: ${myCommunityMondrookInformationError.message}`
				);
			}
		}
		return { myCommunityMondrookInformationFormData };
	}
};
