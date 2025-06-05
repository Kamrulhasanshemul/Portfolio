import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://dttkwomsrqrjshuutiac.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your_supabase_anon_key_here';

console.log('🚀 Creating Portfolio Database Table in Supabase');
console.log('=================================================');

if (supabaseAnonKey === 'your_supabase_anon_key_here') {
    console.error('❌ ERROR: Please update your SUPABASE_ANON_KEY in .env file');
    console.log('');
    console.log('📋 Steps to get your key:');
    console.log('1. Go to https://supabase.com');
    console.log('2. Open your project dashboard');
    console.log('3. Go to Settings > API');
    console.log('4. Copy the "anon public" key');
    console.log('5. Update SUPABASE_ANON_KEY in your .env file');
    process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTable() {
    try {
        console.log('📋 Reading SQL setup script...');
        
        // Read the SQL script
        const sqlScript = readFileSync('database-setup.sql', 'utf8');
        
        console.log('🗄️  Creating portfolio_content table...');
        
        // Execute the SQL script
        const { data, error } = await supabase.rpc('exec_sql', { 
            sql_query: sqlScript 
        });
        
        if (error) {
            console.error('❌ Error creating table:', error);
            
            // Try alternative approach - create table directly
            console.log('🔄 Trying alternative approach...');
            
            const { error: createError } = await supabase
                .from('portfolio_content')
                .select('*')
                .limit(1);
            
            if (createError && createError.code === 'PGRST116') {
                console.log('✅ Table exists but is empty - this is expected!');
                return true;
            } else if (createError && createError.message.includes('does not exist')) {
                console.log('');
                console.log('📝 Manual Setup Required:');
                console.log('========================');
                console.log('1. Go to your Supabase dashboard');
                console.log('2. Navigate to SQL Editor');
                console.log('3. Copy and paste the contents of database-setup.sql');
                console.log('4. Run the SQL script');
                console.log('');
                console.log('The database-setup.sql file contains:');
                console.log('- Table creation script');
                console.log('- Default content insertion');
                console.log('- Indexes and triggers');
                return false;
            } else {
                console.log('✅ Database connection successful!');
                return true;
            }
        } else {
            console.log('✅ Table created successfully!');
            return true;
        }
        
    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
        
        console.log('');
        console.log('📝 Manual Setup Instructions:');
        console.log('=============================');
        console.log('1. Open Supabase Dashboard: https://supabase.com');
        console.log('2. Go to your project > SQL Editor');
        console.log('3. Copy contents of database-setup.sql');
        console.log('4. Paste and execute the SQL');
        console.log('');
        
        return false;
    }
}

async function testConnection() {
    try {
        console.log('🔗 Testing database connection...');
        
        // Test basic connection
        const { data, error } = await supabase
            .from('portfolio_content')
            .select('count', { count: 'exact', head: true });
        
        if (error) {
            if (error.message.includes('does not exist')) {
                console.log('⚠️  Table does not exist - need to create it first');
                return false;
            } else {
                console.error('❌ Connection error:', error.message);
                return false;
            }
        }
        
        console.log('✅ Database connection successful!');
        console.log(`📊 Table exists with ${data || 0} records`);
        return true;
        
    } catch (err) {
        console.error('❌ Connection test failed:', err.message);
        return false;
    }
}

async function insertDefaultContent() {
    try {
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
        
        // Check if content already exists
        const { data: existing } = await supabase
            .from('portfolio_content')
            .select('id')
            .limit(1);
        
        if (existing && existing.length > 0) {
            console.log('✅ Default content already exists, skipping insertion');
            return true;
        }
        
        // Insert default content
        const { data, error } = await supabase
            .from('portfolio_content')
            .insert({
                content_data: defaultContent,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        
        if (error) {
            console.error('❌ Error inserting default content:', error);
            return false;
        }
        
        console.log('✅ Default content inserted successfully!');
        return true;
        
    } catch (err) {
        console.error('❌ Error inserting default content:', err.message);
        return false;
    }
}

async function main() {
    console.log('📊 Supabase URL:', supabaseUrl);
    console.log('🔑 Anon Key:', supabaseAnonKey.substring(0, 20) + '...');
    console.log('');
    
    // Test connection first
    const connectionOk = await testConnection();
    
    if (!connectionOk) {
        console.log('🔨 Attempting to create table...');
        const tableCreated = await createTable();
        
        if (!tableCreated) {
            console.log('');
            console.log('❌ Automatic table creation failed.');
            console.log('📋 Please follow the manual setup instructions above.');
            process.exit(1);
        }
    }
    
    // Insert default content
    await insertDefaultContent();
    
    console.log('');
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Run: npm run preview');
    console.log('2. Visit: http://localhost:4173/admin');
    console.log('3. Login with: admin / admin123');
    console.log('4. Test the CMS functionality');
}

main().catch(console.error); 