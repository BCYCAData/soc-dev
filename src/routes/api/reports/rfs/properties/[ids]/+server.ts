import { json } from '@sveltejs/kit';
import { generateRfsPropertyReport } from '$lib/server/pdf/templates/rfsPropertyReport';

export async function GET({ params, locals: { supabase } }) {
	const propertyIds = JSON.parse(decodeURIComponent(params.ids));

	// Get property data
	const { data: propertyData, error: propertyError } = await supabase.rpc(
		'get_rfs_user_data_for_porperties',
		{ property_ids: propertyIds }
	);

	if (propertyError) {
		return json({ error: propertyError.message }, { status: 400 });
	}
	console.log('propertyPropertyData:', propertyData);
	// Generate PDF
	const pdfBlob = await generateRfsPropertyReport({
		propertyData,
		generatedBy: 'Admin User' // You may want to pass the actual user info here
	});

	return new Response(pdfBlob, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename="property_report.pdf"'
		}
	});
}
