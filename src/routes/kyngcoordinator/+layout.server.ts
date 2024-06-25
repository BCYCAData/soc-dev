import { error, redirect } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

import type { LayoutServerLoad } from '../$types';
import type { CustomJwtPayload } from '$lib/types';

export const load: LayoutServerLoad = async ({ locals: { supabase, user }, parent }) => {
	const { coordinatorData } = (await parent()) as { coordinatorData: string[] };
	if (!user) {
		redirect(307, '/auth/signin');
	} else {
		const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
			if (session) {
				const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
				const kyngCoordinator = jwt.coordinates_kyng;
				if (kyngCoordinator.length === 0) {
					error(403, { message: 'Forbidden' });
				}
			}
			data.subscription.unsubscribe();
		});
	}

	const { data: kyngAreasData, error: kyngAreasError } = await supabase
		.from('kyng_areas')
		.select('id,kyng')
		.in('id', coordinatorData);
	if (kyngAreasError) {
		console.log('error get KYNG Coordinator Areas for User:', kyngAreasError);
		error(400, kyngAreasError.message);
	}

	const { data: kyngMessagesData, error: kyngMessagesError } = await supabase.rpc(
		'get_kyng_coordinator_messages_for_user',
		{
			id_input: user.id as string
		}
	);
	if (kyngMessagesError) {
		console.log('error get KYNG Coordinator Messages for User:', kyngMessagesError);
		error(400, kyngMessagesError.message);
	}
	return {
		kyngMessages: kyngMessagesData,
		kyngAreas: kyngAreasData
	};
};
