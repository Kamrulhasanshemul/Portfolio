// Environment configuration for portfolio
export const ENV = {
	SUPABASE_URL: process.env.SUPABASE_URL || 'https://dttkwomsrqrjshuutiac.supabase.co',
	SUPABASE_KEY:
		process.env.SUPABASE_KEY ||
		process.env.SUPABASE_ANON_KEY ||
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dGt3b21zcnFyanNodXV0aWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzY0NzksImV4cCI6MjA2NDY1MjQ3OX0._xG1W5ZePSHUzUTWBufnjBTzgP6GTSbgY-a2z38T1yw'
};

console.log('Environment loaded:', {
	url: ENV.SUPABASE_URL,
	hasKey: !!ENV.SUPABASE_KEY
});
