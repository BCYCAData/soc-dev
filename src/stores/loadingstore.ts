import { writable, get } from 'svelte/store';

interface LoadingStore {
	subscribe: (run: (value: boolean) => void) => () => void;
	set: (value: boolean) => void;
	get: () => boolean;
}

const loading = writable<boolean>(false);

export const setLoading = (value: boolean) => loading.set(value);
export const getLoading = () => get(loading);

export default {
	...loading,
	get: getLoading
} as LoadingStore;
