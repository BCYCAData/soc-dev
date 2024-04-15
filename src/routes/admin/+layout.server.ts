import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, getUser, accessToken } }) => {
	const { user } = await getUser();
	if (!user) {
		redirect(307, '/auth/signin');
	} else if (
		!(user?.app_metadata.roles.includes('tester') | user?.app_metadata.roles.includes('admin'))
	) {
		error(401, { message: 'Unauthorized' });
	}

	const { data: adminMessagesData, error: adminMessagesError } = await supabase.rpc(
		'get_admin_messages_for_user',
		{
			id_input: user.id as string
		}
	);
	if (adminMessagesError) {
		console.log('error get Admin Messages for User:', adminMessagesError);
		error(400, adminMessagesError.message);
	}
	return {
		adminMessages: adminMessagesData
	};
};
