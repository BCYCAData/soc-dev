import { json } from '@sveltejs/kit';
import { transporter, errorMessage, mailOptions } from '$lib/email/nodemailer';
import { PUBLIC_GEOSCAPE_ADDRESS_API_KEY } from '$env/static/public';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const { locals: { supabase }, request } = event
	const body = await request.json();
	const {
		data,
		status,
		statusText,
		error
	} = await supabase.rpc('get_addresspoint_from_address', {
		address_text: body.streetAddress.toUpperCase(),
		given_suburb: body.suburb.toUpperCase(),
		out_srid_value: 7844,
		api_key: PUBLIC_GEOSCAPE_ADDRESS_API_KEY
	});
	if (status !== 200) {
		mailOptions.text = JSON.stringify(error, null, 2);
		mailOptions.subject = 'RPC get_addresspoint_from_address Error ' + new Date().toLocaleString()
		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				console.error('Error while sending Validate Address Challenge Error email: ', err);
			} else {
				console.log('Validate Address Challenge Error Email sent: ' + info.response);
			}
		});
	}
	let result: Response = json({
		addressdata: data,
		apistatus: status,
		apistatustext: statusText,
		apierror: error
	});
	return result;
};
