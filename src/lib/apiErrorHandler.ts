import { NextApiResponse } from 'next';

/**
 * Handle API errors with detailed diagnostics
 * 
 * This utility function provides consistent error handling across all API endpoints.
 * It detects specific error types and returns appropriate error messages.
 * 
 * @param error - The error object caught in the try-catch block
 * @param res - Next.js API response object
 * @param endpointName - Name of the endpoint for logging purposes
 */
export function handleApiError(
  error: unknown,
  res: NextApiResponse,
  endpointName: string
): void {
  console.error(`Error in ${endpointName}:`, error);
  
  // Provide more detailed error information in development
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  
  // Check for common database errors
  if (errorMessage.includes('DATABASE_URL')) {
    console.error('DATABASE_URL environment variable is not set or is invalid');
    res.status(500).json({ 
      error: 'Database configuration error',
      ...(isDevelopment && { details: 'DATABASE_URL is not configured. Please set the DATABASE_URL environment variable.' })
    });
    return;
  }
  
  if (errorMessage.includes('PrismaClient')) {
    console.error('Prisma Client initialization error');
    res.status(500).json({ 
      error: 'Database client error',
      ...(isDevelopment && { details: 'Prisma Client may not be properly generated. Run: npx prisma generate' })
    });
    return;
  }
  
  if (errorMessage.includes('connect') || errorMessage.includes('ECONNREFUSED')) {
    console.error('Database connection error');
    res.status(500).json({ 
      error: 'Database connection error',
      ...(isDevelopment && { details: 'Cannot connect to database. Check DATABASE_URL and database availability.' })
    });
    return;
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    ...(isDevelopment && { details: errorMessage })
  });
}
