import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { LayoutServerLoad } from './$types';
import { requireUser } from '$lib/server/auth/apiGuard';

// Development-only scaffolding under /dev. Never expose in production, and
// require an authenticated user even in development.
export const load: LayoutServerLoad = async (event) => {
	if (!dev) {
		throw error(404, 'Not found');
	}
	await requireUser(event);
};
