import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const page = parseInt(url.searchParams.get('page') || '1');
  const category = url.searchParams.get('category') || '';
  const limit = 6;
  const offset = (page - 1) * limit;

  try {
    // Build query
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // Add category filter if specified
    if (category) {
      query = query.eq('category', category);
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    if (category) {
      countQuery = countQuery.eq('category', category);
    }

    const { count } = await countQuery;

    // Get posts with pagination
    const { data: posts, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching blog posts:', error);
      return {
        posts: [],
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
        category: category
      };
    }

    const totalPages = Math.ceil((count || 0) / limit);

    // Get categories for filter
    const { data: categories } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

    return {
      posts: posts || [],
      categories: categories || [],
      totalCount: count || 0,
      currentPage: page,
      totalPages,
      category: category
    };
  } catch (err) {
    console.error('Error loading blog posts:', err);
    return {
      posts: [],
      categories: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      category: category
    };
  }
}; 