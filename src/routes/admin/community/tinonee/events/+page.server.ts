import { error, redirect } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import type { PageServerLoad } from './$types';
import type { CustomJwtPayload } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase, getUser } }) => {
	const { user } = await getUser();
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
	const { data: tinoneeEventsData, error: tinoneeEventsError } = await supabase.rpc(
		'get_user_tinonee_events_data',
		{}
	);
	if (tinoneeEventsError) {
		console.log('error get Tinonee Meeting Choices Data:', tinoneeEventsError);
		error(400, tinoneeEventsError.message);
	}

	return {
		tinoneeEventsData: tinoneeEventsData
	};
};
