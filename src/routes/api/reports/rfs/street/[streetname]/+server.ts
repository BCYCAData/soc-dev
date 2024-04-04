import { error } from '@sveltejs/kit';
import generateRfsStreetReport from '$lib/server/pdf/generateRfsStreetReport';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const {
		params,
		setHeaders,
		locals: { supabase, safeGetSession }
	} = event;
	const session = await safeGetSession();
	if (
		!session?.user.app_metadata.app_metadata?.roles?.includes('tester') &&
		!session?.user?.app_metadata?.roles?.includes('admin')
	) {
		// the user is not authorised
		error(401, { message: 'Unauthorised' });
	}
	if (!params.streetname) {
		error(404, {
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
