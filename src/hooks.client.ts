import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async ({ error, event, message }) => {
	const e = await error;
	const ev = event;
	console.log('HandleClientError error ', e, event, message);
	return {
		message: 'Whoops'
	};
};
