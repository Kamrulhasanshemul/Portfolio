# 🎉 Complete Database & Admin Setup Guide

## 🎯 Overview

This guide will help you set up a complete Supabase database with:
- ✅ **Portfolio content table** with default data
- ✅ **Admin users table** with authentication
- ✅ **Default admin user** for immediate access
- ✅ **Professional CMS functionality**

## 🚀 Quick Setup (Recommended)

### Method 1: Automatic Setup (Easiest)

1. **Update your Supabase credentials** in `.env`:
   ```bash
   # Get these from your Supabase dashboard
   SUPABASE_ANON_KEY=your_actual_anon_key_here
   DATABASE_URL=postgresql://postgres:your_actual_password@db.dttkwomsrqrjshuutiac.supabase.co:5432/postgres
   ```

2. **Start your server**:
   ```bash
   npm run preview
   ```

3. **Run the database setup**:
   ```bash
   npm run db:setup
   ```

4. **Access your admin panel**:
   - Visit: http://localhost:4173/admin
   - Login: admin / admin123

### Method 2: Manual Database Setup

If automatic setup doesn't work:

1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy and paste** the contents of `complete-database-setup.sql`
3. **Run the SQL script**
4. **Restart your server**: `npm run preview`

## 📋 What Gets Created

### **Database Tables:**

#### `portfolio_content`
- Stores all portfolio data as JSON
- Auto-timestamps for tracking changes
- Default content pre-loaded

#### `admin_users`
- Secure admin user management
- Password hashing with bcrypt
- Role-based access (admin/editor)
- Login tracking

### **Default Admin User:**
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@portfolio.local`
- **Role**: `admin`

## 🔐 Admin Features

### **Authentication System:**
- ✅ Secure password hashing
- ✅ Session management
- ✅ Role-based permissions
- ✅ Login tracking

### **User Management:**
- ✅ Create new admin users
- ✅ Update user profiles
- ✅ Change passwords
- ✅ Role assignment

### **CMS Integration:**
- ✅ Content editing
- ✅ Real-time updates
- ✅ Data validation
- ✅ Backup functionality

## 🛠️ Available Scripts

After setup, you can use these commands:

```bash
# Setup database (automatic)
npm run db:setup

# Create tables manually
npm run db:create-table

# Setup Supabase environment
npm run supabase:setup

# Start development server
npm run dev

# Start preview server
npm run preview
```

## 🔍 API Endpoints

### Admin Management (`/api/admin`)

#### Create Admin User
```javascript
POST /api/admin
{
  "action": "create",
  "username": "newadmin",
  "email": "admin@example.com", 
  "password": "securepassword",
  "role": "admin"
}
```

#### Authenticate Admin
```javascript
POST /api/admin
{
  "action": "authenticate",
  "username": "admin",
  "password": "admin123"
}
```

#### Initialize System
```javascript
POST /api/admin
{
  "action": "initialize"
}
```

### Content Management (`/api/content`)

#### Get Content
```javascript
GET /api/content
```

#### Update Content
```javascript
PUT /api/content
{
  "hero": { ... },
  "about": { ... },
  // ... other sections
}
```

## 🚀 Getting Started

### Step 1: Environment Setup
```bash
# Copy and update your .env file
SUPABASE_URL=https://dttkwomsrqrjshuutiac.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### Step 2: Database Setup
```bash
# Automatic setup
npm run db:setup

# OR manual setup in Supabase SQL Editor
# Run: complete-database-setup.sql
```

### Step 3: Access Admin Panel
```bash
# Start server
npm run preview

# Visit admin panel
open http://localhost:4173/admin

# Login with:
# Username: admin
# Password: admin123
```

## 🔧 Troubleshooting

### **Connection Issues**
```
Error: Failed to connect to database
```
**Solution**: 
- Check your `SUPABASE_ANON_KEY` and `DATABASE_URL`
- Ensure your Supabase project is active
- Verify credentials in Supabase dashboard

### **Table Not Found**
```
Error: relation "portfolio_content" does not exist
```
**Solution**: 
- Run the SQL setup script in Supabase dashboard
- Or use: `npm run db:setup`

### **Admin Creation Failed**
```
Error: Failed to create admin user
```
**Solution**:
- Check if admin already exists
- Verify admin_users table was created
- Run initialization manually

### **Authentication Errors**
```
Error: Authentication failed
```
**Solution**:
- Use correct credentials: admin / admin123
- Check if admin user exists in database
- Verify password hashing is working

## 📊 Database Schema

### Portfolio Content Table
```sql
CREATE TABLE portfolio_content (
    id SERIAL PRIMARY KEY,
    content_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Admin Users Table
```sql
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);
```

## 🔒 Security Features

### **Password Security**
- BCrypt hashing with salt rounds
- No plain text password storage
- Secure password validation

### **Session Management**
- Secure session handling
- Login tracking
- Automatic logout on inactivity

### **Database Security**
- Prepared statements prevent SQL injection
- Input validation and sanitization
- Role-based access control

## 🎯 Production Deployment

### **Environment Variables**
```bash
# Production Supabase credentials
SUPABASE_URL=your_production_url
SUPABASE_ANON_KEY=your_production_key

# Strong session secret
SESSION_SECRET=your_secure_random_secret

# Optional: Custom admin credentials
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
```

### **Security Recommendations**
1. **Change default admin password**
2. **Enable Row Level Security (RLS)**
3. **Use strong session secrets**
4. **Regular password rotation**
5. **Monitor admin access logs**

## 🎉 Success!

You now have a **complete portfolio CMS** with:

- ✅ **Persistent Supabase database**
- ✅ **Secure admin authentication**
- ✅ **Professional user management**
- ✅ **Content management system**
- ✅ **Production-ready architecture**

### **Next Steps:**
1. **Customize your portfolio content**
2. **Add additional admin users**
3. **Deploy to production**
4. **Monitor and maintain**

---

**Your portfolio is now equipped with enterprise-grade database infrastructure!** 🚀 