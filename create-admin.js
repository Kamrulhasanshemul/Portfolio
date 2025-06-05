import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dttkwomsrqrjshuutiac.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dGt3b21zcnFyanNodXV0aWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzY0NzksImV4cCI6MjA2NDY1MjQ3OX0._xG1W5ZePSHUzUTWBufnjBTzgP6GTSbgY-a2z38T1yw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    try {
        console.log('Creating admin user...');
        
        // Hash the password
        const password = 'admin123';
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        console.log('Password hashed successfully');
        
        // Delete existing admin if exists
        const { error: deleteError } = await supabase
            .from('admin_users')
            .delete()
            .eq('username', 'admin');
            
        if (deleteError && deleteError.code !== 'PGRST116') {
            console.warn('Warning deleting existing admin:', deleteError);
        }
        
        // Create new admin user
        const { data, error } = await supabase
            .from('admin_users')
            .insert({
                username: 'admin',
                email: 'admin@portfolio.local',
                password_hash: hashedPassword,
                role: 'admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
            
        if (error) {
            console.error('Error creating admin:', error);
            process.exit(1);
        }
        
        console.log('✅ Admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Admin data:', data);
        
        // Test authentication
        console.log('\n🔍 Testing authentication...');
        const isMatch = await bcrypt.compare(password, hashedPassword);
        console.log('Password verification test:', isMatch ? '✅ PASS' : '❌ FAIL');
        
        process.exit(0);
        
    } catch (error) {
        console.error('Failed to create admin:', error);
        process.exit(1);
    }
}

createAdmin(); 