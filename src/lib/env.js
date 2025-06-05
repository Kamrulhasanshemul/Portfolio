import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';

// Environment configuration for portfolio
// Use SvelteKit's public env system that works in all deployment environments
export const ENV = {
	SUPABASE_URL: 
		env.PUBLIC_SUPABASE_URL || 
		'https://dttkwomsrqrjshuutiac.supabase.co',
	SUPABASE_KEY:
		env.PUBLIC_SUPABASE_KEY ||
		env.PUBLIC_SUPABASE_ANON_KEY ||
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dGt3b21zcnFyanNodXV0aWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzY0NzksImV4cCI6MjA2NDY1MjQ3OX0._xG1W5ZePSHUzUTWBufnjBTzgP6GTSbgY-a2z38T1yw'
};

if (dev) {
	console.log('Environment loaded:', {
		url: ENV.SUPABASE_URL,
		hasKey: !!ENV.SUPABASE_KEY
	});
}
