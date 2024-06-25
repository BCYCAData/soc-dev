import { error, redirect, type Actions } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import type { PageServerLoad } from './$types';
import type { CustomJwtPayload } from '$lib/types';

interface ListItem {
	user_id: string;
	lut_text: string;
}

interface ListsData {
	emailList: ListItem[];
	addressList: ListItem[];
	streetList: ListItem[];
	communityList: ListItem[];
	suburbList: ListItem[];
}

export const load: PageServerLoad = async ({ locals: { supabase, user } }) => {
	if (!user) {
		redirect(307, '/auth/signin');
	} else {
		const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
			if (session) {
				const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
				const userRole = jwt.user_role;
				if (userRole?.split('_')[0] !== 'admin') {
					error(403, { message: 'Forbidden' });
				}
			}
			data.subscription.unsubscribe();
		});
	}
	const { data: listsData, error: getStreetsError } = await supabase.rpc('get_lists', {});
	if (getStreetsError) {
		console.log('error errorStreets:', getStreetsError);
		error(400, getStreetsError.message);
	}
	const { data: appMessages, error: appMessagesError } = await supabase.rpc('get_app_messages', {});
	if (appMessagesError) {
		console.log('error appMessagesError:', appMessagesError);
		error(400, appMessagesError.message);
	}
	return {
		siteAdminMessagesData: {},
		emailList: (listsData as unknown as ListsData)?.emailList,
		addressList: (listsData as unknown as ListsData)?.addressList,
		streetList: (listsData as unknown as ListsData)?.streetList,
		communityList: (listsData as unknown as ListsData)?.communityList,
		suburbList: (listsData as unknown as ListsData)?.suburbList,
		appMessages: appMessages
	};
};

export const actions: Actions = {
	sendToAllUsers: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const message = formData.get('inputMessage')?.toString();
		const context = formData.get('enumSelect')?.toString() as 'users' | 'admins' | 'both';
		const { data: sendToAllUsersResponse, error: sendToAllUsersError } = await supabase.rpc(
			'insert_message',
			{
				message_text: message || '',
				context_text: context || '',
				ids: undefined
			}
		);
		if (sendToAllUsersError) {
			console.log('error sendToAllUsers: ', sendToAllUsersError);
			error(400, `error sendToAllUsers: ${sendToAllUsersError.message}`);
		}
		if (sendToAllUsersResponse === 200) {
			return {};
		}
		error(400, 'Could not send message to all Users');
	},
	sendToEmailList: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const message = formData.get('inputMessage')?.toString();
		const context = formData.get('enumSelect')?.toString() as 'users' | 'admins' | 'both';
		const targetData = formData.get('target_data')?.toString().replace('[', '').replace(']', '');
		if (targetData != null) {
			const { data: sendToAllUsersResponse, error: sendToAllUsersError } = await supabase.rpc(
				'insert_message',
				{
					message_text: message || '',
					context_text: context || '',
					ids: targetData
				}
			);
			if (sendToAllUsersError) {
				console.log('error sendToAllUsers: ', sendToAllUsersError);
				error(400, `error sendToAllUsers: ${sendToAllUsersError.message}`);
			}
			if (sendToAllUsersResponse === 200) {
				return {};
			}
		}
		error(400, `Could not send message to Users with ids: (${targetData}).`);
	},
	revokeMessages: async ({ request, locals: { supabase, user } }) => {
		if (!user) {
			redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		const id_input = formData.get('revoke_ids')?.toString();
		if (id_input != null) {
			const revoked_ids = id_input.split(',');
			const { data: revokeAppMessagesResponse, error: revokeAppMessagesError } = await supabase.rpc(
				'revoke_app_messages',
				{ revoked_ids }
			);
			if (revokeAppMessagesError) {
				console.log('error sendToAllUsers: ', revokeAppMessagesError);
				error(400, `error sendToAllUsers: ${revokeAppMessagesError.message}`);
			}
			if (revokeAppMessagesResponse === 200) {
				return {};
			}
		}
		error(400, `Could not revoke messages with ids: (${id_input}).`);
	}
};
