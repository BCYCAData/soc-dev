import { json, type RequestHandler } from '@sveltejs/kit';
import { generateRfsPropertyReport } from '$lib/server/pdf/templates/rfsPropertyReport';

export const GET: RequestHandler = async ({ params, locals: { supabase }, fetch }) => {
	const propertyIds = params.ids ? JSON.parse(decodeURIComponent(params.ids)) : [];

	// Get property data
	const { data: propertyData, error: propertyError } = await supabase.rpc(
		'get_rfs_user_data_for_porperties',
		{ property_ids: propertyIds }
	);

	if (propertyError) {
		return json({ error: propertyError.message }, { status: 400 });
	}
	console.log('ropertyData:', propertyData);
	// Generate PDF
	const pdfBlob = await generateRfsPropertyReport({
		propertyData,
		generatedBy: 'Admin User', // You may want to pass the actual user info here
		fetch: fetch
	});

	return new Response(pdfBlob, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename="property_report.pdf"'
		}
	});
};
