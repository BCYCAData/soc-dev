import type { ProfileMessageData } from '$lib/custom.types';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../admin/$types';
import type { QueryData } from '@supabase/supabase-js';
import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';

let profileMessagesData: ProfileMessageData;

// ++++++++++++ DATA MODEL +++++++++++++
// {
//     profileMessagesData: [
//         {
//             id: 14,
//             message: Should be in both panels,
//             created_at: 09/02/2023 22:48
//         }
//     ],
//     propertyId: 3a9a9e38-b64f-42e9-912f-fe175d322e0c,
//     propertyWasRented: true,
//     communityName: BCYCA,
//     propertyAddress: {
//         property_address_street: 5348 THE BUCKETTS WAY,
//         property_address_suburb: BURRELL CREEK,
//         property_address_postcode: 2429
//     },
//     profileAboutMe: {
//         family_name: Keown,
//         fire_fighting_experience: 4,
//         fire_trauma: null,
//         first_name: Alan,
//         mobile: 0497022623,
//         plan_to_leave_before_fire: 3,
//         plan_to_leave_before_flood: null,
//         residency_profile: 6,
//         rfs_survival_plan: Y
//     },
//     profileMyPlace: {
//         search_address_street: 5348 THE BUCKETTS WAY,
//         search_address_suburb: BURRELL CREEK,
//         search_address_postcode: 2429,
//         property_rented: true,
//             property_agent: {
//                 agent_mobile: ,
//                 agent_name: ,
//                 agent_phone:
//             },
//         residents0_18: null,
//         residents19_50: null,
//         residents51_70: null,
//         residents71_: null,
//         vulnerable_residents: null,
//         sign_posted: null,
//         truck_access: null,
//         truck_access_other_information: null,
//         phone: null,
//         mobile_reception: null
//     },
//     profileMyPlaceAssets: {
//         number_birds: null,
//         number_cats: null,
//         number_dogs: null,
//         number_other_pets: null,
//         live_stock_present: null,
//         live_stock_safe_area: null,
//         share_livestock_safe_area: null,
//         other_essential_assets: null
//     },
//     profileMyPlaceFireFightingResources: {
//         static_water_available: [
//             0
//         ],
//         have_stortz: null,
//         stortz_size: null,
//         fire_fighting_resources: [],
//         fire_hazard_reduction: []
//     },
//     profileMyPlaceFireFightingHazards: {
//         site_hazards: [],
//         other_hazards: null,
//         other_site_hazards: null,
//         land_adjacent_hazard: null,
//     },
//     profileMyCommunity: {
//         stay_in_touch_choices: ,
//             user_postal_address: {
//                 postal_address_postcode: ,
//                 postal_address_street: ,
//                 postal_address_suburb:
//             },
//         other_comments:
//     },
//     profileMyCommunityBCYCAInformation: {
//         information_sheet_choices: [],
//         other_information_sheet: null
//     },
//     profileMyCommunityBCYCAWorkshops: {
//         community_workshop_choices: [],
//         other_community_workshop: null,
//         will_run_community_workshops: null
//     },
//     profileMyCommunityBCYCAEvents: {
//         community_meeting_choices: [],
//         other_community_meeting: null
//     },
//     profileMyCommunityTinoneeInformation: {
//         information_sheet_choices: [],
//         other_information_sheet: null
//     },
//     profileMyCommunityTinoneeWorkshops: {
//         community_workshop_choices: [],
//         other_community_workshop: null,
//         will_run_community_workshops: null
//     },
//     profileMyCommunityTinoneeEvents: {
//         community_meeting_choices: [],
//         other_community_meeting: null
//     },
//     profileMyCommunityMondrookInformation: {
//         information_sheet_choices: [],
//         other_information_sheet: null
//     },
//     profileMyCommunityMondrookWorkshops: {
//         community_workshop_choices: [],
//         other_community_workshop: null,
//         will_run_community_workshops: null
//     },
//     profileMyCommunityMondrookEvents: {
//         community_meeting_choices: [],
//         other_community_meeting: null
//     },
//     profileMyCommunityExternalInformation: {
//         information_sheet_choices: [],
//         other_information_sheet: null
//     },
//     profileMyCommunityExternalWorkshops: {
//         community_workshop_choices: [],
//         other_community_workshop: null,
//         will_run_community_workshops: null
//     },
//     profileMyCommunityExternalEvents: {
//         community_meeting_choices: [],
//         other_community_meeting: null
//     },
// }

