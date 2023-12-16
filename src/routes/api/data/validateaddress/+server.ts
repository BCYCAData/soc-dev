import { json } from '@sveltejs/kit';
import { splitStreetAddress } from '$lib/utils';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { locals: { supabase }, request } = event
	const body = await request.json();
	const {
		data: addressData,
		status: sbStatus,
		statusText,
		error: addressError
	} = await supabase.rpc('get_addresspoint_from_address', {
		address_text: body.streetAddress.toUpperCase(),
		given_suburb: body.suburb.toUpperCase(),
		out_srid_value: 7844
	});
	let result: Response;
	if (sbStatus !== 200) {

	}
	// const streetAddressParts = splitStreetAddress(body.streetAddress.toUpperCase());
	// const searchaddress = [
	// 	streetAddressParts[0],
	// 	streetAddressParts[1],
	// 	body.suburb.toUpperCase(),
	// 	''
	// ];
	console.log('response', addressData)
	console.log('status', sbStatus)
	console.log('statusText', statusText)
	console.log('error', addressError)
	// if (addressError) {
	// 	result = json({
	// 		communityname: 'None identified',
	// 		principaladdresssiteoid: null,
	// 		validaddress: [],
	// 		searchaddress: searchaddress,
	// 		addresspoint: null,
	// 		message: 'Could not check the address.',
	// 		returnstatus: 418,
	// 		apistatus: sbStatus,
	// 		apistatustext: statusText,
	// 		error: addressError
	// 	});
	// } else {
	// 	const resultData = addressData[0];
	// 	searchaddress.splice(3, 1, resultData.postcode);
	// 	const validaddress = [
	// 		resultData.housenumber,
	// 		searchaddress[1],
	// 		resultData.suburbname,
	// 		resultData.postcode
	// 	];
	// 	result = json({
	// 		communityname: resultData.community,
	// 		principaladdresssiteoid: resultData.principaladdresssiteoid,
	// 		validaddress: validaddress, //['number', 'street', 'suburb', 'postcode'] all UCase
	// 		searchaddress: searchaddress, //['number', 'street', 'suburb', 'postcode'] all UCase
	// 		addresspoint: resultData.addresspoint_geom, //geojson Point
	// 		message: resultData.message,
	// 		status: resultData.return_status,
	// 		apistatus: sbStatus,
	// 		apistatustext: statusText,
	// 		error: null
	// 	});
	// }
	result = json({
		apistatus: sbStatus,
		apistatustext: statusText,
		error: null
	});
	return result;
};
