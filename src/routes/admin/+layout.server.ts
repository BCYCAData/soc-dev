import { error, redirect } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

import type { LayoutServerLoad } from '../$types';
import type { CustomJwtPayload } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals: { supabase, user } }) => {
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
