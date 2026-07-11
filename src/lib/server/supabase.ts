import { createClient } from '@supabase/supabase-js';
import { dev } from '$app/environment';
import { ENV } from '$lib/env';
import { env } from '$env/dynamic/private';

// Use the service role key to bypass RLS
const supabaseUrl = ENV.SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey && !dev) {
	console.warn(
		'WARNING: SUPABASE_SERVICE_ROLE_KEY is missing. Admin operations may fail due to RLS.'
	);
}

// Create a server-side Supabase client with the service role key
// access to the service role key is strictly limited to server-side code
export const supabaseAdmin = createClient(
	supabaseUrl,
	supabaseServiceKey || ENV.SUPABASE_KEY || 'missing-service-key', // Fallback to anon key if service key is missing; placeholder keeps module load from throwing during build
	{
		auth: {
			persistSession: false,
			autoRefreshToken: false,
			detectSessionInUrl: false
		}
	}
);
