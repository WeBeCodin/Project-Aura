/**
 * Integration tests for /api/jobs/global endpoint
 * 
 * These tests verify that the API endpoint handles various scenarios correctly,
 * including missing database configuration and various query parameters.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/jobs/global';

// Mock the prisma client
jest.mock('../../lib/prisma', () => ({
  prisma: {
    jobListing: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Mock the error handler to avoid console.error in tests
jest.mock('../../lib/apiErrorHandler', () => ({
  handleApiError: jest.fn((error, res, endpointName) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('DATABASE_URL')) {
      res.status(500).json({ error: 'Database configuration error' });
    } else if (errorMessage.includes('PrismaClient')) {
      res.status(500).json({ error: 'Database client error' });
    } else if (errorMessage.includes('connect') || errorMessage.includes('ECONNREFUSED')) {
      res.status(500).json({ error: 'Database connection error' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }),
}));

import { prisma } from '../../lib/prisma';

describe('API /api/jobs/global', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    
    req = {
      method: 'GET',
      query: {},
    };
    
    res = {
      status: statusMock,
    };

    jest.clearAllMocks();
  });

  it('should return 405 for non-GET requests', async () => {
    req.method = 'POST';

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(405);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('should return jobs successfully with no filters', async () => {
    const mockJobs = [
      {
        id: '1',
        title: 'Test Job',
        company: 'Test Company',
        description: 'Test Description',
        location: 'Remote (Global)',
        locationType: 'REMOTE_GLOBAL',
        jobType: 'FULL_TIME',
        category: 'AI_ML_ENGINEERING',
        vibeScore: 85,
        source: 'Test',
        sourceUrl: 'https://test.com',
        tags: [],
        isActive: true,
        isAuOnly: false,
        isImpactHub: false,
        postedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.jobListing.findMany as jest.Mock).mockResolvedValue(mockJobs);
    (prisma.jobListing.count as jest.Mock).mockResolvedValue(1);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      jobs: mockJobs,
      total: 1,
      page: 1,
      pages: 1,
    });
  });

  it('should filter by category correctly', async () => {
    req.query = { category: 'AI_ML_ENGINEERING' };

    (prisma.jobListing.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.jobListing.count as jest.Mock).mockResolvedValue(0);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(prisma.jobListing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { category: 'AI_ML_ENGINEERING' },
          ]),
        }),
      })
    );
  });

  it('should filter by search term correctly', async () => {
    req.query = { search: 'engineer' };

    (prisma.jobListing.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.jobListing.count as jest.Mock).mockResolvedValue(0);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(prisma.jobListing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            expect.objectContaining({
              OR: expect.arrayContaining([
                { title: { contains: 'engineer', mode: 'insensitive' } },
                { description: { contains: 'engineer', mode: 'insensitive' } },
                { company: { contains: 'engineer', mode: 'insensitive' } },
              ]),
            }),
          ]),
        }),
      })
    );
  });

  it('should filter by vibeScore correctly', async () => {
    req.query = { vibeScore: '75' };

    (prisma.jobListing.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.jobListing.count as jest.Mock).mockResolvedValue(0);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(prisma.jobListing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { vibeScore: { gte: 75 } },
          ]),
        }),
      })
    );
  });

  it('should handle pagination correctly', async () => {
    req.query = { page: '2', limit: '10' };

    (prisma.jobListing.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.jobListing.count as jest.Mock).mockResolvedValue(25);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(prisma.jobListing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 10,
        take: 10,
      })
    );

    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 2,
        pages: 3,
        total: 25,
      })
    );
  });

  it('should return 500 with database error message on DATABASE_URL error', async () => {
    const error = new Error('Environment variable not found: DATABASE_URL');
    (prisma.jobListing.findMany as jest.Mock).mockRejectedValue(error);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Database configuration error',
      })
    );
  });

  it('should return 500 with database client error message on PrismaClient error', async () => {
    const error = new Error('PrismaClient initialization failed');
    (prisma.jobListing.findMany as jest.Mock).mockRejectedValue(error);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Database client error',
      })
    );
  });

  it('should return 500 with connection error message on connection failure', async () => {
    const error = new Error('ECONNREFUSED');
    (prisma.jobListing.findMany as jest.Mock).mockRejectedValue(error);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Database connection error',
      })
    );
  });

  it('should return 500 with generic error for unknown errors', async () => {
    const error = new Error('Unknown database error');
    (prisma.jobListing.findMany as jest.Mock).mockRejectedValue(error);

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Internal server error',
      })
    );
  });
});
