import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

// Supabase configuration
const supabaseUrl = env.SUPABASE_URL || 'https://dttkwomsrqrjshuutiac.supabase.co';
const supabaseAnonKey = env.SUPABASE_ANON_KEY || 'your_supabase_anon_key_here';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema for content table
export interface ContentRow {
  id: number;
  content_data: any; // JSON field
  created_at: string;
  updated_at: string;
}

// Content operations
export class ContentService {
  
  // Get content from database
  static async getContent() {
    try {
      const { data, error } = await supabase
        .from('portfolio_content')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error fetching content:', error);
        return null;
      }

      return data?.content_data || null;
    } catch (err) {
      console.error('Unexpected error fetching content:', err);
      return null;
    }
  }

  // Save content to database
  static async saveContent(content: any) {
    try {
      // First, try to get existing content
      const { data: existing } = await supabase
        .from('portfolio_content')
        .select('id')
        .limit(1)
        .single();

      if (existing) {
        // Update existing content
        const { data, error } = await supabase
          .from('portfolio_content')
          .update({
            content_data: content,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating content:', error);
          return { success: false, error };
        }

        return { success: true, data: data.content_data };
      } else {
        // Create new content
        const { data, error } = await supabase
          .from('portfolio_content')
          .insert({
            content_data: content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating content:', error);
          return { success: false, error };
        }

        return { success: true, data: data.content_data };
      }
    } catch (err) {
      console.error('Unexpected error saving content:', err);
      return { success: false, error: err };
    }
  }

  // Initialize database table (run once)
  static async initializeTable() {
    try {
      // Create table if it doesn't exist
      const { error } = await supabase.rpc('create_portfolio_content_table');
      
      if (error && !error.message.includes('already exists')) {
        console.error('Error creating table:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error initializing table:', err);
      return false;
    }
  }
} 