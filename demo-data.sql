-- Demo Data for Portfolio Database
-- Run this in your Supabase SQL Editor to populate with sample data

-- =============================================================================
-- 1. CLEAR EXISTING DATA (OPTIONAL)
-- =============================================================================
-- Uncomment these lines if you want to start fresh
-- DELETE FROM blog_posts;
-- DELETE FROM portfolio_content;

-- =============================================================================
-- 2. PORTFOLIO CONTENT UPDATE
-- =============================================================================
UPDATE portfolio_content 
SET content_data = '{
  "hero": {
    "title": "Full-Stack Developer & Data Analyst",
    "subtitle": "Building Digital Solutions That Matter",
    "description": "Passionate developer specializing in modern web applications and data-driven insights. I create scalable solutions that transform business challenges into opportunities.",
    "profileImage": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  },
  "stats": {
    "yearsExperience": 6,
    "projectsCompleted": 42,
    "satisfiedClients": 28
  },
  "about": {
    "description": "I am a passionate full-stack developer and data analyst with a unique blend of technical expertise in web development and data science. My mission is to bridge the gap between complex data insights and user-friendly applications that drive real business value.",
    "technicalExpertise": [
      "Full-Stack Web Development",
      "Data Analytics & Machine Learning", 
      "Cloud Architecture & DevOps",
      "API Design & Integration"
    ],
    "industryFocus": [
      "SaaS & Enterprise Applications",
      "E-commerce & Fintech",
      "Healthcare & Education", 
      "Data Visualization & BI"
    ]
  },
  "services": [
    {
      "title": "Web Development",
      "description": "Custom web applications using React, Svelte, Node.js, and modern frameworks with responsive design and optimal performance.",
      "icon": "Code"
    },
    {
      "title": "Data Analytics",
      "description": "Transform complex datasets into actionable insights with advanced analytics, machine learning, and interactive dashboards.",
      "icon": "BarChart3"
    },
    {
      "title": "API Development", 
      "description": "Robust REST and GraphQL APIs with proper authentication, documentation, and scalable architecture patterns.",
      "icon": "Database"
    },
    {
      "title": "Cloud Solutions",
      "description": "Deploy and scale applications on AWS, Google Cloud, and modern platforms with CI/CD pipelines and monitoring.",
      "icon": "Brain"
    }
  ],
  "projects": [
    {
      "title": "E-commerce Analytics Platform",
      "description": "Built a comprehensive analytics platform for an e-commerce company tracking 500K+ monthly transactions with real-time insights, predictive analytics, and automated reporting.",
      "technologies": ["SvelteKit", "Node.js", "PostgreSQL", "D3.js", "AWS"],
      "impact": "Increased conversion rates by 31%",
      "link": "https://github.com/demo/ecommerce-analytics", 
      "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
    },
    {
      "title": "Healthcare Data Dashboard",
      "description": "Developed a HIPAA-compliant dashboard for healthcare providers to track patient outcomes, resource utilization, and operational metrics across multiple facilities.",
      "technologies": ["React", "Python", "FastAPI", "MongoDB", "Docker"],
      "impact": "Reduced reporting time by 75%",
      "link": "https://github.com/demo/healthcare-dashboard",
      "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop"
    },
    {
      "title": "Financial Portfolio Tracker",
      "description": "Created a real-time portfolio tracking application with automated data pipelines, risk analysis, and personalized investment recommendations using ML algorithms.",
      "technologies": ["Next.js", "TypeScript", "GraphQL", "Redis", "TensorFlow"],
      "impact": "Manages $2M+ in assets",
      "link": "https://github.com/demo/portfolio-tracker",
      "image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=300&fit=crop"
    },
    {
      "title": "Educational Content CMS",
      "description": "Built a headless CMS for online education platform with adaptive learning algorithms, progress tracking, and multimedia content management for 10K+ students.",
      "technologies": ["SvelteKit", "Supabase", "Stripe", "Cloudflare", "OpenAI"],
      "impact": "Improved student engagement by 45%",
      "link": "https://github.com/demo/education-cms",
      "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=300&fit=crop"
    }
  ],
  "skills": {
    "frontend": [
      { "name": "React/Next.js", "level": 92 },
      { "name": "SvelteKit", "level": 95 },
      { "name": "TypeScript", "level": 88 }
    ],
    "backend": [
      { "name": "Node.js", "level": 90 },
      { "name": "Python", "level": 87 },
      { "name": "PostgreSQL", "level": 93 }
    ],
    "analytics": [
      { "name": "Machine Learning", "level": 85 },
      { "name": "Data Visualization", "level": 91 },
      { "name": "Statistical Analysis", "level": 82 }
    ],
    "tools": [
      { "name": "Docker", "level": 86 },
      { "name": "AWS/GCP", "level": 84 },
      { "name": "Git/CI/CD", "level": 92 }
    ]
  },
  "experience": [
    {
      "company": "TechFlow Solutions",
      "position": "Senior Full-Stack Developer", 
      "period": "2022 - Present",
      "location": "San Francisco, CA (Remote)",
      "description": "Leading development of enterprise SaaS applications serving 50K+ users, architecting scalable solutions, and mentoring a team of 5 developers.",
      "achievements": [
        "Architected microservices infrastructure reducing deployment time by 60%",
        "Built analytics pipeline processing 1M+ events daily",
        "Led migration to cloud-native architecture saving $100K annually"
      ]
    },
    {
      "company": "DataVista Analytics",
      "position": "Full-Stack Developer & Data Analyst",
      "period": "2020 - 2022", 
      "location": "Austin, TX",
      "description": "Developed data-driven web applications and analytics solutions for Fortune 500 clients across finance, healthcare, and retail sectors.",
      "achievements": [
        "Created real-time dashboard reducing executive reporting time by 80%",
        "Built ML models improving customer segmentation accuracy by 40%",
        "Developed API gateway handling 10M+ monthly requests"
      ]
    },
    {
      "company": "StartupHub Incubator",
      "position": "Junior Developer",
      "period": "2019 - 2020", 
      "location": "Remote",
      "description": "Supported multiple startup projects with rapid prototyping, MVP development, and data analysis to validate business hypotheses.",
      "achievements": [
        "Built MVPs for 8 startups with average development time of 6 weeks",
        "Implemented A/B testing framework increasing conversion rates by 25%",
        "Created data pipelines for user behavior analysis"
      ]
    }
  ],
  "contact": {
    "email": "hello@yourportfolio.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourprofile"
  }
}'::jsonb
WHERE id = 1;

