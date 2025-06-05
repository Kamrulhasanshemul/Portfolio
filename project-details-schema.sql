-- Enhanced Project Details Schema
-- Run this in your Supabase SQL Editor

-- =============================================================================
-- 1. PROJECT DETAILS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS project_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    technologies JSONB DEFAULT '[]'::jsonb,
    category VARCHAR(50) NOT NULL CHECK (category IN ('web-app', 'mobile-app', 'data-analytics', 'api', 'saas', 'other')),
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    
    -- Links and External Resources
    github_url TEXT,
    live_demo_url TEXT,
    case_study_url TEXT,
    
    -- Media Content
    featured_image TEXT,
    images JSONB DEFAULT '[]'::jsonb, -- Array of image objects with caption, alt text
    videos JSONB DEFAULT '[]'::jsonb, -- Array of video objects with title, url, type
    
    -- Project Details
    client_name VARCHAR(255),
    project_duration VARCHAR(100), -- e.g., "3 months", "6 weeks"
    team_size INTEGER,
    my_role TEXT,
    
    -- Impact and Results
    key_features JSONB DEFAULT '[]'::jsonb, -- Array of feature objects
    challenges_solved JSONB DEFAULT '[]'::jsonb, -- Array of challenge objects
    results_achieved JSONB DEFAULT '[]'::jsonb, -- Array of result objects with metrics
    
    -- SEO and Metadata
    meta_description TEXT,
    meta_keywords TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    project_date DATE -- When the project was actually completed
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_details_status ON project_details(status);
CREATE INDEX IF NOT EXISTS idx_project_details_category ON project_details(category);
CREATE INDEX IF NOT EXISTS idx_project_details_slug ON project_details(slug);
CREATE INDEX IF NOT EXISTS idx_project_details_project_date ON project_details(project_date DESC);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_project_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_project_details_updated_at ON project_details;
CREATE TRIGGER update_project_details_updated_at
    BEFORE UPDATE ON project_details
    FOR EACH ROW
    EXECUTE FUNCTION update_project_details_updated_at();

-- =============================================================================
-- 2. PROJECT TESTIMONIALS TABLE (Optional)
-- =============================================================================

