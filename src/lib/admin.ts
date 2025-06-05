import { ContentService } from './supabase';
import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'editor';
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export class AdminService {
  
  // Create admin users table
  static async initializeAdminTable() {
    try {
      console.log('Creating admin_users table...');
      
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: `
          -- Create admin_users table
          CREATE TABLE IF NOT EXISTS admin_users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            last_login TIMESTAMP WITH TIME ZONE
          );
          
          -- Create index on username and email
          CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
          CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
          
          -- Create update trigger
          CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
          RETURNS TRIGGER AS $$
          BEGIN
              NEW.updated_at = NOW();
              RETURN NEW;
          END;
          $$ language 'plpgsql';
          
          DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
          CREATE TRIGGER update_admin_users_updated_at
              BEFORE UPDATE ON admin_users
              FOR EACH ROW
              EXECUTE FUNCTION update_admin_users_updated_at();
        `
      });
      
      if (error) {
        console.error('Error creating admin table:', error);
        return false;
      }
      
      console.log('✅ Admin users table created successfully');
      return true;
      
    } catch (err) {
      console.error('Error initializing admin table:', err);
      return false;
    }
  }
  
  // Create default admin user
  static async createDefaultAdmin() {
    try {
      // Check if admin already exists
      const { data: existing } = await supabase
        .from('admin_users')
        .select('id')
        .eq('username', 'admin')
        .limit(1);
      
      if (existing && existing.length > 0) {
        console.log('✅ Default admin user already exists');
        return true;
      }
      
      // Hash default password
      const passwordHash = await bcrypt.hash('admin123', 12);
      
      // Create default admin user
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          username: 'admin',
          email: 'admin@portfolio.local',
          password_hash: passwordHash,
          role: 'admin'
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating default admin:', error);
        return false;
      }
      
      console.log('✅ Default admin user created successfully');
      console.log('📋 Login credentials:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      
      return true;
      
    } catch (err) {
      console.error('Error creating default admin:', err);
      return false;
    }
  }
  
  // Authenticate admin user
  static async authenticateAdmin(username: string, password: string) {
    try {
      // Get user by username
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error || !user) {
        return { success: false, message: 'Invalid username or password' };
      }
      
      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isValid) {
        return { success: false, message: 'Invalid username or password' };
      }
      
      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);
      
      // Remove password hash from returned data
      const { password_hash, ...userWithoutPassword } = user;
      
      return { 
        success: true, 
        user: userWithoutPassword,
        message: 'Authentication successful'
      };
      
    } catch (err) {
      console.error('Authentication error:', err);
      return { success: false, message: 'Authentication failed' };
    }
  }
  
  // Create new admin user
  static async createAdmin(userData: {
    username: string;
    email: string;
    password: string;
    role?: 'admin' | 'editor';
  }) {
    try {
      // Check if username or email already exists
      const { data: existing } = await supabase
        .from('admin_users')
        .select('username, email')
        .or(`username.eq.${userData.username},email.eq.${userData.email}`);
      
      if (existing && existing.length > 0) {
        const conflict = existing[0].username === userData.username ? 'username' : 'email';
        return { success: false, message: `${conflict} already exists` };
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);
      
      // Create new admin user
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          username: userData.username,
          email: userData.email,
          password_hash: passwordHash,
          role: userData.role || 'admin'
        })
        .select('id, username, email, role, created_at')
        .single();
      
      if (error) {
        console.error('Error creating admin user:', error);
        return { success: false, message: 'Failed to create admin user' };
      }
      
      return { success: true, user: data, message: 'Admin user created successfully' };
      
    } catch (err) {
      console.error('Error creating admin:', err);
      return { success: false, message: 'Failed to create admin user' };
    }
  }
  
  // List all admin users
  static async getAdminUsers() {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, username, email, role, created_at, updated_at, last_login')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching admin users:', error);
        return { success: false, users: [] };
      }
      
      return { success: true, users: data || [] };
      
    } catch (err) {
      console.error('Error getting admin users:', err);
      return { success: false, users: [] };
    }
  }
  
  // Update admin user
  static async updateAdmin(id: string, updates: {
    username?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'editor';
  }) {
    try {
      const updateData: any = {};
      
      if (updates.username) updateData.username = updates.username;
      if (updates.email) updateData.email = updates.email;
      if (updates.role) updateData.role = updates.role;
      
      if (updates.password) {
        updateData.password_hash = await bcrypt.hash(updates.password, 12);
      }
      
      const { data, error } = await supabase
        .from('admin_users')
        .update(updateData)
        .eq('id', id)
        .select('id, username, email, role, updated_at')
        .single();
      
      if (error) {
        console.error('Error updating admin user:', error);
        return { success: false, message: 'Failed to update admin user' };
      }
      
      return { success: true, user: data, message: 'Admin user updated successfully' };
      
    } catch (err) {
      console.error('Error updating admin:', err);
      return { success: false, message: 'Failed to update admin user' };
    }
  }
  
  // Delete admin user
  static async deleteAdmin(id: string) {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting admin user:', error);
        return { success: false, message: 'Failed to delete admin user' };
      }
      
      return { success: true, message: 'Admin user deleted successfully' };
      
    } catch (err) {
      console.error('Error deleting admin:', err);
      return { success: false, message: 'Failed to delete admin user' };
    }
  }
} 