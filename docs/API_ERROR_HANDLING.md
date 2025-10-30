# API Error Handling and Diagnostics

This document describes the error handling improvements and diagnostic tools added to the Project Aura API endpoints.

## Overview

The API endpoints have been enhanced with comprehensive error handling and diagnostic capabilities to help identify and resolve common deployment and configuration issues, particularly the 500 errors that were occurring on the `/api/jobs/global` endpoint.

## Root Cause Analysis

The investigation revealed that the 500 errors were most likely caused by one of the following environment configuration issues:

1. **Missing DATABASE_URL environment variable** - The most common cause in production deployments
2. **Database connection failures** - Network issues or incorrect credentials
3. **Prisma Client not generated** - Missing build step or configuration issue

## Changes Made

### 1. Enhanced Error Handling in API Endpoints

All job API endpoints now include detailed error detection and reporting:

- `/api/jobs/global`
- `/api/jobs/au-exclusive`
- `/api/jobs/au-impact`

**Error Categories Detected:**

1. **Database Configuration Error** - When DATABASE_URL is missing or invalid
2. **Database Client Error** - When Prisma Client initialization fails
3. **Database Connection Error** - When database connection is refused
4. **Internal Server Error** - Generic catch-all for other errors

**Development vs Production:**

- In **development** mode (`NODE_ENV=development`), error responses include detailed diagnostic information
- In **production** mode, error responses only include generic error messages to avoid leaking sensitive information

**Example Error Responses:**

Development:
```json
{
  "error": "Database configuration error",
  "details": "DATABASE_URL is not configured. Please set the DATABASE_URL environment variable."
}
```

Production:
```json
{
  "error": "Database configuration error"
}
```

### 2. Early Database Configuration Validation

The Prisma client initialization (`src/lib/prisma.ts`) now validates that DATABASE_URL is set and provides helpful guidance in development:

```
ERROR: DATABASE_URL environment variable is not set!
Please configure DATABASE_URL in your environment or .env file

To fix this:
1. Copy .env.example to .env
2. Update DATABASE_URL in .env with your database connection string
3. Run: npm run prisma:migrate
```

### 3. Health Check Endpoint

A new health check endpoint has been added at `/api/health` to verify system status:

**Endpoint:** `GET /api/health`

**Response (Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-30T10:18:23.898Z",
  "database": {
    "connected": true
  },
  "environment": {
    "hasDatabaseUrl": true,
    "nodeEnv": "development"
  }
}
```

**Response (Unhealthy):**
```json
{
  "status": "unhealthy",
  "timestamp": "2025-10-30T10:18:23.898Z",
  "database": {
    "connected": false,
    "error": "Environment variable not found: DATABASE_URL"
  },
  "environment": {
    "hasDatabaseUrl": false,
    "nodeEnv": "production"
  }
}
```

**HTTP Status Codes:**
- `200 OK` - System is healthy
- `503 Service Unavailable` - System is unhealthy

### 4. Comprehensive Unit Tests

Added comprehensive unit tests for the `/api/jobs/global` endpoint covering:

- Method validation (GET only)
- Successful responses with various filters
- Category filtering
- Search functionality
- Vibe score filtering
- Pagination
- All error scenarios (DATABASE_URL missing, PrismaClient errors, connection errors)

**Test File:** `src/__tests__/api/jobs-global.test.ts`

**Test Results:** All 13 tests passing ✅

## Usage

### For Developers

1. **Local Development:**
   ```bash
   cp .env.example .env
   # Update DATABASE_URL in .env
   npm install
   npm run prisma:migrate
   npm run dev
   ```

2. **Check System Health:**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Run Tests:**
   ```bash
   npm run test:unit
   ```

### For DevOps/Deployment

1. **Verify Environment Variables:**
   - Ensure `DATABASE_URL` is set in your deployment platform (Vercel, etc.)
   - Ensure `JWT_SECRET` is set
   - Ensure `NEXT_PUBLIC_API_URL` is set

2. **Health Check for Monitoring:**
   Use the `/api/health` endpoint for:
   - Kubernetes/Docker health probes
   - Uptime monitoring services
   - CI/CD pipeline verification

3. **Troubleshooting 500 Errors:**

   **Step 1:** Check the health endpoint
   ```bash
   curl https://your-domain.com/api/health
   ```

   **Step 2:** Check server logs for specific error messages:
   - Look for "DATABASE_URL environment variable is not set"
   - Look for "Prisma Client initialization error"
   - Look for "Database connection error"

   **Step 3:** Verify environment configuration in your deployment platform

   **Step 4:** Ensure Prisma Client is generated during build:
   - The `postinstall` script should run `prisma generate`
   - The `build` script should run `prisma generate && next build`

## Testing the Fix

The improvements have been verified with:

1. ✅ Unit tests (13/13 passing)
2. ✅ Integration tests with database
3. ✅ Manual testing with missing DATABASE_URL
4. ✅ Manual testing with all query parameters
5. ✅ Manual testing of all three job endpoints

All test scenarios from the problem statement now work correctly:
- `/api/jobs/global` (no parameters)
- `/api/jobs/global?category=AI_ML_ENGINEERING`
- `/api/jobs/global?search=training`
- Combined filters

## Benefits

1. **Faster Debugging:** Clear error messages identify the root cause immediately
2. **Better Monitoring:** Health check endpoint enables proactive monitoring
3. **Improved DX:** Developers get helpful guidance on how to fix issues
4. **Production Safety:** Sensitive error details are hidden in production
5. **Better Testing:** Comprehensive test coverage ensures reliability

## Future Improvements

Potential enhancements for consideration:

1. Add request rate limiting to prevent abuse
2. Add response caching for frequently accessed data
3. Add Sentry integration for error tracking
4. Add request/response logging middleware
5. Add API metrics collection (response times, error rates)

## Related Files

- `src/pages/api/jobs/global.ts` - Global jobs endpoint
- `src/pages/api/jobs/au-exclusive.ts` - AU-exclusive jobs endpoint
- `src/pages/api/jobs/au-impact.ts` - AU Impact Hub endpoint
- `src/pages/api/health.ts` - Health check endpoint (new)
- `src/lib/prisma.ts` - Prisma client with validation
- `src/__tests__/api/jobs-global.test.ts` - Unit tests (new)
- `DEPLOYMENT.md` - Deployment guide with troubleshooting

## References

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
