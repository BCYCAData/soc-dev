import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals?.session?.user) {
		throw redirect(307, '/auth/signin');
	}
	const { data: usersAdminNewUsersData, error: usersAdminNewUsersError } =
		await locals.dbClient.rpc('get_profile_messages_for_user', {
			id_input: locals?.session?.user.id
		});
	return {
		usersAdminNewUsersData: {}
	};
};
