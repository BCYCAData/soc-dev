import { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/db.types';

declare module 'svelte-headless-table/createTable';
declare module 'leaflet-image';
declare module 'leaflet-graphicscale';
declare global {
	declare namespace App {
		// interface Error {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSupabaseUser(): Promise<UserResponse | null>;
			getSession(): Promise<Session | null>;
			safeGetSession(): Promise<{ session: Session | null; user: UserResponse | null }>;
			supabaseRedirectBase: string | null;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Platform {}
	}
}
