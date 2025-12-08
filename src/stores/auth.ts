import { writable, derived } from 'svelte/store';
import type { Session } from '@supabase/supabase-js';

// Session store (synced from server data only)
export const session = writable<Session | null>(null);

// Derived stores
export const user = derived(session, ($session) => $session?.user ?? null);
export const isAuthenticated = derived(session, ($session) => !!$session);

/**
 * Initialize session from server data.
 * Called from root layout after server load completes.
 */
export function initSession(serverSession: Session | null) {
	session.set(serverSession);
}
