import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import readline from 'readline';

// Load environment variables
config();

console.log('🚀 Connect Your New Supabase Account');
console.log('====================================');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupSupabaseConnection() {
  try {
    console.log('');
    console.log('📋 We need your Supabase credentials to connect your new account.');
    console.log('');
    console.log('🔗 Get these from your Supabase dashboard:');
    console.log('   1. Go to https://supabase.com/dashboard');
    console.log('   2. Select your project');
    console.log('   3. Go to Settings → API');
    console.log('');

    // Get Supabase URL
    const supabaseUrl = await askQuestion('Enter your Supabase Project URL (e.g., https://abc123.supabase.co): ');
    
    if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
      console.log('❌ Invalid Supabase URL. Please try again.');
      process.exit(1);
    }

    // Get Supabase Anon Key
    const supabaseKey = await askQuestion('Enter your Supabase anon public key: ');
    
    if (!supabaseKey || supabaseKey.length < 100) {
      console.log('❌ Invalid Supabase key. Please try again.');
      process.exit(1);
    }

    console.log('');
    console.log('🔗 Testing connection...');

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection
    const { data, error } = await supabase.from('_test_').select('*').limit(1);
    
    if (error && !error.message.includes('does not exist')) {
      console.log('❌ Connection failed:', error.message);
      console.log('');
      console.log('Please check your credentials and try again.');
      process.exit(1);
    }

    console.log('✅ Connection successful!');
    
    // Show environment setup
    console.log('');
    console.log('📝 Update your .env file with these values:');
    console.log('==========================================');
    console.log(`SUPABASE_URL=${supabaseUrl}`);
    console.log(`SUPABASE_ANON_KEY=${supabaseKey}`);
    
    // Extract project ID for database URL
    const projectId = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];
    console.log(`DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@db.${projectId}.supabase.co:5432/postgres`);
    console.log('');
    console.log('⚠️  Replace YOUR_DB_PASSWORD with your actual database password');
    console.log('   (Get this from Supabase Dashboard → Settings → Database)');

    // Ask if they want to set up tables
    const setupTables = await askQuestion('\n🗄️  Do you want to create the database tables now? (y/n): ');
    
    if (setupTables.toLowerCase() === 'y' || setupTables.toLowerCase() === 'yes') {
      await createDatabaseTables(supabase);
    } else {
      console.log('');
      console.log('📋 To create tables later:');
      console.log('   1. Go to Supabase Dashboard → SQL Editor');
      console.log('   2. Copy and paste contents of complete-database-setup.sql');
      console.log('   3. Run the SQL script');
    }

    console.log('');
    console.log('🎉 Supabase connection setup complete!');
    console.log('');
    console.log('🚀 Next steps for Cloudflare deployment:');
    console.log('   1. Update your .env file with the values above');
    console.log('   2. Run: npm run build');
    console.log('   3. Deploy to Cloudflare with environment variables');
    
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
  } finally {
    rl.close();
  }
}

async function createDatabaseTables(supabase) {
  try {
    console.log('');
    console.log('🔨 Creating database tables...');

    // Try to create portfolio_content table
    const { error: contentTableError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS portfolio_content (
          id SERIAL PRIMARY KEY,
          content_data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_portfolio_content_updated_at 
        ON portfolio_content(updated_at DESC);
      `
    });

    // Try to create admin_users table
    const { error: adminTableError } = await supabase.rpc('exec_sql', {
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
      `
    });

    if (contentTableError || adminTableError) {
      console.log('⚠️  Automatic table creation might have failed.');
      console.log('   Please run the SQL script manually in Supabase dashboard.');
      return false;
    }

    // Insert default portfolio content
    const { data: existingContent } = await supabase
      .from('portfolio_content')
      .select('id')
      .limit(1);

    if (!existingContent || existingContent.length === 0) {
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
          description: "I'm a passionate data analyst with expertise in transforming complex datasets into strategic business insights.",
          technicalExpertise: [
            "Advanced Statistical Analysis",
            "Machine Learning & AI",
            "Data Visualization",
            "Database Design & Management"
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

      const { error: insertError } = await supabase
        .from('portfolio_content')
        .insert({ content_data: defaultContent });

      if (insertError) {
        console.log('⚠️  Could not insert default content:', insertError.message);
      } else {
        console.log('✅ Default content inserted successfully');
      }
    }

    console.log('✅ Database tables created successfully!');
    return true;

  } catch (err) {
    console.log('❌ Error creating tables:', err.message);
    console.log('');
    console.log('📋 Please create tables manually:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Copy and paste contents of complete-database-setup.sql');
    console.log('   3. Run the SQL script');
    return false;
  }
}

// Start the setup process
setupSupabaseConnection().catch(console.error); 