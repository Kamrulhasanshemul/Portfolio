#!/usr/bin/env node

import { writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';

// Write the .env to the project root (this script lives in scripts/)
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(projectRoot, '.env');

// Variable names must match what the app reads:
// - PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_KEY  (src/lib/env.js)
// - SUPABASE_SERVICE_ROLE_KEY                  (src/lib/server/supabase.ts)
// - SESSION_SECRET                             (src/lib/server/auth.ts)
const envContent = `# Supabase Configuration
PUBLIC_SUPABASE_URL=https://dttkwomsrqrjshuutiac.supabase.co
PUBLIC_SUPABASE_KEY=your-supabase-anon-key

# Server-only: service role key (never expose to the client)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Session Configuration (randomly generated)
SESSION_SECRET=${randomBytes(32).toString('base64')}
`;

try {
	if (!existsSync(envPath)) {
		writeFileSync(envPath, envContent);
		console.log('✅ .env file created at project root');
		console.log('🔧 Fill in your Supabase keys before starting the server');
	} else {
		console.log('ℹ️  .env file already exists');
	}
} catch (error) {
	console.error('❌ Error setting up environment:', error);
	process.exit(1);
}
