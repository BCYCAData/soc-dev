import type { LayoutServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	if (
		!(
			event.locals.session?.user?.app_metadata.bcyca.includes('tester') |
			event.locals.session?.user?.app_metadata.bcyca.includes('admin')
		)
	) {
		throw redirect(307, '/auth/signin');
	}
	const { data: adminMessagesData, error: adminMessagesError } = await event.locals.dbClient.rpc(
		'get_admin_messages_for_user',
		{
			id_input: event.locals?.session?.user.id as string
		}
	);
	if (adminMessagesError) {
		console.log('error get Admin Messages for User:', adminMessagesError);
		throw error(400, adminMessagesError.message);
	}
	return {
		adminMessages: adminMessagesData
	};
};
