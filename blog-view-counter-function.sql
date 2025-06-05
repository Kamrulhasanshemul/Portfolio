-- Blog View Counter Function
-- Run this in your Supabase SQL Editor

-- Create function to increment blog post views
CREATE OR REPLACE FUNCTION increment_blog_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE blog_posts 
    SET views = COALESCE(views, 0) + 1,
        updated_at = NOW()
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_blog_views(UUID) TO authenticated;

-- Grant execute permission to anonymous users (for public blog viewing)
GRANT EXECUTE ON FUNCTION increment_blog_views(UUID) TO anon; 