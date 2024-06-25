import { error, redirect, type Actions } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import type { PageServerLoad } from './$types.js';
import type { CustomJwtPayload } from '$lib/types.js';

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
	const { data: streetsData, error: getStreetsError } = await supabase.rpc('get_street_list', {});
	if (getStreetsError) {
		console.log('error errorStreets:', getStreetsError);
		error(400, getStreetsError.message);
	}
	if (streetsData.length > 0) {
		const streetList = streetsData.map(({ streets }) => streets);
		return {
			streetList
		};
	}
	error(400, 'Something went wrong retrieving the Street List data');
};

export const actions: Actions = {
	generateStreetReport: async ({ request, locals: { supabase, user } }) => {
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
		const formData = await request.formData();
		const street = formData.get('property_address_street') as string;
		const { data: streetData, error: streetError } = await supabase.rpc(
			'get_rfs_property_data_for_street',
			{
				street_input: street
			}
		);
		if (streetError) {
			console.log('get error streetData:', streetError);
			error(400, streetError.message);
		}
		if (streetData.length > 0) {
			const propertyList = streetData.map(({ property_id }) => property_id);
			const { data: residentData, error: residentError } = await supabase.rpc(
				'get_rfs_user_data_for_porperties',
				{
					property_ids: propertyList
				}
			);
			if (residentError) {
				console.log('get error residentData:', residentError);
				error(400, residentError.message);
			}
			return {
				selectedStreet: street,
				streetData: streetData
			};
		}
		error(400, 'Could not POST Street data');
	}
};
