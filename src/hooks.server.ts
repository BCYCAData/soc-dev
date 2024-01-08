import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_REDIRECT_URL_BASE
} from '$env/static/public';
// import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { createServerClient } from '@supabase/ssr';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' })
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' })
			},
		},
	})
	event.locals.supabaseRedirectBase = PUBLIC_SUPABASE_REDIRECT_URL_BASE;
	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession()
		return session
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
