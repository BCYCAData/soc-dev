import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (
		!(
			locals.session?.user?.app_metadata.claims.includes('tester') |
			locals.session?.user?.app_metadata.claims.includes('admin')
		)
	) {
		throw redirect(307, '/auth/signin');
	}
	const { data: streetsData, error: getStreetsError } = await locals.dbClient.rpc(
		'get_street_list',
		{}
	);
	if (getStreetsError) {
		console.log('error errorStreets:', getStreetsError);
		throw error(400, getStreetsError.message);
	}
	if (streetsData.length > 0) {
		let streetList = streetsData.map(({ streets }) => streets);
		return {
			streetList: streetList
		};
	}
	throw error(400, 'Something went wrong retrieving the Street List data');
};

export const actions: Actions = {
	generateReport: async ({ request, locals }) => {
		if (!locals?.session?.user) {
			throw redirect(307, '/auth/signin');
		}
		const formData = await request.formData();
		console.log(formData);
		const street = formData.get('property_address_street') as string;
		const { data: streetData, error: streetError } = await locals.dbClient.rpc(
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
			const { data: residentData, error: residentError } = await locals.dbClient.rpc(
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
				reportStreet: street,
				streetData: streetData,
				residentData: residentData
			};
		}
		throw error(400, 'Could not POST Street data');
	}
};