-- =============================================================================
-- 3. BLOG POSTS DATA
-- =============================================================================

INSERT INTO blog_posts (
  title, 
  slug, 
  content, 
  excerpt, 
  category, 
  tags, 
  status,
  reading_time,
  published_at,
  featured_image,
  meta_description
) VALUES 
(
  'Building Scalable SvelteKit Applications: Lessons from Production',
  'scalable-sveltekit-applications',
  '<h1>Building Scalable SvelteKit Applications</h1>
  <p>After deploying multiple SvelteKit applications to production, I''ve learned valuable lessons about building scalable, maintainable applications. Here''s what I wish I knew when starting out.</p>
  
  <h2>Architecture Patterns That Work</h2>
  <p>The key to scalable SvelteKit apps lies in proper architecture from day one. Here are the patterns that have served me well:</p>
  
  <h3>1. Component Organization</h3>
  <p>Structure your components with clear separation of concerns:</p>
  <pre><code>src/
  lib/
    components/
      ui/          # Reusable UI components
      forms/       # Form-specific components
      layout/      # Layout components
    stores/        # Svelte stores
    utils/         # Utility functions
    types/         # TypeScript definitions</code></pre>
  
  <h3>2. State Management</h3>
  <p>Use Svelte stores strategically. Don''t put everything in global state - prefer component-level state when possible.</p>
  
  <h2>Performance Optimization</h2>
  <p>SvelteKit is fast by default, but these optimizations made a significant difference in our applications:</p>
  <ul>
    <li>Implement proper lazy loading for large datasets</li>
    <li>Use server-side rendering (SSR) for SEO-critical pages</li>
    <li>Optimize images and implement proper caching strategies</li>
  </ul>
  
  <h2>Testing Strategy</h2>
  <p>A robust testing strategy is crucial for scalable applications. We use a combination of unit tests, integration tests, and end-to-end tests.</p>
  
  <p>These practices have helped us maintain high-quality applications that scale gracefully. The investment in proper architecture pays dividends as your application grows.</p>',
  'Key lessons and best practices for building scalable SvelteKit applications based on real production experience.',
  'tech',
  ARRAY['sveltekit', 'web development', 'best practices', 'architecture'],
  'published',
  8,
  NOW() - INTERVAL '1 day',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
  'Learn how to build scalable SvelteKit applications with proven architecture patterns and optimization techniques.'
),
(
  'Data-Driven Decision Making: A Developer''s Guide to Analytics',
  'data-driven-decision-making-guide',
  '<h1>Why Every Developer Needs Analytics Skills</h1>
  <p>In today''s competitive landscape, the ability to make data-driven decisions isn''t just for data scientists—it''s an essential skill for developers at every level.</p>
  
  <h2>The Developer''s Analytics Toolkit</h2>
  <p>You don''t need a PhD in statistics to leverage data effectively. Here are the essential tools and concepts every developer should know:</p>
  
  <h3>Essential Metrics</h3>
  <ul>
    <li><strong>User Engagement:</strong> Time on page, bounce rate, conversion funnels</li>
    <li><strong>Performance:</strong> Load times, error rates, API response times</li>
    <li><strong>Business Impact:</strong> User retention, feature adoption, revenue attribution</li>
  </ul>
  
  <h3>Tools That Make a Difference</h3>
  <p>Start with these proven tools:</p>
  <ul>
    <li><strong>Google Analytics 4:</strong> For web analytics and user behavior</li>
    <li><strong>Mixpanel/Amplitude:</strong> For product analytics and event tracking</li>
    <li><strong>Tableau/PowerBI:</strong> For data visualization and dashboards</li>
    <li><strong>SQL:</strong> The foundation of data analysis</li>
  </ul>
  
  <h2>Implementing Analytics in Your Applications</h2>
  <p>Here''s a practical approach to adding analytics to your applications:</p>
  
  <h3>1. Define Your Questions</h3>
  <p>Before implementing any tracking, clearly define what you want to learn. Good questions lead to actionable insights.</p>
  
  <h3>2. Track Events, Not Just Page Views</h3>
  <p>Modern applications require event-based tracking. Track user interactions, feature usage, and conversion points.</p>
  
  <h3>3. Build Dashboards That Matter</h3>
  <p>Create dashboards that your team will actually use. Focus on metrics that drive decisions, not vanity metrics.</p>
  
  <h2>Real-World Impact</h2>
  <p>In my recent project, implementing proper analytics helped us identify that 60% of users were dropping off at a specific step in our onboarding flow. This insight led to a simple UI change that increased completion rates by 35%.</p>
  
  <p>The lesson? Data doesn''t have to be complex to be powerful. Start simple, stay focused, and let the insights guide your development decisions.</p>',
  'A practical guide for developers to leverage analytics and data-driven insights in their daily work and project decisions.',
  'tech',
  ARRAY['analytics', 'data science', 'web development', 'metrics'],
  'published',
  6,
  NOW() - INTERVAL '3 days',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  'Learn how to integrate analytics into your development workflow and make data-driven decisions that improve your applications.'
),
(
  'My Journey from Bootcamp to Senior Developer in 4 Years',
  'bootcamp-to-senior-developer-journey',
  '<h1>From Zero to Senior Developer</h1>
  <p>Four years ago, I made a career change that seemed impossible: transitioning from a non-technical background to becoming a senior developer. Here''s the honest story of that journey.</p>
  
  <h2>The Starting Point</h2>
  <p>I had zero programming experience when I enrolled in a coding bootcamp. My background was in marketing, and the technical world felt completely foreign. But I was driven by curiosity and the desire for a career that challenged me intellectually.</p>
  
  <h2>The Bootcamp Experience</h2>
  <p>The 12-week intensive program was simultaneously the most challenging and rewarding experience of my life. Here''s what made the difference:</p>
  
  <h3>What Worked</h3>
  <ul>
    <li><strong>Project-Based Learning:</strong> Building real applications, not just following tutorials</li>
    <li><strong>Pair Programming:</strong> Learning from peers and teaching others</li>
    <li><strong>Industry Mentorship:</strong> Guidance from working professionals</li>
  </ul>
  
  <h3>The Struggles</h3>
  <p>It wasn''t all smooth sailing. Imposter syndrome hit hard, especially when comparing myself to computer science graduates. The key was focusing on continuous learning rather than where I started.</p>
  
  <h2>Landing the First Job</h2>
  <p>The job search took 3 months and 47 applications. Here''s what finally worked:</p>
  <ul>
    <li>Building a portfolio of real projects</li>
    <li>Contributing to open source</li>
    <li>Networking at local meetups</li>
    <li>Focusing on companies that valued potential over pedigree</li>
  </ul>
  
  <h2>The Growth Path</h2>
  <p>My progression looked like this:</p>
  <ul>
    <li><strong>Year 1:</strong> Junior Developer - Learning fundamentals, surviving code reviews</li>
    <li><strong>Year 2:</strong> Developer - Taking ownership of features, mentoring newer devs</li>
    <li><strong>Year 3:</strong> Senior Developer - Architecture decisions, leading projects</li>
    <li><strong>Year 4:</strong> Senior Developer + Data Skills - Expanding into analytics</li>
  </ul>
  
  <h2>Key Lessons Learned</h2>
  <ol>
    <li><strong>Never Stop Learning:</strong> Technology changes fast. Continuous learning isn''t optional.</li>
    <li><strong>Teach Others:</strong> Explaining concepts to others solidifies your own understanding.</li>
    <li><strong>Build Real Things:</strong> Side projects and contributions matter more than certificates.</li>
    <li><strong>Embrace Feedback:</strong> Code reviews stung at first, but they were invaluable for growth.</li>
  </ol>
  
  <h2>To Current Bootcamp Students</h2>
  <p>If you''re currently in a bootcamp or considering one, remember: your background isn''t a limitation—it''s a unique perspective. The industry needs diverse thinkers who can bridge technical and business domains.</p>
  
  <p>The journey from bootcamp to senior developer is challenging but absolutely achievable. Focus on consistent growth, stay curious, and don''t be afraid to ask questions. Your unique journey is your strength.</p>',
  'An honest account of the challenges and victories in transitioning from a coding bootcamp to a senior developer role in just four years.',
  'journey',
  ARRAY['career change', 'bootcamp', 'programming', 'personal story'],
  'published',
  7,
  NOW() - INTERVAL '5 days',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop',
  'Follow the journey from coding bootcamp to senior developer, including challenges, lessons learned, and practical advice for career changers.'
),
(
  'Remote Work Adventures: Coding from 15 Countries',
  'remote-work-coding-15-countries',
  '<h1>The Digital Nomad Developer Life</h1>
  <p>Over the past two years, I''ve had the privilege of working remotely while traveling through 15 countries. Here are the lessons learned about maintaining productivity while satisfying wanderlust.</p>
  
  <h2>The Setup That Made It Possible</h2>
  <p>Successful remote work requires the right tools and mindset. Here''s what worked for me:</p>
  
  <h3>Essential Gear</h3>
  <ul>
    <li><strong>Portable Monitor:</strong> 13" USB-C monitor for dual-screen setup anywhere</li>
    <li><strong>Reliable Laptop:</strong> MacBook Pro with 32GB RAM for smooth development</li>
    <li><strong>Internet Backup:</strong> Portable hotspot and local SIM cards</li>
    <li><strong>Noise-Canceling Headphones:</strong> Essential for calls and focus</li>
  </ul>
  
  <h2>Standout Locations</h2>
  <p>Some places were particularly conducive to productive remote work:</p>
  
  <h3>🇹🇭 Chiang Mai, Thailand</h3>
  <p>The ultimate digital nomad destination. Excellent coworking spaces, reliable internet, and an amazing community of remote workers. The cost of living is fantastic, and the food scene is incredible.</p>
  
  <h3>🇪🇸 Barcelona, Spain</h3>
  <p>Perfect timezone overlap with US clients, vibrant tech scene, and outstanding quality of life. The city''s energy is infectious and highly motivating for creative work.</p>
  
  <h3>🇲🇽 Mexico City, Mexico</h3>
  <p>Growing tech hub with excellent internet infrastructure. The culture, food, and proximity to US time zones make it ideal for developers working with American companies.</p>
  
  <h2>Challenges and Solutions</h2>
  
  <h3>Internet Connectivity</h3>
  <p>The biggest challenge was ensuring reliable internet for video calls and code deployments. Solution: Always have a backup plan and test connections before important meetings.</p>
  
  <h3>Time Zone Management</h3>
  <p>Working across time zones requires discipline. I learned to be very clear about availability and to batch meetings when possible.</p>
  
  <h3>Maintaining Work-Life Balance</h3>
  <p>When your office is paradise, it''s easy to either work too much or not enough. Setting boundaries and creating routines was crucial.</p>
  
  <h2>Productivity Insights</h2>
  <p>Contrary to what some might think, I was often more productive while traveling:</p>
  <ul>
    <li>New environments sparked creativity</li>
    <li>Limited distractions led to better focus</li>
    <li>Excitement about exploration motivated efficient work completion</li>
  </ul>
  
  <h2>The Technical Challenges</h2>
  <p>Working from different locations presented unique technical challenges:</p>
  <ul>
    <li><strong>VPN Requirements:</strong> Some clients required specific VPN configurations</li>
    <li><strong>Local Regulations:</strong> Understanding data privacy laws in different countries</li>
    <li><strong>Currency and Payments:</strong> Managing international banking and tax implications</li>
  </ul>
  
  <h2>Would I Recommend It?</h2>
  <p>Absolutely, but with caveats. Remote travel works best when you have:</p>
  <ul>
    <li>Established client relationships</li>
    <li>Flexible work arrangements</li>
    <li>Strong self-discipline</li>
    <li>Emergency funds for unexpected situations</li>
  </ul>
  
  <p>The experience broadened my perspective, improved my adaptability, and proved that with the right setup, you can maintain high-quality work from almost anywhere in the world.</p>',
  'Adventures and lessons learned while working as a remote developer across 15 countries, including practical tips for digital nomads.',
  'travel',
  ARRAY['remote work', 'digital nomad', 'travel', 'productivity'],
  'published',
  9,
  NOW() - INTERVAL '1 week',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop',
  'Explore the realities of working as a remote developer while traveling, including practical tips, challenges, and standout destinations.'
),
(
  'Building My First SaaS: Technical Deep Dive',
  'building-first-saas-technical-deep-dive',
  '<h1>From Idea to $10k MRR: Technical Architecture</h1>
  <p>Six months ago, I launched my first SaaS product. Today, it''s generating $10k MRR with 500+ active users. Here''s the technical architecture that made it possible and the lessons learned along the way.</p>
  
  <h2>The Product</h2>
  <p>DataFlow is a visual data pipeline builder that helps non-technical users create automated workflows between different data sources. Think Zapier, but specifically for data analysts.</p>
  
  <h2>Tech Stack Decisions</h2>
  
  <h3>Frontend: SvelteKit + TypeScript</h3>
  <p>Why SvelteKit?</p>
  <ul>
    <li>Exceptional performance for data-heavy interfaces</li>
    <li>Built-in SSR for better SEO</li>
    <li>Smaller bundle sizes compared to React</li>
    <li>Developer experience is fantastic</li>
  </ul>
  
  <h3>Backend: Node.js + Fastify</h3>
  <p>Fastify over Express for:</p>
  <ul>
    <li>Better performance (3x faster in our benchmarks)</li>
    <li>Built-in validation and serialization</li>
    <li>Plugin architecture that scales well</li>
    <li>TypeScript support out of the box</li>
  </ul>
  
  <h3>Database: PostgreSQL + Redis</h3>
  <p>PostgreSQL for relational data and Redis for:</p>
  <ul>
    <li>Session storage</li>
    <li>Job queues (Bull)</li>
    <li>Caching frequently accessed data</li>
    <li>Real-time features</li>
  </ul>
  
  <h2>Architecture Overview</h2>
  <pre><code>Frontend (SvelteKit)
    ↓
API Gateway (Fastify)
    ↓
Microservices:
  - User Management
  - Pipeline Engine
  - Data Connectors
  - Billing (Stripe)
    ↓
PostgreSQL + Redis
    ↓
Background Jobs (Bull Queue)</code></pre>
  
  <h2>Key Technical Decisions</h2>
  
  <h3>1. Real-time Pipeline Monitoring</h3>
  <p>Used WebSockets for real-time pipeline status updates. This was crucial for user experience - seeing data flow in real-time creates trust in the system.</p>
  
  <h3>2. Plugin Architecture</h3>
  <p>Built the data connectors as plugins, making it easy to add new integrations without touching core code. This architectural decision has been crucial for rapid feature development.</p>
  
  <h3>3. Queued Processing</h3>
  <p>All data processing happens in background jobs. This keeps the UI responsive and allows for better error handling and retry logic.</p>
  
  <h2>Scaling Challenges</h2>
  
  <h3>Challenge 1: Memory Usage</h3>
  <p>Processing large datasets was causing memory issues. Solution: Implemented streaming for large files and added pagination for data previews.</p>
  
  <h3>Challenge 2: Database Performance</h3>
  <p>Complex queries were slowing down as data grew. Solution: Added proper indexing and implemented read replicas for analytics queries.</p>
  
  <h3>Challenge 3: Error Handling</h3>
  <p>Data pipelines fail for many reasons. Built comprehensive error tracking with Sentry and created user-friendly error messages that actually help users fix issues.</p>
  
  <h2>Developer Experience Wins</h2>
  <ul>
    <li><strong>TypeScript Everywhere:</strong> Caught countless bugs before production</li>
    <li><strong>Comprehensive Testing:</strong> 85% test coverage gave confidence for rapid iteration</li>
    <li><strong>CI/CD Pipeline:</strong> Automatic deployments for every merge to main</li>
    <li><strong>Monitoring:</strong> DataDog for performance monitoring and alerting</li>
  </ul>
  
  <h2>What I''d Do Differently</h2>
  <ol>
    <li><strong>Start with Monolith:</strong> Went microservices too early. Would start monolith and extract services as needed.</li>
    <li><strong>More User Testing:</strong> Built features users didn''t need. More user interviews earlier would have saved time.</li>
    <li><strong>Better Onboarding:</strong> Technical architecture was solid, but user onboarding needed more thought.</li>
  </ol>
  
  <h2>Key Metrics After 6 Months</h2>
  <ul>
    <li>$10k MRR</li>
    <li>500+ active users</li>
    <li>99.9% uptime</li>
    <li>Sub-200ms API response times</li>
    <li>Processing 1M+ records daily</li>
  </ul>
  
  <p>Building a SaaS taught me that good technical architecture is necessary but not sufficient. User experience, marketing, and customer support are equally important. But having a solid technical foundation allowed me to iterate quickly and scale confidently.</p>',
  'Complete technical breakdown of building a SaaS from idea to $10k MRR, including architecture decisions, challenges, and lessons learned.',
  'tech',
  ARRAY['saas', 'startup', 'sveltekit', 'architecture', 'postgresql'],
  'draft',
  12,
  NULL,
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
  'Deep dive into the technical architecture and decisions behind building a successful SaaS product from scratch.'
);

-- Update reading time based on content length
UPDATE blog_posts SET reading_time = 
  CASE 
    WHEN LENGTH(content) < 2000 THEN 3
    WHEN LENGTH(content) < 4000 THEN 5
    WHEN LENGTH(content) < 6000 THEN 7
    WHEN LENGTH(content) < 8000 THEN 9
    ELSE 12
  END;

-- Set published_at for published posts
UPDATE blog_posts 
SET published_at = 
  CASE 
    WHEN status = 'published' AND published_at IS NULL THEN created_at
    ELSE published_at
  END;

COMMIT; 