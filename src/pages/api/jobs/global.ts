import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { JobCategory, LocationType } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      category,
      vibeScore,
      search,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    const andConditions: any[] = [
      { isActive: true },
      { locationType: LocationType.REMOTE_GLOBAL },
    ];

    if (category) {
      andConditions.push({ category: category as JobCategory });
    }

    if (vibeScore) {
      andConditions.push({
        vibeScore: {
          gte: parseInt(vibeScore as string, 10),
        },
      });
    }

    if (search) {
      andConditions.push({
        OR: [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
          { company: { contains: search as string, mode: 'insensitive' } },
        ],
      });
    }

    where.AND = andConditions;

    const [jobs, total] = await Promise.all([
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
      jobs,
      total,
      page: pageNum,
      pages,
    });
  } catch (error) {
    console.error('Error in /api/jobs/global:', error);
    
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
