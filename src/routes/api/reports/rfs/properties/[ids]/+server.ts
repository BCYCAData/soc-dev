import { error, json, type RequestHandler } from '@sveltejs/kit';

import { generateRfsPropertyReport } from '$lib/server/pdf/templates/rfsPropertyReport';
import { requirePermission } from '$lib/server/auth/apiGuard';

export const GET: RequestHandler = async (event) => {
	await requirePermission(event, 'admin.emergency.reports');

	const {
		params,
		locals: { supabase },
		fetch
	} = event;

	let propertyIds: unknown;
	try {
		propertyIds = params.ids ? JSON.parse(decodeURIComponent(params.ids)) : [];
	} catch {
		throw error(400, 'Invalid property ids');
	}
	if (!Array.isArray(propertyIds)) {
		throw error(400, 'Property ids must be an array');
	}

	// Get property data
	const { data: propertyData, error: propertyError } = await supabase.rpc(
		'get_rfs_user_data_for_porperties',
		{ property_ids: propertyIds }
	);

	if (propertyError) {
		return json({ error: propertyError.message }, { status: 400 });
	}

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
