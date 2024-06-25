import { SupabaseClient, Session, User } from '@supabase/supabase-js';
import type { Database } from '$lib/db.types';
declare global {
	declare namespace App {
		// interface Error {
		interface Locals {
			supabase: SupabaseClient<Database>;
			// getSupabaseUser(): Promise<UserResponse | null>;
			// getSession(): Promise<Session | null>;
			// getUser(): Promise<{ user: UserResponse | null }>;
			// safeGetSession(): Promise<{ session: Session | null; user: UserResponse | null }>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
			accessToken: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
