#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🚀 Deploying with environment variables...');

try {
    // Set environment variables for the deployment
    const envVars = [
        'SUPABASE_URL=https://dttkwomsrqrjshuutiac.supabase.co',
        'SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dGt3b21zcnFyanNodXV0aWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzY0NzksImV4cCI6MjA2NDY1MjQ3OX0._xG1W5ZePSHUzUTWBufnjBTzgP6GTSbgY-a2z38T1yw',
        'DATABASE_URL=postgresql://postgres:KUdLGMCaQ5lX9hH4@db.dttkwomsrqrjshuutiac.supabase.co:5432/postgres',
        'SESSION_SECRET=uvmgC25nMo4joDO9txt4zI+ZFN0vw5G1QQiapL40vS4='
    ];

    // Deploy using wrangler
    const deployCmd = `npx wrangler pages deploy .svelte-kit/cloudflare --project-name portfolio`;
    
    console.log('Running deployment...');
    const result = execSync(deployCmd, { 
        stdio: 'inherit',
        env: {
            ...process.env,
            ...Object.fromEntries(envVars.map(v => v.split('=')))
        }
    });
    
    console.log('✅ Deployment completed successfully!');
    
} catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
} 