import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async ({ error, event, message }) => {
	const e = await error;
	const ev = await event;
	console.log('HandleClientError error '), message;
	return {
		message: 'Whoops'
	};
};
