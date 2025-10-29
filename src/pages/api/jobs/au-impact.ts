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
    return res.status(500).json({ error: 'Internal server error' });
  }
}
