import { error, redirect } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import type { PageServerLoad } from './$types';
import type { CustomJwtPayload } from '$lib/types';

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
	const { data: mondrookInformationData, error: mondrookInformationError } = await supabase.rpc(
		'get_user_mondrook_information_data',
		{}
	);
	if (mondrookInformationError) {
		console.log('error get Mondrook Information Sheet Choices Data:', mondrookInformationError);
		error(400, mondrookInformationError.message);
	}
	return {
		mondrookInformationData: mondrookInformationData
	};
};
