import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	if (
		!(
			session?.user?.app_metadata.roles.includes('tester') |
			session?.user?.app_metadata.roles.includes('admin')
		)
	) {
		throw redirect(307, '/auth/signin');
	}
	const { data: streetsData, error: getStreetsError } = await supabase.rpc('get_street_list', {});
	if (getStreetsError) {
		console.log('error errorStreets:', getStreetsError);
		throw error(400, getStreetsError.message);
	}
	if (streetsData.length > 0) {
		let streetList = streetsData.map(({ streets }) => streets);
		return {
			session,
			streetList
		};
	}
	throw error(400, 'Something went wrong retrieving the Street List data');
};

export const actions: Actions = {
	generateStreetReport: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session?.user) {
			throw redirect(307, '/auth/signin');
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
			throw error(400, streetError.message);
		}
		if (streetData.length > 0) {
			let propertyList = streetData.map(({ property_id }) => property_id);
			const { data: residentData, error: residentError } = await supabase.rpc(
				'get_rfs_user_data_for_porperties',
				{
					property_ids: propertyList
				}
			);
			if (residentError) {
				console.log('get error residentData:', residentError);
				throw error(400, residentError.message);
			}
			return {
				selectedStreet: street,
				streetData: streetData
			};
		}
		throw error(400, 'Could not POST Street data');
	}
};
