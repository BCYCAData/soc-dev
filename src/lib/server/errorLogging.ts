import type { SupabaseClient } from '@supabase/supabase-js';

type ErrorLogTable = 'address_validation_errors' | 'signup_errors' | 'signin_errors';

interface ErrorLogParams {
	errorType: string;
	errorMessage: string;
	errorDetails: any;
	clientIp: string;
	userAgent: string;
	status: number;
	metadata?: any;
	table: ErrorLogTable;
}

const logSignUpSignInError = async (
	supabase: SupabaseClient,
	{
		errorType,
		errorMessage,
		errorDetails,
		clientIp,
		userAgent,
		status,
		metadata,
		table
	}: ErrorLogParams
) => {
	const baseErrorData = {
		error_message: errorMessage || 'Unknown error',
		error_type: errorType || 'UNKNOWN_ERROR',
		error_details: errorDetails || {},
		user_agent: userAgent
	};

	const ipData = clientIp !== 'unknown' ? { client_ip: clientIp } : {};

	if (table === 'address_validation_errors') {
		await supabase.from(table).insert({
			...baseErrorData,
			...ipData,
			search_address_street: metadata?.searchaddressstreet || 'Unknown street',
			search_address_suburb: metadata?.searchaddresssuburb || 'Unknown suburb',
			validation_status: status
		});
	} else {
		console.log(`will update ${table} errors`, baseErrorData, ipData);
		await supabase.from(table).insert({
			...baseErrorData,
			...ipData,
			email: metadata?.email || 'unknown',
			http_status: status,
			metadata: metadata || {}
		});
	}
};

export { logSignUpSignInError, type ErrorLogParams, type ErrorLogTable };
