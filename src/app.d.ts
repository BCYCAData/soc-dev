import { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/db.types';
declare module 'svelte-headless-table/createTable';
declare global {
	declare namespace App {
		// interface Error {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
			supabaseRedirectBase: String | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Platform {}
	}
}
