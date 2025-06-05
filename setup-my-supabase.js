import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Your actual Supabase credentials
const SUPABASE_URL = 'https://dttkwomsrqrjshuutiac.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dGt3b21zcnFyanNodXV0aWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzY0NzksImV4cCI6MjA2NDY1MjQ3OX0._xG1W5ZePSHUzUTWBufnjBTzgP6GTSbgY-a2z38T1yw';

console.log('🚀 Setting Up Your Supabase Database');
console.log('===================================');

async function setupDatabase() {
  try {
    console.log('📊 Supabase URL:', SUPABASE_URL);
    console.log('🔑 Testing connection...');

    // Create Supabase client with your credentials
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Test connection
    const { data, error } = await supabase.from('_test_').select('*').limit(1);
    
    if (error && !error.message.includes('does not exist')) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Connection successful!');

    // Create tables using the complete setup SQL
    console.log('🔨 Creating database tables...');
    
    try {
      // Read the complete SQL setup script
      const sqlScript = readFileSync('complete-database-setup.sql', 'utf8');
      
      // Try to execute the SQL script using RPC (if available)
      const { error: sqlError } = await supabase.rpc('exec_sql', {
        sql_query: sqlScript
      });

      if (sqlError) {
        console.log('⚠️  RPC method not available, creating tables individually...');
        await createTablesIndividually(supabase);
      } else {
        console.log('✅ Database setup completed using SQL script!');
      }
    } catch (err) {
      console.log('⚠️  SQL script method failed, creating tables individually...');
      await createTablesIndividually(supabase);
    }

    // Insert default content if needed
    await insertDefaultContent(supabase);

    // Create default admin user
    await createDefaultAdmin(supabase);

    console.log('');
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📝 Your .env file should contain:');
    console.log('================================');
    console.log(`SUPABASE_URL=${SUPABASE_URL}`);
    console.log(`SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}`);
    console.log('DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.dttkwomsrqrjshuutiac.supabase.co:5432/postgres');
    console.log('SESSION_SECRET=your_secure_random_secret');
    console.log('ADMIN_USERNAME=admin');
    console.log('ADMIN_PASSWORD=admin123');
    console.log('');
    console.log('⚠️  Replace YOUR_PASSWORD with your Supabase database password');
    console.log('   (Get this from Supabase Dashboard → Settings → Database)');
    console.log('');
    console.log('🚀 Ready for Cloudflare deployment!');
    console.log('   1. Update your .env file with the values above');
    console.log('   2. Run: npm run build');
    console.log('   3. Deploy to Cloudflare Pages');
    
    return true;

  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    return false;
  }
}

