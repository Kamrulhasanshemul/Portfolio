-- Blog Posts Table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('personal', 'travel', 'tech', 'journey', 'tutorial', 'review')),
  tags TEXT[] DEFAULT '{}',
  author VARCHAR(100) DEFAULT 'Admin',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured_image TEXT,
  meta_description TEXT,
  reading_time INTEGER DEFAULT 1,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Function to increment views
CREATE OR REPLACE FUNCTION increment_blog_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE blog_posts 
  SET views = views + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_blog_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published posts
CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- Policy for admin access (you might want to adjust this based on your authentication setup)
CREATE POLICY "Admin can manage all blog posts" ON blog_posts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- If you want to restrict admin access to authenticated users only, use this instead:
-- CREATE POLICY "Authenticated users can manage all blog posts" ON blog_posts
--   FOR ALL
--   USING (auth.uid() IS NOT NULL)
--   WITH CHECK (auth.uid() IS NOT NULL);

-- Insert sample blog posts
INSERT INTO blog_posts (
  title, 
  slug, 
  content, 
  excerpt, 
  category, 
  tags, 
  status,
  reading_time,
  published_at
) VALUES 
(
  'Getting Started with Data Analytics',
  'getting-started-data-analytics',
  '<h1>Introduction to Data Analytics</h1><p>Data analytics has become an essential skill in today''s data-driven world. In this comprehensive guide, we''ll explore the fundamentals of data analytics and how you can get started on your journey.</p><h2>What is Data Analytics?</h2><p>Data analytics is the process of examining datasets to draw conclusions about the information they contain. It involves applying an algorithmic or mechanical process to derive insights.</p><h3>Key Benefits</h3><ul><li>Better decision making</li><li>Improved efficiency</li><li>Cost reduction</li><li>Enhanced customer experience</li></ul><p>Let''s dive deeper into each of these areas...</p>',
  'Learn the fundamentals of data analytics and start your journey into the world of data-driven insights.',
  'tech',
  ARRAY['data analytics', 'tutorial', 'beginner'],
  'published',
  5,
  NOW()
),
(
  'My Journey into Data Science',
  'my-journey-data-science',
  '<h1>From Curiosity to Career</h1><p>Five years ago, I was working in a completely different field. Today, I''m passionate about turning data into actionable insights. Here''s my story...</p><p>It all started when I encountered a complex business problem that traditional methods couldn''t solve efficiently. That''s when I discovered the power of data science.</p><h2>The Learning Path</h2><p>My journey wasn''t linear, but it was rewarding. I started with online courses, moved to hands-on projects, and eventually transitioned to a full-time role in analytics.</p>',
  'A personal story about transitioning into data science and the lessons learned along the way.',
  'journey',
  ARRAY['career', 'personal story', 'data science'],
  'published',
  3,
  NOW() - INTERVAL '2 days'
),
(
  'Exploring Data Visualization in Remote Areas',
  'data-visualization-remote-areas',
  '<h1>When Data Meets Adventure</h1><p>Last month, I had the opportunity to conduct field research in a remote mountain village. The challenge? Creating meaningful data visualizations with limited internet connectivity and basic hardware.</p><p>This experience taught me valuable lessons about adaptability and the importance of offline data tools...</p>',
  'Lessons learned while creating data visualizations during field research in remote locations.',
  'travel',
  ARRAY['travel', 'field research', 'visualization'],
  'draft',
  4,
  NULL
);

-- Optional: Create a view for published posts with computed fields
CREATE VIEW published_blog_posts AS
SELECT 
  id,
  title,
  slug,
  content,
  excerpt,
  category,
  tags,
  author,
  featured_image,
  meta_description,
  reading_time,
  views,
  created_at,
  updated_at,
  published_at,
  CASE 
    WHEN published_at IS NOT NULL THEN published_at
    ELSE created_at
  END as sort_date
FROM blog_posts 
WHERE status = 'published'
ORDER BY sort_date DESC; 