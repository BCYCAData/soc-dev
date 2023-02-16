import { createClient } from '@supabase/auth-helpers-sveltekit';
import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_REDIRECT_URL_BASE
} from '$env/static/public';

export const supabaseRedirectBase = PUBLIC_SUPABASE_REDIRECT_URL_BASE;

export const supabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
