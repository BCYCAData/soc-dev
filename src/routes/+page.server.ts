import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { addressUnChallengedSchema } from '$lib/zod-schemas';

export const load: PageServerLoad = async () => {
	const form = await superValidate(addressUnChallengedSchema);
	return { form };
};
