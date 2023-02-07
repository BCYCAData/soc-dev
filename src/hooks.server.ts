import '$lib/dbClient';
import { supabaseRedirectBase } from '$lib/dbClient';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const { session, supabaseClient } = await getSupabase(event);
	event.locals.dbClient = supabaseClient;
	event.locals.session = session;
	event.locals.supabaseRedirectBase = supabaseRedirectBase;
	return resolve(event);
};
