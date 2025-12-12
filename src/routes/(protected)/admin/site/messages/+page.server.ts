import { fail, type Actions } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';
import { hasPermission } from '$lib/server/permissions';
import { PERMISSIONS } from '$lib/constants/permissions';

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

type MessageContext = 'users' | 'admins' | 'both';

async function sendMessage(supabase: any, message: string, context?: MessageContext, ids?: string) {
	const { data: response, error: sendError } = await supabase.rpc('insert_message', {
		message_text: message,
		context_text: context,
		ids
	});

	if (sendError) {
		console.error('Send message RPC error:', sendError);
		throw new Error(sendError.message);
	}
	if (response !== 200) {
		throw new Error('Message sending failed');
	}

	return response;
}

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const [listsResponse, messagesResponse] = await Promise.all([
		supabase.rpc('get_lists'),
		supabase.rpc('get_app_messages')
	]);

	if (listsResponse.error) {
		console.error('Load lists error:', listsResponse.error);
		throw new Error('Failed to load lists data');
	}
	if (messagesResponse.error) {
		console.error('Load messages error:', messagesResponse.error);
		throw new Error('Failed to load messages data');
	}

	const listsData = listsResponse.data as ListsData;
	return {
		emailList: listsData?.emailList ?? [],
		addressList: listsData?.addressList ?? [],
		streetList: listsData?.streetList ?? [],
		communityList: listsData?.communityList ?? [],
		suburbList: listsData?.suburbList ?? [],
		appMessages: messagesResponse.data ?? []
	};
};

export const actions: Actions = {
	sendMessageToAllUsers: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_MESSAGES)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to send messages'
			});
		}
		try {
			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const context = formData.get('messageContext')?.toString() as MessageContext;
			if (!message?.trim() || !context) {
				return fail(400, {
					success: false,
					message: 'Message and context are required'
				});
			}
			await sendMessage(supabase, message, context);
			return {
				success: true,
				message: 'Message sent successfully to all users'
			};
		} catch (err) {
			console.error('Send to all users error:', err);
			return fail(500, {
				success: false,
				message: 'Failed to send message to all users'
			});
		}
	},
	sendMessageToEmailList: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_MESSAGES)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to send messages'
			});
		}
		try {
			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const targetData = formData.get('target_data')?.toString();

			if (!message?.trim() || !targetData) {
				return fail(400, {
					success: false,
					message: 'Message, and target recipients are required'
				});
			}

			const cleanTargetData = targetData.replace(/[\[\]]/g, '');
			await sendMessage(supabase, message, 'both', cleanTargetData);

			return {
				success: true,
				message: 'Message sent successfully to email list.'
			};
		} catch (err: unknown) {
			console.error('Send to email list error:', err);
			return fail(500, {
				success: false,
				message: 'Failed to send message to email list'
			});
		}
	},
	sendMessageToAllUsersAtAddress: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_MESSAGES)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to send messages'
			});
		}
		try {
			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const targetData = formData.get('target_data')?.toString();

			if (!message?.trim() || !targetData) {
				return fail(400, {
					success: false,
					message: 'Message, context, and target recipients are required'
				});
			}

			const cleanTargetData = targetData.replace(/[\[\]]/g, '');
			await sendMessage(supabase, message, 'both', cleanTargetData);

			return { success: true, message: 'Message sent successfully to selected users' };
		} catch (err) {
			console.error('Send to email list error:', err);
			return fail(500, {
				success: false,
				message: 'Failed to send message to selected users'
			});
		}
	},
	sendMessageToAllUsersInStreet: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_MESSAGES)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to send messages'
			});
		}
		try {
			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const targetData = formData.get('target_data')?.toString();

			if (!message?.trim() || !targetData) {
				return fail(400, {
					success: false,
					message: 'Message, context, and target recipients are required'
				});
			}

			const cleanTargetData = targetData.replace(/[\[\]]/g, '');
			await sendMessage(supabase, message, 'both', cleanTargetData);

			return {
				success: true,
				message: 'Message sent successfully to all users in selected street'
			};
		} catch (err) {
			console.error('Send to email list error:', err);
			return fail(500, {
				success: false,
				message: 'Failed to send message to all users in selected street'
			});
		}
	},
	sendMessageToAllUsersInCommunity: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_MESSAGES)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to send messages'
			});
		}
		try {
			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const targetData = formData.get('target_data')?.toString();

			if (!message?.trim() || !targetData) {
				return fail(400, {
					success: false,
					message: 'Message, context, and target recipients are required'
				});
			}

			const cleanTargetData = targetData.replace(/[\[\]]/g, '');
			await sendMessage(supabase, message, 'both', cleanTargetData);

			return { success: true, message: 'Message sent successfully to all users in selected community' };
		} catch (err) {
			console.error('Send to email list error:', err);

			return fail(500, {
				success: false,
				message: 'Failed to send message to all user in selected community'
			});
		}
	},
	sendMessageToAllUsersInSuburb: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_MESSAGES)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to send messages'
			});
		}
		try {
			const formData = await request.formData();
			const message = formData.get('inputMessage')?.toString();
			const targetData = formData.get('target_data')?.toString();

			if (!message?.trim() || !targetData) {
				return fail(400, {
					success: false,
					message: 'Message, context, and target recipients are required'
				});
			}

			const cleanTargetData = targetData.replace(/[\[\]]/g, '');
			await sendMessage(supabase, message, 'both', cleanTargetData);

			return { success: true, message: 'Message sent successfully to all users in selected suburb' };
		} catch (err) {
			console.error('Send to email list error:', err);

			return fail(500, {
				success: false,
				message: 'Failed to send message to all users in selected suburb'
			});
		}
	},
	revokeMessages: async ({ request, locals: { supabase, permissions } }) => {
		if (!hasPermission(permissions, PERMISSIONS.ADMIN_SITE_MESSAGES)) {
			return fail(403, {
				success: false,
				message: 'Insufficient permissions to revoke messages'
			});
		}
		try {
			const formData = await request.formData();
			const idInput = formData.get('revoke_ids')?.toString();

			if (!idInput) {
				return fail(400, {
					success: false,
					message: 'No messages selected for revocation'
				});
			}

			const revokedIds = idInput.split(',');

			const { data: response, error: revokeError } = await supabase.rpc('revoke_app_messages', {
				revoked_ids: revokedIds
			});

			if (revokeError) {
				return fail(400, {
					success: false,
					message: revokeError.message
				});
			}
			if (response !== 200) {
				return fail(response, {
					success: false,
					message: 'Message revocation failed'
				});
			}

			return {
				success: true,
				message: 'Message revocation successfull'
			};
		} catch (err) {
			console.error('Revoke messages error:', err);
			return fail(500, {
				success: false,
				message: 'Failed to revoke selected messages'
			});
		}
	}
};
