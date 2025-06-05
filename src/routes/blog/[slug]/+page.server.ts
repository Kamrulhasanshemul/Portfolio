import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { slug } = params;

  try {
    // Fetch blog post
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (postError || !post) {
      throw error(404, 'Blog post not found');
    }

    // Increment view count
    await supabase.rpc('increment_blog_views', { post_id: post.id });

    // Get related posts (same category, excluding current post)
    const { data: relatedPosts } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image, reading_time, published_at, created_at')
      .eq('category', post.category)
      .eq('status', 'published')
      .neq('id', post.id)
      .order('published_at', { ascending: false })
      .limit(3);

    return {
      post,
      relatedPosts: relatedPosts || []
    };
  } catch (err) {
    console.error('Error fetching blog post:', err);
    throw error(404, 'Blog post not found');
  }
}; 