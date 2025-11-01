# 🎯 5-Minute Database Setup

## ⚡ FASTEST: Vercel Postgres (Recommended)

### Step 1: Create Database in Vercel (2 minutes)

1. **Open Vercel Dashboard:**
   - Go to: https://vercel.com/webecodin/project-aura-cyan/stores
   - Or: Dashboard → Your Project → "Storage" tab

2. **Create Postgres Database:**
   ```
   Click "Create Database"
   → Select "Postgres"
   → Name it: project-aura-db
   → Click "Create"
   ```

3. **Vercel automatically:**
   - Creates the database
   - Adds `DATABASE_URL` to your environment variables
   - Makes it available to your deployment

### Step 2: Get Connection String for Local Development (1 minute)

1. In Vercel Dashboard:
   - Go to: Storage → project-aura-db → ".env.local" tab
   - Copy all the environment variables

2. Paste into your local `.env` file:
   ```bash
   # Open .env file
   code .env
   
   # Paste the variables from Vercel (looks like):
   POSTGRES_URL="postgres://..."
   POSTGRES_PRISMA_URL="postgres://..."
   POSTGRES_URL_NON_POOLING="postgres://..."
   
   # For Prisma, use:
   DATABASE_URL="${POSTGRES_PRISMA_URL}"
   ```

### Step 3: Run Migrations (1 minute)

```bash
# Generate Prisma client
npm run prisma:generate

# Push database schema
npx prisma db push

# Or run migrations
npm run prisma:migrate
```

### Step 4: Seed Database (Optional, 1 minute)

```bash
npm run prisma:seed
```

### Step 5: Test It! (30 seconds)

```bash
# Start dev server
npm run dev

# Test API
curl http://localhost:3000/api/jobs/global
```

---

## 🟣 Alternative: Supabase (If you prefer)

### Quick Setup:

1. **Create Project:**
   - Go to: https://supabase.com/dashboard/projects
   - Click "New Project"
   - Name: project-aura
   - Set password (save it!)
   - Choose region
   - Click "Create"

2. **Get Connection String:**
   - Settings → Database → Connection String
   - Copy "Transaction" mode URL
   - It looks like: `postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.supabase.co:5432/postgres`

3. **Add to .env:**
   ```bash
   DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.supabase.co:5432/postgres"
   ```

4. **Run migrations:**
   ```bash
   npx prisma db push
   ```

5. **Add to Vercel:**
   - Go to: https://vercel.com/webecodin/project-aura-cyan/settings/environment-variables
   - Add `DATABASE_URL` with your Supabase connection string
   - Save and redeploy

---

## 🔵 Alternative: Neon

1. **Create Project:**
   - Go to: https://console.neon.tech/app/projects
   - Click "New Project"
   - Copy connection string

2. **Add to .env:**
   ```bash
   DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb"
   ```

3. **Run migrations:**
   ```bash
   npx prisma db push
   ```

4. **Add to Vercel environment variables**

---

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# 1. Check Prisma can connect
npx prisma db pull

# 2. Check tables exist
npx prisma studio
# Opens GUI at http://localhost:5555

# 3. Test API locally
npm run dev
curl http://localhost:3000/api/jobs/global

# 4. Deploy and test production
# Vercel will auto-deploy when you push
curl https://project-aura-cyan.vercel.app/api/jobs/global
```

---

## 🆘 Troubleshooting

**"Can't reach database server"**
- Check DATABASE_URL format
- Ensure IP allowlist includes 0.0.0.0/0 (for Vercel)
- Verify password doesn't have special chars needing escaping

**"Prisma schema not found"**
```bash
npm run prisma:generate
```

**"Table doesn't exist"**
```bash
npx prisma db push
```

**Still getting 500 errors on Vercel?**
- Verify DATABASE_URL is set in Vercel environment variables
- Check Vercel function logs for actual error
- Redeploy after adding env vars

---

## 🎉 You're Done!

Once DATABASE_URL is set in both:
- ✅ Local `.env` file → for local development
- ✅ Vercel environment variables → for production

The API will work! No more 500 errors. 🚀
