import type { LayoutServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: profileMessagesData, error: profileMessagesError } =
		await event.locals.dbClient.rpc('get_profile_messages_for_user', {
			id_input: event.locals?.session?.user.id
		});
	if (profileMessagesError) {
		console.log('error get Profile Messages for User:', profileMessagesError);
		throw error(400, profileMessagesError.message);
	}
	return {
		profileMessages: profileMessagesData
	};
};
