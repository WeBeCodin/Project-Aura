import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Validate DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set!');
  console.error('Please configure DATABASE_URL in your environment or .env file');
  
  // In development, provide helpful guidance
  if (process.env.NODE_ENV === 'development') {
    console.error('\nTo fix this:');
    console.error('1. Copy .env.example to .env');
    console.error('2. Update DATABASE_URL in .env with your database connection string');
    console.error('3. Run: npm run prisma:migrate');
  }
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
