import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

// Use hardcoded creds if env vars fail in this context (same as before)
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'https://dttkwomsrqrjshuutiac.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseKey) {
	console.error(
		'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your .env before running this script.'
	);
	process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
	console.log('Running migration: Add is_featured to project_details...');

	// We can't easily alter table structure via client-side JS library without raw SQL support enabled or using rpc.
	// However, since we are in a dev environment, we might try to use a direct SQL execution if possible,
	// or just inform the user we need to run SQL.
	// BUT! Since we don't have direct SQL access in this environment easily without a proper migration tool,
	// and `supabase-js` doesn't do DDL (Data Definition Language).

	// Wait, I can try to use the `rpc` if a function exists, otherwise I have to ask the user to run SQL.
	// OR, I can try to just use valid SQL if I have a postgres connection. I don't.

	// Actually, I should probably check if I can 'fake' it or if I need to use the SQL editor.
	// Since I can't run SQL directly via the JS client unless I have a stored procedure for it.

	// Let's TRY to see if the column exists first.
	const { error } = await supabase.from('project_details').select('is_featured').limit(1);

	if (error && error.message.includes('column "is_featured" does not exist')) {
		console.log('Column missing. Please run this SQL in your Supabase SQL Editor:');
		console.log(`
        ALTER TABLE project_details 
        ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
        `);
	} else {
		console.log('Column likely exists or another error:', error?.message || 'No error');
	}
}

runMigration();
