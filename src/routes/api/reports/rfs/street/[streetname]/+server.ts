// import { json } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';

// export const GET: RequestHandler = async ({ params }) => {
// 	const { streetname } = params;

// 	return json(streetname);
// };

import { error } from '@sveltejs/kit';
import generateRfsStreetReport from '$lib/server/pdf/generateRfsStreetReport';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({
	params,
	setHeaders,
	locals: { supabase, getSession }
}) => {
	debugger;
	const session = await getSession();
	if (
		!session?.user.app_metadata.app_metadata?.roles?.includes('tester') &&
		!session?.user?.app_metadata?.roles?.includes('admin')
	) {
		// the user is not authorised
		throw error(401, { message: 'Unauthorised' });
	}
	if (!params.streetname) {
		throw error(404, {
			message: 'Street not found'
		});
	}
	const { data: propertyData, error: propertyError } = await supabase.rpc(
		'get_rfs_property_data_for_street',
		{
			street_input: params.streetname
		}
	);

	const pdf = await generateRfsStreetReport(params.streetname, propertyData);
	setHeaders({
		'Content-Type': 'application/pdf',
		'Content-Length': pdf.size.toString(),
		'Last-Modified': new Date().toUTCString(),
		'Cache-Control': 'public, max-age=600'
	});

	return new Response(pdf);
};
