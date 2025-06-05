import { config } from 'dotenv';

// Load environment variables
config();

console.log('🚀 Initializing Portfolio Database');
console.log('===================================');

async function initializeDatabase() {
    try {
        console.log('📋 Setting up database tables and admin user...');
        
        // Initialize admin system via API
        const response = await fetch('http://localhost:4173/api/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'initialize'
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅', result.message);
            
            console.log('');
            console.log('🎉 Database initialization completed!');
            console.log('');
            console.log('📋 What was created:');
            console.log('   • portfolio_content table with default data');
            console.log('   • admin_users table with default admin');
            console.log('');
            console.log('🔑 Default login credentials:');
            console.log('   Username: admin');
            console.log('   Password: admin123');
            console.log('');
            console.log('🚀 Next steps:');
            console.log('   1. Visit: http://localhost:4173/admin');
            console.log('   2. Login with the credentials above');
            console.log('   3. Start managing your portfolio content!');
            
        } else {
            const error = await response.json();
            console.error('❌ Error:', error.error);
            
            console.log('');
            console.log('📝 Manual Setup Instructions:');
            console.log('=============================');
            console.log('1. Go to your Supabase dashboard');
            console.log('2. Navigate to SQL Editor');
            console.log('3. Copy and paste the contents of complete-database-setup.sql');
            console.log('4. Run the SQL script');
            console.log('5. Restart your server: npm run preview');
        }
        
    } catch (err) {
        console.error('❌ Connection error:', err.message);
        
        console.log('');
        console.log('📝 Please ensure:');
        console.log('=================');
        console.log('1. Your server is running (npm run preview)');
        console.log('2. Your .env file has correct Supabase credentials');
        console.log('3. Your Supabase database is accessible');
        console.log('');
        console.log('Or setup manually using complete-database-setup.sql');
    }
}

// Check if server is running first
async function checkServer() {
    try {
        const response = await fetch('http://localhost:4173/', { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

async function main() {
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
        console.log('⚠️  Server not running on http://localhost:4173');
        console.log('');
        console.log('🚀 Please start your server first:');
        console.log('   npm run preview');
        console.log('');
        console.log('🗄️  Or setup database manually:');
        console.log('   1. Go to Supabase Dashboard > SQL Editor');
        console.log('   2. Run the script: complete-database-setup.sql');
        process.exit(1);
    }
    
    await initializeDatabase();
}

main().catch(console.error); 