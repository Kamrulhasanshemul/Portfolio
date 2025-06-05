#!/usr/bin/env node

import { writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '.env');

const envContent = `# Supabase Configuration
SUPABASE_URL=https://dttkwomsrqrjshuutiac.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dGt3b21zcnFyanNodXV0aWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzY0NzksImV4cCI6MjA2NDY1MjQ3OX0._xG1W5ZePSHUzUTWBufnjBTzgP6GTSbgY-a2z38T1yw

# Session Configuration  
SESSION_SECRET=uvmgC25nMo4joDO9txt4zI+ZFN0vw5G1QQiapL40vS4=

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
`;

try {
	if (!existsSync(envPath)) {
		writeFileSync(envPath, envContent);
		console.log('✅ .env file created successfully');
		console.log('🔧 Environment variables configured for Supabase');
	} else {
		console.log('ℹ️  .env file already exists');
	}

	// Set environment variables for current process
	process.env.SUPABASE_URL = 'https://dttkwomsrqrjshuutiac.supabase.co';
	process.env.SUPABASE_KEY =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dGt3b21zcnFyanNodXV0aWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzY0NzksImV4cCI6MjA2NDY1MjQ3OX0._xG1W5ZePSHUzUTWBufnjBTzgP6GTSbgY-a2z38T1yw';
	process.env.SESSION_SECRET = 'uvmgC25nMo4joDO9txt4zI+ZFN0vw5G1QQiapL40vS4=';

	console.log('🚀 Ready to start the portfolio server');
	console.log('💡 Run: npm run preview');
} catch (error) {
	console.error('❌ Error setting up environment:', error);
	process.exit(1);
}