export const load: LayoutServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session?.user) {
		redirect(307, '/auth/signin');
	}
	const { data: profileMessages, error: profileMessagesError } = await supabase.rpc(
		'get_profile_messages_for_user',
		{
			id_input: session?.user.id
		}
	);
	if (profileMessagesError) {
		console.log('error get Profile Messages for User:', profileMessagesError);
		error(400, profileMessagesError.message);
	}
	profileMessagesData = profileMessages;
	const profileQueryData = supabase
		.from('property_profile')
		.select(
			` id, property_address_street, property_address_suburb, property_address_postcode, phone,
    			mobile_reception, sign_posted, other_essential_assets, residents0_18, residents19_50,
    			residents51_70, residents71_, vulnerable_residents, number_birds, number_cats, number_dogs,
    			number_other_pets, live_stock_present, live_stock_safe_area, share_livestock_safe_area, static_water_available,
    			have_stortz, stortz_size, truck_access, truck_access_other_information, fire_fighting_resources,
    			fire_hazard_reduction, site_hazards, other_hazards, other_site_hazards, land_adjacent_hazard,
      			property_rented, 
				community_areas(community), 
				user_profile( family_name, fire_fighting_experience, fire_trauma, first_name, mobile, other_comments, 
					plan_to_leave_before_fire, plan_to_leave_before_flood, residency_profile, rfs_survival_plan, 
					stay_in_touch_choices, 
					community_bcyca_profile(community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops
					), 
					community_tinonee_profile(community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops
					), 
					community_mondrook_profile(community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops
					), 
					community_external_profile(community_meeting_choices, community_workshop_choices, 
						information_sheet_choices, other_community_meeting, other_community_workshop,
						other_information_sheet, stay_in_touch_choices, will_run_community_workshops
					), 
					user_postal_address(postal_address_postcode, postal_address_street, postal_address_suburb) 
				), 
				property_agent(agent_mobile, agent_name, agent_phone)`
		)
		.eq('principaladdresssiteoid', session.user.app_metadata.principaladdresssiteoid)
		.eq('user_profile.id', session.user.id);
	type ProfileData = QueryData<typeof profileQueryData>;
	const { data, error: getProfileDataError } = await profileQueryData;
	if (getProfileDataError) {
		console.log('GET data error Profile:', getProfileDataError);
		let emailSubject: PostgRestErrorEmailSubject = {
			type: `GET data error :: Profile.`,
			user: `User:: ${session.user.id}.`,
			time: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
		};
		sendPostgRestErrorEmail(emailSubject, getProfileDataError);
		error(400, `GET data error Survey:  Error ${getProfileDataError.message}`);
	}
	if (data && data.length > 0) {
		const surveyData: ProfileData = data;
		let {
			user_profile: [_userProfileData],
			property_agent,
			community_areas,
			...property_profile
		} = surveyData[0];
		const communityName = community_areas!.community!;
		let {
			id,
			property_address_street,
			property_address_suburb,
			property_address_postcode,
			...propertyProfile
		} = property_profile;
		const propertyId = id;
		const propertyAddress = {
			property_address_street: property_address_street,
			property_address_suburb: property_address_suburb,
			property_address_postcode: property_address_postcode
		};
		const propertyWasRented = propertyProfile.property_rented || false;
		let {
			user_postal_address,
			community_bcyca_profile,
			community_tinonee_profile,
			community_mondrook_profile,
			community_external_profile,
			...userProfile
		} = _userProfileData;
		if (!property_agent) {
			property_agent = {
				agent_mobile: '',
				agent_name: '',
				agent_phone: ''
			};
		}
		if (!user_postal_address) {
			user_postal_address = {
				postal_address_postcode: '',
				postal_address_street: '',
				postal_address_suburb: ''
			};
		}
		if (community_bcyca_profile) {
			// steps = insertSteps(steps, [
			// 	{ index: 8, text: '8', page: 'Step8' },
			// 	{ index: 9, text: '9', page: 'Step9' },
			// 	{ index: 10, text: '10', page: 'Step10' }
			// ]);
		}
		if (community_tinonee_profile) {
			// console.log('community_tinonee_profile', community_tinonee_profile);
			// steps = insertSteps(steps, [
			// 	{ index: 8, text: '8', page: 'Step11' },
			// 	{ index: 9, text: '9', page: 'Step12' },
			// 	{ index: 10, text: '10', page: 'Step13' }
			// ]);
		}
		if (community_mondrook_profile) {
			// console.log('community_mondrook_profile', community_mondrook_profile);
			// steps = insertSteps(steps, [
			// 	{ index: 8, text: '8', page: 'Step14' },
			// 	{ index: 9, text: '9', page: 'Step15' },
			// 	{ index: 10, text: '10', page: 'Step16' }
			// ]);
		}
		if (community_external_profile) {
			// console.log('community_external_profile', community_external_profile);
			// steps = insertSteps(steps, [
			// 	{ index: 8, text: '8', page: 'Step17' },
			// 	{ index: 9, text: '9', page: 'Step18' },
			// 	{ index: 10, text: '10', page: 'Step19' }
			// ]);
		}
		return {
			profileMessagesData,
			propertyId,
			propertyWasRented,
			communityName,
			propertyAddress,
			propertyProfile,
			property_agent,
			userProfile,
			user_postal_address,
			community_bcyca_profile,
			community_tinonee_profile,
			community_mondrook_profile,
			community_external_profile
		};
		// const { data: profileMessages, error: profileMessagesError } = await supabase.rpc(
		// 	'get_profile_messages_for_user',
		// 	{
		// 		id_input: session?.user.id
		// 	}
		// );
		// if (profileMessagesError) {
		// 	console.log('error get Profile Messages for User:', profileMessagesError);
		// 	error(400, profileMessagesError.message);
		// }
		// profileMessagesData = profileMessages;
		// const { error: agentError, data: agent } = await supabase
		// 	.from('property_agent')
		// 	.select('*')
		// 	.eq('property_id', session.user.app_metadata.property_id);
		// if (agentError) {
		// 	console.log('error get Agent for User:', agentError);
		// 	error(400, agentError.message);
		// }
		// if (agent?.length === 1) {
		// 	agentData = agent[0];
		// } else {
		// 	agentData = {
		// 		property_id: session.user.app_metadata.property_id,
		// 		agent_name: null,
		// 		agent_mobile: null,
		// 		agent_phone: null,
		// 		created_at: null,
		// 		last_updated: null
		// 	};
		// }
		// const { error: userPostalAddressError, data: userPostalAddressSelectData } = await supabase
		// 	.from('user_postal_address')
		// 	.select('*')
		// 	.eq('user_id', session?.user.id);
		// if (userPostalAddressError) {
		// 	console.log('error get Postal Address Data for User:', userPostalAddressError);
		// 	error(400, userPostalAddressError.message);
		// }
		// if (userPostalAddressSelectData?.length === 1) {
		// 	userPostalAddressData = userPostalAddressSelectData[0];
		// } else {
		// 	userPostalAddressData = {
		// 		user_id: session.user.id,
		// 		postal_address_street: null,
		// 		postal_address_suburb: null,
		// 		postal_address_postcode: null,
		// 		created_at: null,
		// 		last_updated: null
		// 	};
		// }
		// const { error: userProfileError, data: getUserProfileData } = await supabase
		// 	.from('user_profile')
		// 	.select('*')
		// 	.eq('id', session.user.id);
		// if (userProfileError) {
		// 	console.log('error Get Profile Data for User:', userProfileError);
		// 	error(400, userProfileError.message);
		// }
		// userProfileData = getUserProfileData[0];
		// const { error: userBCYCAError, data: getUserBCYCAData } = await supabase
		// 	.from('community_bcyca_profile')
		// 	.select('*')
		// 	.eq('user_id', session?.user.id);
		// if (userBCYCAError) {
		// 	console.log('error get BCYCA Data for User:', userBCYCAError);
		// 	error(400, userBCYCAError.message);
		// }
		// userBCYCAData = getUserBCYCAData[0];
		// const { error: propertyProfileError, data: getPropertyProfileData } = await supabase
		// 	.from('property_profile')
		// 	.select('*, user_profile(id), temp_user:user_profile!inner(id)')
		// 	.in('temp_user.id', [session?.user.id]);
		// if (propertyProfileError) {
		// 	console.log('error get Property Profile Data for User:', propertyProfileError);
		// 	error(400, propertyProfileError.message);
		// }
		// propertyProfileData = getPropertyProfileData[0];
		// return {
		// 	session,
		// 	profileMessagesData,
		// 	agentData,
		// 	userProfileData,
		// 	userPostalAddressData,
		// 	userBCYCAData,
		// 	propertyProfileData,
		// 	property_was_rented: propertyProfileData.property_rented,
		// 	post_was_ticked: userProfileData.stay_in_touch_choices?.includes(5)
		// };
	}
};
