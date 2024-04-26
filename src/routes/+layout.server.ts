import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { getPermissionsData } from '$lib/server/db.utils';
import { error } from '@sveltejs/kit';
import {
	sendPostgRestErrorEmail,
	type PostgRestErrorEmailSubject
} from '$lib/server/email/nodemailer';

import type { LayoutServerLoad } from './$types';

type UserJwtPayload = JwtPayload & {
	user_role: string;
};
export const load: LayoutServerLoad = async ({ locals: { supabase, getUser } }) => {
	let role: string | undefined;
	supabase.auth.onAuthStateChange(async (event, session) => {
		if (session && session.access_token) {
			const jwt: UserJwtPayload = jwtDecode(session.access_token);
			role = jwt.user_role;
		}
	});
	const { user } = await getUser();
	// const { session, user } = await safeGetSession();
	let permissionsData, communityRequestOptionsData;
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

	if (user) {
		const permissionsQueryData = supabase
			.from('user_permissions_view')
			.select('permission')
			.eq('user_id', user.id);
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
			permissionsData = getPermissionsData(data);
		}
	}
	return { user, role, permissionsData, communityRequestOptionsData };
};
