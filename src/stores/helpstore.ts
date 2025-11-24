import { writable } from 'svelte/store';
import type { HelpContent } from '$lib/types';

// Create a writable store with initial empty help content
export const helpContent = writable<HelpContent>({
	hasHelp: false,
	content: '',
	title: ''
});
