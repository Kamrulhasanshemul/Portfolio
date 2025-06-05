import { supabase } from './supabase';
import type { BlogPost, BlogCategory } from './types/blog';

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: BlogPost; error?: string }> {
  try {
    // Generate slug from title if not provided
    if (!post.slug) {
      post.slug = generateSlug(post.title);
    }
    
    // Calculate reading time
    post.reading_time = calculateReadingTime(post.content);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        ...post,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: post.status === 'published' ? new Date().toISOString() : null
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { success: false, error: 'Failed to create blog post' };
  }
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<{ success: boolean; data?: BlogPost; error?: string }> {
  try {
    // Recalculate reading time if content changed
    if (updates.content) {
      updates.reading_time = calculateReadingTime(updates.content);
    }
    
    // Update published_at if status changed to published
    if (updates.status === 'published') {
      updates.published_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return { success: false, error: 'Failed to update blog post' };
  }
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return { success: false, error: 'Failed to delete blog post' };
  }
}

export async function getBlogPost(id: string): Promise<{ success: boolean; data?: BlogPost; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return { success: false, error: 'Failed to fetch blog post' };
  }
}

export async function getBlogPosts(options?: {
  category?: BlogCategory;
  status?: 'draft' | 'published' | 'archived';
  limit?: number;
  offset?: number;
}): Promise<{ success: boolean; data?: BlogPost[]; error?: string }> {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (options?.category) {
      query = query.eq('category', options.category);
    }

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching blog posts:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { success: false, error: 'Failed to fetch blog posts' };
  }
}

export async function getBlogPostBySlug(slug: string): Promise<{ success: boolean; data?: BlogPost; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching blog post by slug:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return { success: false, error: 'Failed to fetch blog post' };
  }
}

export async function incrementViews(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .rpc('increment_blog_views', { post_id: id });

    if (error) {
      console.error('Error incrementing views:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { success: false, error: 'Failed to increment views' };
  }
}

// Utility functions
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

export function calculateReadingTime(content: string): number {
  // Remove HTML tags and count words
  const plainText = content.replace(/<[^>]*>/g, '');
  const words = plainText.trim().split(/\s+/).length;
  
  // Average reading speed is about 200 words per minute
  const readingTime = Math.ceil(words / 200);
  
  return Math.max(1, readingTime); // Minimum 1 minute
}

export function truncateHtml(html: string, length: number = 150): string {
  // Remove HTML tags and truncate
  const plainText = html.replace(/<[^>]*>/g, '');
  
  if (plainText.length <= length) {
    return plainText;
  }
  
  return plainText.substring(0, length).trim() + '...';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 