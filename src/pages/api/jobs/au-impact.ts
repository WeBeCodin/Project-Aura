import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { JobType } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      type,
      region,
      industry,
      aiFocus,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isActive: true,
      isImpactHub: true,
    };

    if (type) {
      where.jobType = type as JobType;
    }

    if (region) {
      where.location = { contains: region as string, mode: 'insensitive' };
    }

    if (industry) {
      where.tags = { has: industry as string };
    }

    if (aiFocus) {
      where.tags = { has: aiFocus as string };
    }

    const [opportunities, total] = await Promise.all([
      prisma.jobListing.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { postedAt: 'desc' },
      }),
      prisma.jobListing.count({ where }),
    ]);

    const pages = Math.ceil(total / limitNum);

    return res.status(200).json({
      opportunities,
      total,
      page: pageNum,
      pages,
    });
  } catch (error) {
    console.error('Error in /api/jobs/au-impact:', error);
    
    // Provide more detailed error information in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check for common database errors
    if (errorMessage.includes('DATABASE_URL')) {
      console.error('DATABASE_URL environment variable is not set or is invalid');
      return res.status(500).json({ 
        error: 'Database configuration error',
        ...(isDevelopment && { details: 'DATABASE_URL is not configured. Please set the DATABASE_URL environment variable.' })
      });
    }
    
    if (errorMessage.includes('PrismaClient')) {
      console.error('Prisma Client initialization error');
      return res.status(500).json({ 
        error: 'Database client error',
        ...(isDevelopment && { details: 'Prisma Client may not be properly generated. Run: npx prisma generate' })
      });
    }
    
    if (errorMessage.includes('connect') || errorMessage.includes('ECONNREFUSED')) {
      console.error('Database connection error');
      return res.status(500).json({ 
        error: 'Database connection error',
        ...(isDevelopment && { details: 'Cannot connect to database. Check DATABASE_URL and database availability.' })
      });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      ...(isDevelopment && { details: errorMessage })
    });
  }
}
