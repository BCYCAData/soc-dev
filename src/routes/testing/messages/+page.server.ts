import type { Actions } from './$types';

export const actions: Actions = {
	login: async (event) => {
		console.log('login');
	},
	register: async (event) => {
		console.log('register');
	}
};
