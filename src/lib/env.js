import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';

// Environment configuration for portfolio
// Use SvelteKit's public env system that works in all deployment environments
export const ENV = {
	SUPABASE_URL: env.PUBLIC_SUPABASE_URL || 'https://dttkwomsrqrjshuutiac.supabase.co',
	SUPABASE_KEY: env.PUBLIC_SUPABASE_KEY || env.PUBLIC_SUPABASE_ANON_KEY || ''
};

if (dev) {
	console.log('Environment loaded:', {
		url: ENV.SUPABASE_URL,
		hasKey: !!ENV.SUPABASE_KEY
	});
}
