# Project Aura - Deployment Guide

This guide covers deploying Project Aura to production using Vercel and PostgreSQL.

## Quick Start (TL;DR)

To deploy immediately to Vercel:

1. **Import to Vercel**: Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository
2. **Add Environment Variables** in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string (min 32 characters)
   - `NEXT_PUBLIC_API_URL`: Your Vercel app URL (e.g., `https://your-app.vercel.app`)
3. **Deploy**: Vercel will automatically build and deploy your app
4. **Initialize Database**: Run `npx prisma migrate deploy` with your production DATABASE_URL

That's it! The build process automatically handles Prisma Client generation via the `postinstall` hook.

## Prerequisites

- [Vercel Account](https://vercel.com)
- PostgreSQL database (e.g., [Supabase](https://supabase.com), [Railway](https://railway.app), or [Neon](https://neon.tech))
- GitHub repository connected to Vercel

## Environment Variables

The following environment variables are required for production:

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"

# JWT Authentication
JWT_SECRET="your-production-jwt-secret-min-32-chars"

# Next.js
NEXT_PUBLIC_API_URL="https://your-domain.vercel.app"
```

### Optional Variables

```bash
# Sentry (for error monitoring)
SENTRY_DSN="your-sentry-dsn"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
```

## Deployment Steps

### 1. Set Up PostgreSQL Database

Choose a PostgreSQL provider and create a new database:

**Option A: Supabase (Recommended)**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string from Settings → Database
4. Use the "Connection Pooling" URI for production

**Option B: Railway**
1. Go to [railway.app](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string

**Option C: Neon**
1. Go to [neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string

### 2. Configure Vercel Project

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Link your project
   vercel link
   ```

2. **Add Environment Variables**
   ```bash
   # Add production environment variables
   vercel env add DATABASE_URL production
   vercel env add JWT_SECRET production
   vercel env add NEXT_PUBLIC_API_URL production
   ```

   Or via Vercel Dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add each variable with appropriate values

3. **Set Build Settings**
   
   Vercel should auto-detect Next.js. Verify these settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (or leave empty to use default)
   - **Output Directory**: `.next` (or leave empty to use default)
   - **Install Command**: `npm install` (or leave empty to use default)

   **Note**: The build process automatically includes:
   - `postinstall` script runs `prisma generate` after npm install
   - `build` script runs `prisma generate && next build`
   - This ensures Prisma Client is always generated before building

### 3. Initialize Database

Run database migrations on your production database:

```bash
# Set DATABASE_URL for production
export DATABASE_URL="your-production-database-url"

# Run migrations (this will create all tables and enums)
npx prisma migrate deploy

# Optional: Seed with sample data
npm run prisma:seed
```

**Important**: Do NOT run `prisma migrate dev` on production. Always use `prisma migrate deploy` for production deployments.

### 4. Deploy to Production

**Automatic Deployment (Recommended)**
- Push to your `main` branch
- Vercel automatically builds and deploys

**Manual Deployment**
```bash
# Deploy to production
vercel --prod
```

### 5. Verify Deployment

1. **Check Build Status**
   - Visit Vercel Dashboard
   - Check deployment logs
   - Ensure build completed successfully

2. **Test API Endpoints**
   ```bash
   # Test global jobs API
   curl https://your-domain.vercel.app/api/jobs/global
   
   # Test AU-exclusive API
   curl https://your-domain.vercel.app/api/jobs/au-exclusive
   
   # Test AU Impact Hub API
   curl https://your-domain.vercel.app/api/jobs/au-impact
   ```

3. **Test Web Interface**
   - Visit `https://your-domain.vercel.app`
   - Test search functionality
   - Test filters (Category, Vibe Score, AU-Exclusive)
   - Visit `/au/impact` and test tabs

## Continuous Deployment

The `.github/workflows/supercharger.yml` pipeline runs on every push:

1. **Specification Validation** - Verifies specs are valid
2. **Type Generation** - Generates Prisma types
3. **Test Suite** - Runs unit and integration tests
4. **Visual Regression** - Runs E2E tests with Playwright
5. **Deploy Preview** - Creates Vercel preview deployment

### Branch Strategy

- `main` → Production deployment
- `develop` → Preview deployment
- Feature branches → Preview deployments

## Database Migrations

### Creating Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migration to production
npx prisma migrate deploy
```

### Backup Strategy

**Recommended Backup Schedule:**
- Automated daily backups (via database provider)
- Pre-deployment backups (manual)
- Weekly full backups

## Monitoring & Observability

### Vercel Analytics

Enable Vercel Analytics in your dashboard:
- Real-time traffic monitoring
- Performance metrics
- Geographic distribution

### Sentry Integration (Optional)

1. Create a Sentry project
2. Add Sentry DSN to environment variables
3. Install Sentry package: `npm install @sentry/nextjs`
4. Configure `sentry.client.config.js` and `sentry.server.config.js`

### Logging

- Production logs available in Vercel Dashboard
- Filter by function, time range, and log level
- Set up alerts for errors

## Performance Optimization

### Edge Functions

API routes are deployed as Vercel Edge Functions for optimal performance:
- Global distribution
- Sub-100ms cold starts
- Automatic scaling

### Database Connection Pooling

Use connection pooling to prevent database connection exhaustion:

```typescript
// src/lib/prisma.ts already implements singleton pattern
// Ensure DATABASE_URL uses connection pooling endpoint
```

### Caching Strategy

Implement caching for frequently accessed data:
- Use `stale-while-revalidate` for job listings
- Cache API responses with appropriate TTL
- Leverage Vercel Edge Network caching

## Troubleshooting

### Build Failures

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**Error: Type errors**
```bash
# Regenerate Prisma types
npx prisma generate
npm run build
```

**Error: Prisma Client not generated**
This should not happen if you've followed the setup correctly, as the `postinstall` script automatically generates Prisma Client. However, if it does:
```bash
# Ensure postinstall script is in package.json
npm run postinstall
# Or manually generate
npx prisma generate
```

**Error: Cannot find module '@prisma/client'**
- Verify `@prisma/client` is in dependencies (not devDependencies)
- Ensure `postinstall` script runs `prisma generate`
- Check that DATABASE_URL environment variable is set in Vercel

### Database Connection Issues

**Error: Connection timeout**
- Verify DATABASE_URL is correct in Vercel environment variables
- Check firewall rules allow Vercel IP ranges
- Use connection pooling endpoint (e.g., Supabase transaction pooling)

**Error: Too many connections**
- Enable connection pooling in your DATABASE_URL
- Use database provider's connection pooling feature
- For Supabase: Use the "Transaction" mode connection string

**Error: Database migrations not applied**
```bash
# Connect to your production database
export DATABASE_URL="your-production-database-url"

# Apply migrations
npx prisma migrate deploy

# Verify schema is up to date
npx prisma db push --accept-data-loss  # Use with caution!
```

### API Errors

**500 Internal Server Error**
- Check Vercel function logs
- Verify environment variables are set
- Check database connectivity

**404 Not Found**
- Verify API routes are correctly deployed
- Check route naming matches specifications

## Security Considerations

### Environment Variables
- Never commit `.env` files
- Rotate JWT secrets regularly
- Use strong database passwords

### Database Security
- Enable SSL connections (included in DATABASE_URL)
- Restrict database access to Vercel IPs
- Regular security audits

### API Security
- Rate limiting (implement with middleware)
- Input validation on all endpoints
- CORS configuration for production domain

## Scaling

### Horizontal Scaling

Vercel automatically scales based on traffic:
- Serverless functions auto-scale
- Edge network handles distribution
- No manual scaling required

### Database Scaling

Monitor database metrics:
- Connection count
- Query performance
- Storage usage

Scale database tier as needed through your provider.

## Rollback Procedure

If deployment fails or introduces issues:

1. **Instant Rollback via Vercel**
   ```bash
   # Rollback to previous deployment
   vercel rollback
   ```

2. **Database Rollback**
   ```bash
   # Restore from backup
   # Follow your database provider's restore procedure
   ```

3. **Redeploy Previous Version**
   ```bash
   # Checkout previous working commit
   git checkout <previous-commit-hash>
   vercel --prod
   ```

## Maintenance Windows

Schedule maintenance for low-traffic periods:
- Database migrations: Sunday 2-4 AM UTC
- Major updates: Announce 24 hours in advance
- Zero-downtime deployments preferred

## Support & Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Prisma Documentation**: [prisma.io/docs](https://prisma.io/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Project Repository**: [github.com/WeBeCodin/Project-Aura](https://github.com/WeBeCodin/Project-Aura)

## Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] All environment variables configured
- [ ] API endpoints responding correctly
- [ ] Web interface loads and functions properly
- [ ] E2E tests pass against production
- [ ] Monitoring and alerts configured
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Backup strategy verified
- [ ] Team notified of deployment

---

**Last Updated**: 2025-10-29  
**Version**: 1.0
