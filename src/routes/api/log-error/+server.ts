import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Receives client-side handleError reports and records them in app_errors.
 * Intentionally unauthenticated (client errors can happen pre-auth); payload
 * fields are length-capped and the table is INSERT-only for app roles.
 */
export const POST: RequestHandler = async (event) => {
	let payload: Record<string, unknown>;
	try {
		payload = await event.request.json();
	} catch {
		return json({ ok: false }, { status: 400 });
	}

	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser();

	const { error } = await event.locals.supabase.from('app_errors').insert({
		source: 'client',
		status: typeof payload.status === 'number' ? payload.status : null,
		message: String(payload.message ?? 'Unknown client error').slice(0, 2000),
		stack: payload.stack ? String(payload.stack).slice(0, 8000) : null,
		url: payload.url ? String(payload.url).slice(0, 500) : null,
		user_id: user?.id ?? null,
		user_agent: event.request.headers.get('user-agent')?.slice(0, 500) ?? null
	});

	if (error) {
		console.error('Failed to record client error:', error);
		return json({ ok: false }, { status: 500 });
	}
	return json({ ok: true });
};
