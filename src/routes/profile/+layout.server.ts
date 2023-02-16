import type { LayoutServerLoad } from './$types';
import type {
	AgentData,
	ProfileMessageData,
	PropertyProfileData,
	UserBCYCAProfileData,
	UserPostalAddressData,
	UserProfileData
} from '$lib/db.types';
import { error, redirect } from '@sveltejs/kit';

let agentData: AgentData;
let userPostalAddressData: UserPostalAddressData;
let userProfileData: UserProfileData;
let userBCYCAData: UserBCYCAProfileData;
let propertyProfileData: PropertyProfileData;
let profileMessagesData: ProfileMessageData;

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: profileMessages, error: profileMessagesError } = await event.locals.dbClient.rpc(
		'get_profile_messages_for_user',
		{
			id_input: event.locals?.session?.user.id
		}
	);
	if (profileMessagesError) {
		console.log('error get Profile Messages for User:', profileMessagesError);
		throw error(400, profileMessagesError.message);
	}
	profileMessagesData = profileMessages;
	const { error: agentError, data: agent } = await event.locals.dbClient
		.from('agent')
		.select('*')
		.eq('user_id', event.locals.session.user.id);
	if (agentError) {
		console.log('error get Agent for User:', agentError);
		throw error(400, agentError.message);
	}
	if (agent?.length === 1) {
		agentData = agent[0];
	} else {
		agentData = {
			user_id: event.locals.session.user.id,
			agent_name: null,
			agent_mobile: null,
			agent_phone: null,
			created_at: null,
			last_updated: null
		};
	}
	const { error: userPostalAddressError, data: userPostalAddressSelectData } =
		await event.locals.dbClient
			.from('user_postal_address')
			.select('*')
			.eq('user_id', event.locals.session?.user.id);
	if (userPostalAddressError) {
		console.log('error get Postal Address Data for User:', userPostalAddressError);
		throw error(400, userPostalAddressError.message);
	}
	if (userPostalAddressSelectData?.length === 1) {
		userPostalAddressData = userPostalAddressSelectData[0];
	} else {
		userPostalAddressData = {
			user_id: event.locals.session.user.id,
			postal_address_street: null,
			postal_address_suburb: null,
			postal_address_postcode: null,
			created_at: null,
			last_updated: null
		};
	}
	const { error: userProfileError, data: getUserProfileData } = await event.locals.dbClient
		.from('user_profile')
		.select('*')
		.eq('id', event.locals.session.user.id);
	if (userProfileError) {
		console.log('error Get Profile Data for User:', userProfileError);
		throw error(400, userProfileError.message);
	}
	userProfileData = getUserProfileData[0];
	const { error: userBCYCAError, data: getUserBCYCAData } = await event.locals.dbClient
		.from('user_bcyca_profile')
		.select('*')
		.eq('user_id', event.locals.session?.user.id);
	if (userBCYCAError) {
		console.log('error get BCYCA Data for User:', userBCYCAError);
		throw error(400, userBCYCAError.message);
	}
	userBCYCAData = getUserBCYCAData[0];
	const { error: propertyProfileError, data: getPropertyProfileData } = await event.locals.dbClient
		.from('property_profile')
		.select('*, user_profile(id), temp_user:user_profile!inner(id)')
		.in('temp_user.id', [event.locals.session?.user.id]);
	if (propertyProfileError) {
		console.log('error get Property Profile Data for User:', propertyProfileError);
		throw error(400, propertyProfileError.message);
	}
	propertyProfileData = getPropertyProfileData[0];
	return {
		profileMessagesData,
		agentData,
		userProfileData,
		userPostalAddressData,
		userBCYCAData,
		propertyProfileData,
		property_was_rented: propertyProfileData.property_rented,
		post_was_ticked: userProfileData.stay_in_touch_choices?.includes(5)
	};
};
