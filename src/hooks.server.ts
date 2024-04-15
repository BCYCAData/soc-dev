import { createServerClient } from '@supabase/ssr';
// import { jwtDecode } from 'jwt-decode';

import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_REDIRECT_URL_BASE
} from '$env/static/public';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			/**
			 * Note: You have to add the `path` variable to the
			 * set and remove method due to sveltekit's cookie API
			 * requiring this to be set, setting the path to an empty string
			 * will replicate previous/standard behaviour (https://kit.svelte.dev/docs/types#public-types-cookies)
			 */
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});
	event.locals.supabaseRedirectBase = PUBLIC_SUPABASE_REDIRECT_URL_BASE;

	event.locals.accessToken = JSON.parse(event.cookies.getAll()[0].value).access_token;
	event.locals.getUser = async () => {
		const {
			data: { user }
		} = await event.locals.supabase.auth.getUser();
		return { user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
