# 🔥 URGENT FIX: Database Configuration Required

## The Problem
Your `/api/jobs/global` endpoint is failing with **500 errors** because:
- The API uses **Prisma + PostgreSQL**
- `DATABASE_URL` environment variable is **not set in Vercel**
- Prisma cannot connect to a database → throws errors → 500 response

## Quick Fix (5 minutes)

### Step 1: Get a Free PostgreSQL Database

**Option A: Vercel Postgres (Easiest)**
```bash
# 1. Go to your Vercel project dashboard
# 2. Click "Storage" tab
# 3. Click "Create Database" → Select "Postgres"
# 4. Vercel automatically adds DATABASE_URL to your env vars
```

**Option B: Supabase (Free tier)**
1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Copy the "Connection String" (Transaction mode)

**Option C: Neon (Free tier)**
1. Go to https://neon.tech
2. Create new project
3. Copy the connection string

### Step 2: Add DATABASE_URL to Vercel

```bash
# Go to: https://vercel.com/webecodin/project-aura-cyan/settings/environment-variables

# Add this variable:
Variable Name: DATABASE_URL
Value: postgresql://user:password@host:5432/dbname
Environments: Production, Preview, Development

# Click "Save"
```

### Step 3: Run Database Migration

```bash
# In your terminal (local):
npx prisma migrate deploy

# Or generate and push:
npx prisma db push
```

### Step 4: Redeploy

```bash
# Option A: Via Vercel dashboard
Go to Deployments → Click "Redeploy"

# Option B: Push a commit
git commit --allow-empty -m "Trigger redeploy with DATABASE_URL"
git push
```

## Testing Locally (Right Now)

You can test with a local database:

```bash
# 1. Create .env file
cp .env.example .env

# 2. Edit .env and update DATABASE_URL
# For local PostgreSQL:
DATABASE_URL="postgresql://postgres:password@localhost:5432/project_aura"

# 3. Run migrations
npx prisma migrate dev

# 4. Optional: Seed with test data
npx prisma db seed

# 5. Start server
npm run dev
```

## Alternative: Mock Database (Quick workaround)

If you just need it working NOW without a database, I can modify the code to use mock data temporarily:

```typescript
// src/pages/api/jobs/global.ts - Add this at the top:
const MOCK_MODE = !process.env.DATABASE_URL;

if (MOCK_MODE) {
  // Return mock data
  return res.status(200).json({
    jobs: [
      {
        id: '1',
        title: 'ML Training Engineer',
        company: 'AI Innovations',
        description: 'Join our team...',
        location: 'Remote',
        locationType: 'REMOTE_GLOBAL',
        jobType: 'FULL_TIME',
        category: 'ENGINEERING',
        vibeScore: 85,
        source: 'manual',
        sourceUrl: 'https://example.com',
        tags: ['machine-learning', 'training'],
        isActive: true,
        postedAt: new Date(),
      }
    ],
    total: 1,
    page: 1,
    pages: 1,
  });
}
```

## Which option do you want?
- **A**: Set up real database on Vercel (5 min, proper solution)
- **B**: Use local PostgreSQL for testing
- **C**: Add mock mode temporarily (I'll modify the code now)
