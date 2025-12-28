import { createClient } from '@supabase/supabase-js';
import { ENV } from '$lib/env';
import { env } from '$env/dynamic/private';

// Use the service role key to bypass RLS
const supabaseUrl = ENV.SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

// Create a server-side Supabase client with the service role key
// access to the service role key is strictly limited to server-side code
export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey || ENV.SUPABASE_KEY // Fallback to anon key if service key is missing (restricted access)
);
