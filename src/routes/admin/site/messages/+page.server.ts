import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (!session) {
		throw redirect(307, '/auth/signin');
	} else if (
		!(
			session?.user?.app_metadata.roles.includes('tester') |
			session?.user?.app_metadata.roles.includes('admin')
		)
	) {
		throw error(401, { message: 'Unauthorized' });
	}
	const { data: listsData, error: getStreetsError } = await supabase.rpc('get_lists', {});
	if (getStreetsError) {
		console.log('error errorStreets:', getStreetsError);
		throw error(400, getStreetsError.message);
	}
	const { data: appMessages, error: appMessagesError } = await supabase.rpc('get_app_messages', {});
	if (appMessagesError) {
		console.log('error appMessagesError:', appMessagesError);
		throw error(400, appMessagesError.message);
	}
	return {
		session,
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
	sendToAllUsers: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			throw redirect(307, '/auth/signin');
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
			throw error(400, `error sendToAllUsers: ${sendToAllUsersError.message}`);
		}
		if (sendToAllUsersResponse === 200) {
			return {};
		}
		throw error(400, 'Could not send message to Users by email address');
	},
	sendToEmailList: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			throw redirect(307, '/auth/signin');
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
				throw error(400, `error sendToAllUsers: ${sendToAllUsersError.message}`);
			}
			if (sendToAllUsersResponse === 200) {
				return {};
			}
		}
		throw error(400, 'Could not send message to Users by email address');
	}
};
