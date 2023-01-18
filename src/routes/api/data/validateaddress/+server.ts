import { json } from '@sveltejs/kit';
import { supabaseClient } from '$lib/dbClient';

import type { RequestHandler } from './$types';

export const POST = (async ({ locals, request }) => {
	debugger;
	const body = await request.json();
	const {
		data: addressData,
		status: sbStatus,
		statusText,
		error: addressError
	} = await supabaseClient.rpc('get_addresspoint_from_address', {
		address_text: body.streetAddress.toUpperCase(),
		given_suburb: body.suburb.toUpperCase(),
		in_srid_value: 3857,
		out_srid_value: 4326
	});
	let result: Response;
	if (addressError) {
		result = json({
			communityname: 'None identified',
			principaladdresssiteoid: null,
			validaddress: '',
			searchstreet: '',
			searchsuburb: '',
			postcode: '',
			addresspoint: null,
			message: 'Could not check the address.',
			returnstatus: 418,
			apistatus: sbStatus,
			apistatustext: statusText,
			error: addressError
		});
	} else {
		let resultData = addressData[0];
		result = json({
			communityname: resultData.community,
			principaladdresssiteoid: resultData.principaladdresssiteoid,
			validaddress: resultData.valid_address,
			searchstreet: body.streetAddress.toUpperCase(),
			searchsuburb: body.suburb.toUpperCase(),
			postcode: resultData.postcode,
			addresspoint: resultData.addresspoint_geom,
			message: resultData.message,
			status: resultData.return_status,
			// status: 401,
			apistatus: sbStatus,
			apistatustext: statusText,
			error: null
		});
	}
	return result;
}) satisfies RequestHandler;