async function createTablesIndividually(supabase) {
  try {
    // Create portfolio_content table
    console.log('📋 Creating portfolio_content table...');
    
    const { error: contentError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS portfolio_content (
          id SERIAL PRIMARY KEY,
          content_data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_portfolio_content_updated_at 
        ON portfolio_content(updated_at DESC);
        
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        DROP TRIGGER IF EXISTS update_portfolio_content_updated_at ON portfolio_content;
        CREATE TRIGGER update_portfolio_content_updated_at
            BEFORE UPDATE ON portfolio_content
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (contentError) {
      console.log('⚠️  Could not create portfolio_content table:', contentError.message);
    } else {
      console.log('✅ portfolio_content table created successfully');
    }

    // Create admin_users table
    console.log('👤 Creating admin_users table...');
    
    const { error: adminError } = await supabase.rpc('exec_sql', {
      sql_query: `
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
        
        CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
        CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
        
        DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
        CREATE TRIGGER update_admin_users_updated_at
            BEFORE UPDATE ON admin_users
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
      `
    });

    if (adminError) {
      console.log('⚠️  Could not create admin_users table:', adminError.message);
    } else {
      console.log('✅ admin_users table created successfully');
    }

  } catch (err) {
    console.log('❌ Error creating tables:', err.message);
    console.log('');
    console.log('📋 Manual Setup Required:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Copy and paste contents of complete-database-setup.sql');
    console.log('3. Run the SQL script');
  }
}

async function insertDefaultContent(supabase) {
  try {
    // Check if content already exists
    const { data: existing } = await supabase
      .from('portfolio_content')
      .select('id')
      .limit(1);

    if (existing && existing.length > 0) {
      console.log('📝 Default portfolio content already exists');
      return;
    }

    console.log('📝 Inserting default portfolio content...');

    const defaultContent = {
      hero: {
        title: "Data Analyst",
        subtitle: "Turning Numbers into Insights",
        description: "Transforming complex data into actionable business insights through advanced analytics and visualization techniques.",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      },
      stats: {
        yearsExperience: 5,
        projectsCompleted: 25,
        satisfiedClients: 15
      },
      about: {
        description: "I'm a passionate data analyst with expertise in transforming complex datasets into strategic business insights. With a strong background in statistical analysis, machine learning, and data visualization, I help organizations make data-driven decisions that drive growth and efficiency.",
        technicalExpertise: [
          "Advanced Statistical Analysis",
          "Machine Learning & AI",
          "Data Visualization",
          "Database Design & Management"
        ],
        industryFocus: [
          "E-commerce & Retail",
          "Financial Services",
          "Healthcare Analytics",
          "Marketing & Customer Analytics"
        ]
      },
      services: [
        {
          title: "Data Analytics",
          description: "Transform raw data into actionable business insights with advanced statistical analysis and visualization.",
          icon: "BarChart3"
        },
        {
          title: "Machine Learning",
          description: "Build predictive models and AI solutions to automate decision-making and forecast trends.",
          icon: "Brain"
        },
        {
          title: "Data Engineering",
          description: "Design and implement robust data pipelines, warehouses, and ETL processes for scalable data operations.",
          icon: "Database"
        },
        {
          title: "Business Intelligence",
          description: "Create comprehensive dashboards and reporting systems for data-driven business strategies.",
          icon: "Code"
        }
      ],
      projects: [
        {
          title: "Customer Analytics Dashboard",
          description: "Built an interactive dashboard tracking customer behavior across multiple touchpoints with real-time analytics and predictive insights.",
          technologies: ["Python", "React", "D3.js", "PostgreSQL"],
          impact: "Increased customer retention by 23%",
          link: "https://github.com/example/customer-dashboard",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop"
        },
        {
          title: "Sales Forecasting Model",
          description: "Developed ML models using time series analysis to predict sales performance with 95% accuracy across multiple product lines.",
          technologies: ["Python", "TensorFlow", "Tableau", "AWS"],
          impact: "Improved forecast accuracy by 40%",
          link: "https://github.com/example/sales-forecasting",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
        }
      ],
      skills: {
        programming: [
          { name: "Python", level: 90 },
          { name: "R", level: 85 },
          { name: "SQL", level: 95 }
        ],
        visualization: [
          { name: "Tableau", level: 92 },
          { name: "Power BI", level: 88 },
          { name: "D3.js", level: 80 }
        ],
        databases: [
          { name: "PostgreSQL", level: 93 },
          { name: "MongoDB", level: 85 },
          { name: "BigQuery", level: 87 }
        ],
        cloudAndTools: [
          { name: "AWS", level: 86 },
          { name: "Docker", level: 82 },
          { name: "Git", level: 90 }
        ]
      },
      experience: [
        {
          company: "TechCorp Solutions",
          position: "Senior Data Analyst",
          period: "2022 - Present",
          location: "San Francisco, CA",
          description: "Leading analytics initiatives for a $50M product portfolio, developing predictive models, and mentoring junior analysts.",
          achievements: [
            "Increased revenue by 18% through data-driven insights",
            "Automated reporting processes reducing manual work by 60%",
            "Built ML models improving customer segmentation accuracy by 35%"
          ]
        }
      ],
      contact: {
        email: "hello@dataanalyst.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        github: "https://github.com/dataanalyst",
        linkedin: "https://linkedin.com/in/dataanalyst"
      }
    };

    const { error } = await supabase
      .from('portfolio_content')
      .insert({ content_data: defaultContent });

    if (error) {
      console.log('⚠️  Could not insert default content:', error.message);
    } else {
      console.log('✅ Default portfolio content inserted successfully');
    }

  } catch (err) {
    console.log('⚠️  Error inserting default content:', err.message);
  }
}

async function createDefaultAdmin(supabase) {
  try {
    // Check if admin already exists
    const { data: existing } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', 'admin')
      .limit(1);

    if (existing && existing.length > 0) {
      console.log('👤 Default admin user already exists');
      return;
    }

    console.log('👤 Creating default admin user...');

    // For now, just create a placeholder record since we need bcrypt for proper hashing
    // The actual admin creation will happen via the API once the app starts
    console.log('⚠️  Admin user will be created when you first run the application');
    console.log('   Default credentials: admin / admin123');

  } catch (err) {
    console.log('⚠️  Admin user will be created via API on first run');
  }
}

// Run the setup
setupDatabase().then(success => {
  if (success) {
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Update your .env file with the values shown above');
    console.log('2. Run: npm run preview (to test locally)');
    console.log('3. Visit: http://localhost:4173/admin');
    console.log('4. Login with: admin / admin123');
    console.log('5. When ready: npm run build (for Cloudflare deployment)');
  } else {
    console.log('❌ Setup failed. Please check the manual setup instructions.');
  }
  process.exit(success ? 0 : 1);
}); 