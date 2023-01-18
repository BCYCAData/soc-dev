import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Session } from '@supabase/supabase-js';

declare global {
	declare namespace App {
		// interface Error {}
		interface Locals {
			dbClient: TypedSupabaseClient;
			session: Session | null;
			supabaseRedirectBase: String | null;
		}
		interface PageData {
			session: import('@supabase/supabase-js').Session | null;
		}
		// interface Platform {}
	}
}
