# 🌐 Cloudflare Pages Environment Variables Setup

## 🚨 IMPORTANT: Your CMS Admin Panel & Database Updates Won't Work Without This!

Your portfolio is deployed but the admin system and content updates are failing because **environment variables are not set** in Cloudflare Pages.

## 📋 Required Steps

### **Step 1: Access Cloudflare Dashboard**

1. Go to: https://dash.cloudflare.com/pages
2. Find your project: **portfolio-apq**
3. Click on your project name

### **Step 2: Navigate to Settings**

1. Click **Settings** tab
2. Click **Environment Variables** section
3. Click **Add variable**

### **Step 3: Add These Environment Variables**

**For Production environment, add these variables:**

```bash
SUPABASE_URL
https://dttkwomsrqrjshuutiac.supabase.co

SUPABASE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dGt3b21zcnFyanNodXV0aWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzY0NzksImV4cCI6MjA2NDY1MjQ3OX0._xG1W5ZePSHUzUTWBufnjBTzgP6GTSbgY-a2z38T1yw

DATABASE_URL
postgresql://postgres:<your-db-password>@db.dttkwomsrqrjshuutiac.supabase.co:5432/postgres

SESSION_SECRET
<generate-with: openssl rand -base64 32>
```

### **Step 4: Save and Redeploy**

1. Click **Save** after adding each variable
2. Go to **Deployments** tab
3. Click **Retry deployment** on the latest deployment

## 🧪 **Test After Setup**

### **Test 1: Admin Authentication**

```bash
curl -X POST https://YOUR-DEPLOYMENT.pages.dev/api/admin \
  -H "Content-Type: application/json" \
  -d '{"action": "authenticate", "username": "admin", "password": "admin123"}'
```

**Expected Response:**

```json
{"message":"Authentication successful","user":{"username":"admin",...}}
```

### **Test 2: Content API**

```bash
curl https://YOUR-DEPLOYMENT.pages.dev/api/content
```

**Expected Response:**

```json
{"hero":{"title":"Data Analyst",...},...}
```

## 🎯 **Once Environment Variables Are Set**

### **✅ What Will Work:**

- ✅ Admin login at: `https://YOUR-SITE.pages.dev/admin`
- ✅ Content editing and saving in admin panel
- ✅ Real-time database updates
- ✅ Changes persist and show on main site

### **🔐 Admin Credentials:**

- **Username:** `admin`
- **Password:** `admin123`

## 🚀 **Your Live URLs**

- **Portfolio:** https://9b8e344f.portfolio-apq.pages.dev/
- **Admin Panel:** https://9b8e344f.portfolio-apq.pages.dev/admin
- **API Endpoint:** https://9b8e344f.portfolio-apq.pages.dev/api/content

## 💡 **Alternative: Use Wrangler CLI**

If you prefer command-line setup:

```bash
npx wrangler pages secret put SUPABASE_URL --project-name portfolio
npx wrangler pages secret put SUPABASE_KEY --project-name portfolio
npx wrangler pages secret put DATABASE_URL --project-name portfolio
npx wrangler pages secret put SESSION_SECRET --project-name portfolio
```

---

**⚠️ Remember:** Environment variables must be set for both **Production** and **Preview** environments if you want admin to work on both.