CREATE TABLE IF NOT EXISTS project_testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES project_details(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_title VARCHAR(255),
    client_company VARCHAR(255),
    client_image TEXT,
    testimonial_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 3. BLOG CATEGORIES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Technology', 'tech', 'Technical tutorials, programming tips, and development insights', '#3B82F6'),
('Career Journey', 'journey', 'Personal stories about career development and growth', '#10B981'),
('Travel & Remote Work', 'travel', 'Adventures in remote work and digital nomad experiences', '#F59E0B'),
('Personal Thoughts', 'personal', 'Personal reflections and life experiences', '#8B5CF6'),
('Tutorials', 'tutorial', 'Step-by-step guides and educational content', '#EF4444'),
('Product Reviews', 'review', 'Reviews of tools, software, and tech products', '#6B7280')
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS for project_details
ALTER TABLE project_details ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to published projects
CREATE POLICY "Public can view published projects" ON project_details
  FOR SELECT
  USING (status = 'published');

-- Policy for admin access
CREATE POLICY "Admin can manage all projects" ON project_details
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable RLS for testimonials
ALTER TABLE project_testimonials ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to testimonials
CREATE POLICY "Public can view testimonials" ON project_testimonials
  FOR SELECT
  USING (true);

-- Policy for admin access to testimonials
CREATE POLICY "Admin can manage testimonials" ON project_testimonials
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable RLS for blog categories
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to blog categories
CREATE POLICY "Public can view blog categories" ON blog_categories
  FOR SELECT
  USING (true);

-- Policy for admin access to blog categories
CREATE POLICY "Admin can manage blog categories" ON blog_categories
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 5. DEMO PROJECT DATA
-- =============================================================================

INSERT INTO project_details (
    title,
    slug,
    short_description,
    full_description,
    technologies,
    category,
    status,
    github_url,
    live_demo_url,
    featured_image,
    images,
    videos,
    client_name,
    project_duration,
    team_size,
    my_role,
    key_features,
    challenges_solved,
    results_achieved,
    meta_description,
    meta_keywords,
    project_date
) VALUES
(
    'E-commerce Analytics Platform',
    'ecommerce-analytics-platform',
    'Built a comprehensive analytics platform for an e-commerce company tracking 500K+ monthly transactions with real-time insights, predictive analytics, and automated reporting.',
    '<h1>E-commerce Analytics Platform</h1>
    <p>This project involved building a comprehensive analytics platform for a mid-sized e-commerce company that was struggling to make sense of their growing data volume.</p>
    
    <h2>The Challenge</h2>
    <p>The client was processing over 500,000 transactions monthly across multiple sales channels but lacked a unified view of their business performance. They needed:</p>
    <ul>
        <li>Real-time visibility into sales performance</li>
        <li>Customer behavior analysis and segmentation</li>
        <li>Inventory optimization insights</li>
        <li>Predictive analytics for demand forecasting</li>
        <li>Automated reporting for stakeholders</li>
    </ul>
    
    <h2>The Solution</h2>
    <p>I designed and built a modern analytics platform using a microservices architecture that could scale with their growing business needs.</p>
    
    <h3>Architecture Overview</h3>
    <p>The platform consists of several key components:</p>
    <ul>
        <li><strong>Data Ingestion Layer:</strong> Real-time ETL pipelines using Apache Kafka</li>
        <li><strong>Analytics Engine:</strong> Python-based ML models for predictive insights</li>
        <li><strong>Visualization Layer:</strong> Interactive dashboards built with SvelteKit and D3.js</li>
        <li><strong>API Gateway:</strong> Node.js/Express for secure data access</li>
        <li><strong>Database:</strong> PostgreSQL with Redis for caching</li>
    </ul>
    
    <h2>Technical Implementation</h2>
    <p>The frontend was built using SvelteKit for optimal performance with large datasets. The component architecture allowed for reusable chart components that could be easily configured for different metrics.</p>
    
    <p>On the backend, I implemented a robust ETL pipeline that could handle high-volume data ingestion while maintaining data quality through comprehensive validation and error handling.</p>
    
    <h2>Results and Impact</h2>
    <p>The platform has been in production for 8 months and has delivered significant business value:</p>
    <ul>
        <li>31% increase in conversion rates through better customer insights</li>
        <li>25% reduction in inventory holding costs</li>
        <li>90% faster decision-making with real-time dashboards</li>
        <li>$2.5M additional revenue attributed to platform insights</li>
    </ul>',
    '["SvelteKit", "Node.js", "PostgreSQL", "D3.js", "AWS", "Apache Kafka", "Redis", "Python", "Docker"]',
    'data-analytics',
    'published',
    'https://github.com/demo/ecommerce-analytics',
    'https://demo.ecommerce-analytics.com',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    '[
        {
            "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
            "caption": "Main analytics dashboard showing real-time sales metrics",
            "alt": "Analytics dashboard with charts and graphs"
        },
        {
            "url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop",
            "caption": "Customer segmentation analysis interface",
            "alt": "Customer segmentation charts and data visualization"
        },
        {
            "url": "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800&fit=crop",
            "caption": "Predictive analytics model results",
            "alt": "Machine learning model predictions and forecasts"
        }
    ]',
    '[
        {
            "title": "Platform Demo",
            "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "type": "youtube",
            "description": "Complete walkthrough of the analytics platform features"
        },
        {
            "title": "Technical Architecture",
            "url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "type": "youtube",
            "description": "Deep dive into the technical implementation and scalability considerations"
        }
    ]',
    'TechCommerce Solutions',
    '6 months',
    4,
    'Lead Full-Stack Developer & Data Architect',
    '[
        {
            "title": "Real-time Analytics Dashboard",
            "description": "Interactive dashboards with sub-second refresh rates showing key business metrics"
        },
        {
            "title": "Customer Segmentation Engine",
            "description": "ML-powered customer segmentation with behavioral analysis and lifetime value prediction"
        },
        {
            "title": "Inventory Optimization",
            "description": "Predictive analytics for demand forecasting and automated reorder recommendations"
        },
        {
            "title": "Automated Reporting",
            "description": "Scheduled reports with customizable metrics and stakeholder-specific insights"
        }
    ]',
    '[
        {
            "challenge": "Data Volume and Velocity",
            "solution": "Implemented Apache Kafka for real-time streaming and horizontal scaling capabilities"
        },
        {
            "challenge": "Complex Data Relationships",
            "solution": "Designed normalized database schema with optimized indexing and query performance"
        },
        {
            "challenge": "User Experience with Large Datasets",
            "solution": "Built progressive loading and data virtualization for smooth interaction with millions of records"
        }
    ]',
    '[
        {
            "metric": "Conversion Rate Increase",
            "value": "31%",
            "description": "Improved conversion rates through better customer insights and targeted marketing"
        },
        {
            "metric": "Inventory Cost Reduction",
            "value": "25%",
            "description": "Reduced holding costs through accurate demand forecasting and optimization"
        },
        {
            "metric": "Decision-Making Speed",
            "value": "90% faster",
            "description": "Real-time dashboards enabled rapid business decisions and strategy adjustments"
        },
        {
            "metric": "Additional Revenue",
            "value": "$2.5M",
            "description": "Direct revenue attribution to insights and recommendations from the platform"
        }
    ]',
    'Comprehensive e-commerce analytics platform built with SvelteKit, Node.js, and PostgreSQL featuring real-time dashboards, predictive analytics, and automated reporting.',
    ARRAY['ecommerce', 'analytics', 'sveltekit', 'data-visualization', 'machine-learning', 'real-time'],
    '2023-08-15'
),
(
    'Healthcare Data Dashboard',
    'healthcare-data-dashboard',
    'Developed a HIPAA-compliant dashboard for healthcare providers to track patient outcomes, resource utilization, and operational metrics across multiple facilities.',
    '<h1>Healthcare Data Dashboard</h1>
    <p>This project involved creating a comprehensive analytics solution for a regional healthcare network managing 12 facilities and serving over 100,000 patients annually.</p>
    
    <h2>Project Overview</h2>
    <p>The healthcare provider needed a centralized platform to monitor:</p>
    <ul>
        <li>Patient outcomes and quality metrics</li>
        <li>Resource utilization across facilities</li>
        <li>Operational efficiency indicators</li>
        <li>Compliance and regulatory reporting</li>
        <li>Financial performance analytics</li>
    </ul>
    
    <h2>HIPAA Compliance Considerations</h2>
    <p>Given the sensitive nature of healthcare data, security and compliance were paramount:</p>
    <ul>
        <li>End-to-end encryption for all data transmission</li>
        <li>Role-based access control with audit logging</li>
        <li>De-identification of patient data for analytics</li>
        <li>Secure cloud infrastructure with SOC 2 compliance</li>
    </ul>
    
    <h2>Technical Architecture</h2>
    <p>The solution leveraged modern technologies for scalability and security:</p>
    <ul>
        <li><strong>Frontend:</strong> React with TypeScript for type safety</li>
        <li><strong>Backend:</strong> Python FastAPI for high-performance APIs</li>
        <li><strong>Database:</strong> MongoDB for flexible healthcare data schemas</li>
        <li><strong>Infrastructure:</strong> Docker containers on AWS with VPC</li>
        <li><strong>Analytics:</strong> Apache Spark for large-scale data processing</li>
    </ul>
    
    <h2>Key Features</h2>
    <p>The dashboard provides comprehensive insights through several key modules:</p>
    
    <h3>Patient Outcomes Dashboard</h3>
    <p>Real-time monitoring of patient care metrics including readmission rates, treatment effectiveness, and satisfaction scores.</p>
    
    <h3>Resource Management</h3>
    <p>Tracking of bed occupancy, staff allocation, equipment utilization, and capacity planning across all facilities.</p>
    
    <h3>Financial Analytics</h3>
    <p>Revenue cycle management, cost analysis, and profitability insights by department and service line.</p>
    
    <h2>Impact and Results</h2>
    <p>The platform has significantly improved operational efficiency and patient care quality across the healthcare network.</p>',
    '["React", "TypeScript", "Python", "FastAPI", "MongoDB", "Docker", "AWS", "Apache Spark"]',
    'web-app',
    'published',
    'https://github.com/demo/healthcare-dashboard',
    NULL,
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
    '[
        {
            "url": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop",
            "caption": "Patient outcomes dashboard showing key quality metrics",
            "alt": "Healthcare dashboard with patient outcome charts"
        },
        {
            "url": "https://images.unsplash.com/photo-1666214280577-909dd2c71093?w=1200&h=800&fit=crop",
            "caption": "Resource utilization monitoring interface",
            "alt": "Resource management dashboard for healthcare facilities"
        }
    ]',
    '[]',
    'Regional Healthcare Network',
    '8 months',
    6,
    'Senior Full-Stack Developer & Security Lead',
    '[
        {
            "title": "HIPAA-Compliant Architecture",
            "description": "Secure, compliant infrastructure with end-to-end encryption and audit logging"
        },
        {
            "title": "Real-time Patient Monitoring",
            "description": "Live dashboards for patient outcomes, readmissions, and quality metrics"
        },
        {
            "title": "Multi-facility Management",
            "description": "Centralized view across 12 facilities with drill-down capabilities"
        },
        {
            "title": "Automated Reporting",
            "description": "Regulatory compliance reports and executive dashboards"
        }
    ]',
    '[
        {
            "challenge": "HIPAA Compliance Requirements",
            "solution": "Implemented comprehensive security framework with encryption, access controls, and audit logging"
        },
        {
            "challenge": "Complex Healthcare Data Models",
            "solution": "Designed flexible MongoDB schemas to accommodate diverse healthcare data structures"
        },
        {
            "challenge": "Real-time Performance with Large Datasets",
            "solution": "Optimized data pipelines and implemented efficient caching strategies"
        }
    ]',
    '[
        {
            "metric": "Reporting Time Reduction",
            "value": "75%",
            "description": "Automated reporting reduced manual work from 40 hours to 10 hours per month"
        },
        {
            "metric": "Data Accuracy Improvement",
            "value": "95%",
            "description": "Standardized data collection improved accuracy from 78% to 95%"
        },
        {
            "metric": "Cost Savings",
            "value": "$500K annually",
            "description": "Operational efficiencies and resource optimization savings"
        }
    ]',
    'HIPAA-compliant healthcare analytics dashboard built with React, Python, and MongoDB for tracking patient outcomes and operational metrics across multiple facilities.',
    ARRAY['healthcare', 'hipaa', 'react', 'python', 'mongodb', 'analytics', 'dashboard'],
    '2023-11-20'
);

-- Add testimonials for projects
INSERT INTO project_testimonials (project_id, client_name, client_title, client_company, testimonial_text, rating) VALUES
(
    (SELECT id FROM project_details WHERE slug = 'ecommerce-analytics-platform'),
    'Sarah Chen',
    'VP of Operations',
    'TechCommerce Solutions',
    'The analytics platform transformed how we understand our business. The real-time insights have been game-changing for our decision-making process, and the 31% increase in conversion rates speaks for itself.',
    5
),
(
    (SELECT id FROM project_details WHERE slug = 'healthcare-data-dashboard'),
    'Dr. Michael Rodriguez',
    'Chief Medical Officer',
    'Regional Healthcare Network',
    'This dashboard has revolutionized our approach to patient care and operational efficiency. The HIPAA-compliant design gave us confidence, and the 75% reduction in reporting time has freed up our staff to focus on patient care.',
    5
);

COMMIT; 