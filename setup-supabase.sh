#!/bin/bash

echo "🚀 Setting up Supabase Database for Portfolio CMS"
echo "================================================="

# Create or update .env file
ENV_FILE=".env"

echo ""
echo "📝 Creating/updating environment configuration..."

# Check if .env exists, if not create it
if [ ! -f "$ENV_FILE" ]; then
    touch "$ENV_FILE"
    echo "Created new .env file"
else
    echo "Found existing .env file"
fi

# Add Supabase configuration to .env (avoid duplicates)
if ! grep -q "SUPABASE_URL" "$ENV_FILE"; then
    echo "" >> "$ENV_FILE"
    echo "# Supabase Configuration" >> "$ENV_FILE"
    echo "SUPABASE_URL=https://dttkwomsrqrjshuutiac.supabase.co" >> "$ENV_FILE"
    echo "SUPABASE_ANON_KEY=your_supabase_anon_key_here" >> "$ENV_FILE"
    echo "DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.dttkwomsrqrjshuutiac.supabase.co:5432/postgres" >> "$ENV_FILE"
    echo "✅ Added Supabase configuration to .env"
else
    echo "⚠️  Supabase configuration already exists in .env"
fi

# Add session and admin config if not present
if ! grep -q "SESSION_SECRET" "$ENV_FILE"; then
    echo "" >> "$ENV_FILE"
    echo "# Session Configuration" >> "$ENV_FILE"
    echo "SESSION_SECRET=$(openssl rand -base64 32)" >> "$ENV_FILE"
    echo "✅ Generated session secret"
fi

if ! grep -q "ADMIN_USERNAME" "$ENV_FILE"; then
    echo "" >> "$ENV_FILE"
    echo "# Admin Credentials" >> "$ENV_FILE"
    echo "ADMIN_USERNAME=admin" >> "$ENV_FILE"
    echo "ADMIN_PASSWORD=admin123" >> "$ENV_FILE"
    echo "✅ Added admin credentials"
fi

echo ""
echo "🔧 Next Steps Required:"
echo "======================"
echo ""
echo "1. 📊 Set up your Supabase project:"
echo "   • Go to https://supabase.com"
echo "   • Create a new project or use your existing project"
echo "   • Get your Supabase URL and anon key from Settings > API"
echo ""
echo "2. 🔑 Update your .env file with real values:"
echo "   • Replace 'your_supabase_anon_key_here' with your actual anon key"
echo "   • Replace '[YOUR-PASSWORD]' in DATABASE_URL with your database password"
echo ""
echo "3. 🗄️  Run the database setup:"
echo "   • Copy the contents of 'database-setup.sql'"
echo "   • Go to your Supabase dashboard > SQL Editor"
echo "   • Paste and run the SQL script to create the portfolio_content table"
echo ""
echo "4. 🔒 Configure database permissions (optional):"
echo "   • Enable Row Level Security if needed"
echo "   • Set up authentication policies based on your requirements"
echo ""
echo "5. 🚀 Test the integration:"
echo "   • Run: npm run build"
echo "   • Run: npm run preview"
echo "   • Test the admin panel to ensure data persists"
echo ""
echo "📋 Your current .env file:"
echo "========================="
cat "$ENV_FILE"
echo ""
echo ""
echo "🎉 Setup script completed!"
echo "Your portfolio will now use Supabase for persistent data storage."
echo ""
echo "For troubleshooting, check the console logs in your browser's developer tools." 