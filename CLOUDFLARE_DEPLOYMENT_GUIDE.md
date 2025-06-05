# 🚀 Cloudflare Pages Deployment Guide

## 🎯 Overview

This guide will help you deploy your portfolio with Supabase database to Cloudflare Pages, ensuring your CMS works perfectly in production.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ **Active Supabase account** with a project
- ✅ **Cloudflare account**
- ✅ **GitHub repository** with your portfolio code
- ✅ **Environment variables** ready

## 🔗 Step 1: Connect Your Supabase Account

Run the interactive setup script to connect your new Supabase account:

```bash
npm run supabase:connect
```

This script will:
- ✅ Prompt for your Supabase URL and API key
- ✅ Test the database connection
- ✅ Create necessary tables
- ✅ Insert default portfolio content
- ✅ Show you the environment variables needed

### Alternative: Manual Supabase Setup

If the script doesn't work, set up manually:

1. **Go to your Supabase Dashboard** → Settings → API
2. **Copy your credentials**:
   - Project URL: `https://yourproject.supabase.co`
   - anon public key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. **Create database tables**:
   - Go to SQL Editor
   - Copy and paste contents of `complete-database-setup.sql`
   - Run the script

## 🌐 Step 2: Deploy to Cloudflare Pages

### Option A: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Supabase integration"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Pages**
   - Click **Create a project**
   - Select **Connect to Git**
   - Choose your GitHub repository

3. **Configure Build Settings**:
   ```bash
   Framework: SvelteKit
   Build command: npm run build
   Build output directory: build
   Root directory: (leave empty)
   ```

### Option B: Direct Upload

1. **Build your project**:
   ```bash
   npm run deploy:prepare
   ```

2. **Upload to Cloudflare**:
   - Go to Cloudflare Pages
   - Click **Upload assets**
   - Upload the `build` folder

## ⚙️ Step 3: Configure Environment Variables

In your Cloudflare Pages project settings:

1. **Go to Settings → Environment variables**
2. **Add these variables** (get values from Step 1):

### Production Variables
```bash
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=your_anon_public_key_here
DATABASE_URL=postgresql://postgres:your_password@db.yourproject.supabase.co:5432/postgres
SESSION_SECRET=your_secure_random_string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Important Notes:
- ⚠️ **Never use the service role key** for client-side operations
- ✅ **Use anon key** for public API access
- 🔒 **Keep DATABASE_URL secret** (only for server-side operations)
- 🔐 **Generate strong SESSION_SECRET** for production

## 🛠️ Step 4: Verify Deployment

### Test Your Deployed Site

1. **Visit your Cloudflare Pages URL**
2. **Check the portfolio loads correctly**
3. **Test the admin panel**: `/admin`
4. **Login with**: admin / admin123
5. **Test content editing** and saving

### Common Issues & Solutions

#### 1. **Environment Variables Not Loading**
```
Error: SUPABASE_URL is undefined
```
**Solution**:
- Check environment variables in Cloudflare Pages settings
- Redeploy after adding variables
- Ensure variable names match exactly

#### 2. **Database Connection Failed**
```
Error: Failed to connect to database
```
**Solution**:
- Verify Supabase URL and key are correct
- Check if database is accessible from Cloudflare
- Ensure anon key has proper permissions

#### 3. **Tables Not Found**
```
Error: relation "portfolio_content" does not exist
```
**Solution**:
- Run the SQL setup script in Supabase dashboard
- Check if tables were created properly
- Verify database name and schema

#### 4. **Admin Login Issues**
```
Error: Authentication failed
```
**Solution**:
- Check if admin_users table exists
- Verify admin user was created
- Run initialization manually in Supabase

## 🔐 Step 5: Production Security

### Enable Row Level Security (RLS)

Add this to your Supabase SQL editor:

```sql
-- Enable RLS on tables
ALTER TABLE portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to portfolio content
CREATE POLICY "Public read access" ON portfolio_content
  FOR SELECT USING (true);

-- Allow anon key to read/write portfolio content
CREATE POLICY "Anon key access" ON portfolio_content
  FOR ALL USING (true);

-- Restrict admin users to authenticated access only
CREATE POLICY "Admin access only" ON admin_users
  FOR ALL USING (auth.role() = 'authenticated');
```

### Change Default Passwords

1. **Login to your admin panel**
2. **Go to user management**
3. **Change admin password** from default
4. **Create additional admin users** if needed

### Secure Environment Variables

```bash
# Generate strong session secret
SESSION_SECRET=$(openssl rand -base64 32)

# Use strong admin password
ADMIN_PASSWORD=your_very_secure_password_here
```

## 📊 Step 6: Monitor & Maintain

### Supabase Monitoring

- **Check database usage** in Supabase dashboard
- **Monitor API requests** and limits
- **Set up database backups**
- **Review access logs** regularly

### Cloudflare Analytics

- **Enable Web Analytics** in Cloudflare
- **Monitor site performance**
- **Check for errors** in Function logs
- **Review security events**

## 🚀 Step 7: Custom Domain (Optional)

### Add Your Domain

1. **In Cloudflare Pages**:
   - Go to **Custom domains**
   - Click **Set up a custom domain**
   - Enter your domain name

2. **Update DNS**:
   - Add CNAME record pointing to your Pages URL
   - Wait for DNS propagation

3. **Enable HTTPS**:
   - Cloudflare automatically provides SSL
   - Force HTTPS redirects

## 🎉 Deployment Checklist

### Before Deployment:
- [ ] Supabase account created and connected
- [ ] Database tables created with `complete-database-setup.sql`
- [ ] Environment variables configured
- [ ] Project builds successfully with `npm run build`
- [ ] Admin login tested locally

### After Deployment:
- [ ] Site loads correctly at Cloudflare URL
- [ ] Admin panel accessible at `/admin`
- [ ] Database operations work (create/read/update)
- [ ] Content persists between visits
- [ ] Default admin login works
- [ ] Environment variables loaded properly

### Production Security:
- [ ] Row Level Security (RLS) enabled
- [ ] Default admin password changed
- [ ] Strong session secret generated
- [ ] Database permissions reviewed
- [ ] Monitoring and backups set up

## 🆘 Troubleshooting

### Build Errors

```bash
# Clear node modules and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Issues

```bash
# Test connection locally
npm run supabase:connect

# Manual table creation
# Copy complete-database-setup.sql to Supabase SQL Editor
```

### Cloudflare Deployment Issues

- Check build logs in Cloudflare dashboard
- Verify build command and output directory
- Ensure all dependencies are in package.json
- Check for missing environment variables

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages
- **SvelteKit Deployment**: https://kit.svelte.dev/docs/adapters

---

## 🎯 Success!

Your portfolio is now:
- ✅ **Deployed to Cloudflare Pages**
- ✅ **Connected to Supabase database**
- ✅ **Scalable and reliable**
- ✅ **Production-ready**
- ✅ **Globally distributed**

### 🚀 What You Have:

1. **Professional portfolio website**
2. **Content Management System (CMS)**
3. **Persistent database storage**
4. **Admin authentication system**
5. **Global CDN distribution**
6. **Automatic SSL/HTTPS**
7. **Scalable infrastructure**

**Your portfolio is now live and ready for the world!** 🌍 