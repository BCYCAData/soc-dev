import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { combineChunks, createBrowserClient, isBrowser, parse } from '@supabase/ssr';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');
	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		global: {
			fetch
		},
		cookies: {
			get(key) {
				if (!isBrowser()) {
					return JSON.stringify(data.session);
				}
				const cookie = combineChunks(key, (name) => {
					const cookies = parse(document.cookie);
					return cookies[name];
				});
				return cookie;
				// const cookie = parse(document.cookie)
				// return cookie[key]
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { supabase, session };
};

// In my layout.ts I call superValidate with the schema, but the data doesn't yet have a way of knowing what to populate the form with:
// // layout.ts
// const captionForm = await superValidate(captionFormSchema)

// return { captionForm }

// So it's picked up by the page(s) and passed to the modal:
// 	// page.svelte

// ciscoheat — 12 / 15 / 2023 2:02 PM
// When you pass captionForm to the component, overwrite its data property with the spread operator(edited)
// [2:03 PM]
// <Modal captionForm={ {...data.captionForm, data: newData } } />
