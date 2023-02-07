import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

let agentData: any[];

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const id_input = locals.session?.user.id.toString();
	const { data: userProfileData } = await locals.dbClient
		.from('user_profile')
		.select('*')
		.eq('id', locals.session?.user.id);
	const { error: agentError, data: agent } = await locals.dbClient.rpc('get_agent_for_user', {
		id_input
	});
	if (agent?.length === 0) {
		agentData = [{ agent_name: '', agent_mobile: '', agent_phone: '', created_at: '' }];
	}
	const { data: userBCYCAData } = await locals.dbClient
		.from('user_bcyca_profile')
		.select('*')
		.eq('user_id', locals.session?.user.id);
	const { data: propertyProfileData } = await locals.dbClient.rpc('get_property_for_user', {
		id_input
	});
	return {
		agent: agentData?.[0],
		userProfile: userProfileData?.[0],
		userBCYCA: userBCYCAData?.[0],
		propertyProfile: propertyProfileData?.[0]
	};
};
