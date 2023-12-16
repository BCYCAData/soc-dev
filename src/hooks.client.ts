import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async ({ error, event }) => {
	console.log('HandleClientError error '), JSON.stringify(error);
	console.log('HandleClientError event '), event;
	return {
		message: 'Whoops'
	};
};
