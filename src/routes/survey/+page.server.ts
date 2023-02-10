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
	if (agentError) {
		console.log('error get Agent for User:', agentError);
		throw error(400, agentError.message);
	}
	if (agent?.length === 0) {
		agentData = [{ agent_name: '', agent_mobile: '', agent_phone: '', created_at: '' }];
	}
	const { error: userBCYCAError, data: userBCYCAData } = await locals.dbClient
		.from('user_bcyca_profile')
		.select('*')
		.eq('user_id', locals.session?.user.id);
	if (userBCYCAError) {
		console.log('error get BCYCA Data for User:', userBCYCAError);
		throw error(400, userBCYCAError.message);
	}
	const { error: propertyProfileError, data: propertyProfileData } = await locals.dbClient.rpc(
		'get_property_for_user',
		{
			id_input
		}
	);
	if (propertyProfileError) {
		console.log('error get Property Profile Data for User:', propertyProfileError);
		throw error(400, propertyProfileError.message);
	}
	return {
		agent: agentData?.[0],
		userProfile: userProfileData?.[0],
		userBCYCA: userBCYCAData?.[0],
		propertyProfile: propertyProfileData?.[0]
	};
};
