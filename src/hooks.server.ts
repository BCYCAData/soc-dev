import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

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
	/**
	 * Retrieves the user data asynchronously.
	 *
	 * @return {Promise<{ user: UserResponse }>} The user data
	 */
	event.locals.getUser = async (): Promise<{ user: User | null }> => {
		const {
			data: { user }
		} = await event.locals.supabase.auth.getUser();
		return { user };
	};

	return resolve(event, {
		/**
		 * Filters the serialized response headers based on the given name.
		 *
		 * @param {string} name - The name of the header to filter.
		 * @returns {boolean} Returns true if the header name matches 'content-range', otherwise false.
		 */
		filterSerializedResponseHeaders(name: string): name is 'content-range' {
			return name === 'content-range';
		}
	});
};
