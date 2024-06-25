import { jwtDecode } from 'jwt-decode';
import { error } from '@sveltejs/kit';
import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';

import type { LayoutServerLoad } from './$types';

import type { CustomJwtPayload } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals: { supabase, user } }) => {
	let role: string | null = null;
	let coordinatorData: string[] = [];
	let permissionsData: string[] = [];
	supabase.auth.onAuthStateChange(async (event, session) => {
		if (session && session.access_token) {
			const jwt: CustomJwtPayload = jwtDecode(session.access_token);
			role = jwt.user_role;
			coordinatorData = jwt.coordinates_kyng;
		}
	});
	let communityRequestOptionsData;
	const communityRequestOptionsQuery = await supabase
		.from('community_request_options_lut')
		.select(
			`index_value,lable,community_request_options_concordance(table_name,object_name,field_name)`
		);
	const { data: communityRequestOptionsQueryData, error: communityRequestOptionsQueryError } =
		communityRequestOptionsQuery;
	if (communityRequestOptionsQueryError) {
		console.log('GET data error Community Request Options:', communityRequestOptionsQueryError);
		let emailSubject: PostgRestErrorEmailSubject = {
			type: `GET data error :: Community Request Options.`,
			user: `User:: $user.id}.`,
			time: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
		};
		sendPostgRestErrorEmail(emailSubject, communityRequestOptionsQueryError);
		error(
			400,
			`GET data error Community Request Options:  Error ${communityRequestOptionsQueryError.message}`
		);
	}
	if (communityRequestOptionsQueryData && communityRequestOptionsQueryData.length > 0) {
		communityRequestOptionsData = communityRequestOptionsQueryData;
	}

	if (role) {
		const permissionsQueryData = supabase
			.from('role_permissions')
			.select('permission')
			.eq('role', role);
		const { data, error: getPermissionsDataError } = await permissionsQueryData;
		if (getPermissionsDataError) {
			console.log('GET data error User Permissions:', getPermissionsDataError);
			let emailSubject: PostgRestErrorEmailSubject = {
				type: `GET data error :: Permissions.`,
				user: `User:: $user.id}.`,
				time: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`
			};
			sendPostgRestErrorEmail(emailSubject, getPermissionsDataError);
			error(400, `GET data error Permissions:  Error ${getPermissionsDataError.message}`);
		}
		if (data && data.length > 0) {
			permissionsData = data[0].permission?.split(',') || [];
		}
	}
	return { user, role, permissionsData, coordinatorData, communityRequestOptionsData };
};
