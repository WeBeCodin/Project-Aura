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
      city,
      locationType,
      category,
      search,
      page = '1',
      limit = '20',
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isActive: true,
      isAuOnly: true,
    };

    if (locationType) {
      where.locationType = locationType as LocationType;
    }

    if (category) {
      where.category = category as JobCategory;
    }

    if (city) {
      where.location = { contains: city as string, mode: 'insensitive' };
    }

    if (search) {
      where.AND = [
        {
          OR: [
            { title: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } },
            { company: { contains: search as string, mode: 'insensitive' } },
          ],
        },
      ];
    }

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
    console.error('Error in /api/jobs/au-exclusive:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
