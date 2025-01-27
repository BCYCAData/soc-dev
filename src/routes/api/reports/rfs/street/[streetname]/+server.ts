import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateRfsStreetReport } from '$lib/server/pdf/templates/rfsStreetReport';

export const GET: RequestHandler = async (event) => {
	const {
		params,
		setHeaders,
		locals: { supabase, user }
	} = event;

	// Validate street name
	if (!params.streetname) {
		throw error(400, { message: 'Street name is required' });
	}

	// Fetch data
	const { data: propertyData, error: propertyError } = await supabase.rpc(
		'get_rfs_property_data_for_street',
		{ street_input: params.streetname }
	);

	if (propertyError) {
		console.log('propertyError', propertyError);
		throw error(500, { message: 'Error fetching property data' });
	}

	console.log('streetPropertyData', propertyData);

	if (!propertyData?.length) {
		throw error(404, { message: 'No properties found for this street' });
	}

	try {
		// Generate PDF
		console.log('Generating PDF report');
		const pdf = await generateRfsStreetReport({
			streetName: params.streetname,
			propertyData,
			generatedBy: user.email
		});
		console.log('pdf', pdf);
		// Set response headers
		setHeaders({
			'Content-Type': 'application/pdf',
			'Content-Length': pdf.size.toString(),
			'Content-Disposition': `attachment; filename="rfs_report_${params.streetname.toLowerCase().replace(/\s+/g, '_')}.pdf"`,
			'Cache-Control': 'private, max-age=0'
		});

		return new Response(pdf);
	} catch (e) {
		throw error(500, { message: 'Error generating PDF report' });
	}
};
