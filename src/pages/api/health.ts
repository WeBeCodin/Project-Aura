import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  database: {
    connected: boolean;
    error?: string;
  };
  environment: {
    hasDatabaseUrl: boolean;
    nodeEnv: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed' 
    } as any);
  }

  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  let databaseConnected = false;
  let databaseError: string | undefined;

  // Try to connect to the database
  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseConnected = true;
  } catch (error) {
    databaseError = error instanceof Error ? error.message : 'Unknown database error';
    console.error('Health check database error:', error);
  }

  const isHealthy = hasDatabaseUrl && databaseConnected;

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: {
      connected: databaseConnected,
      ...(databaseError && { error: databaseError }),
    },
    environment: {
      hasDatabaseUrl,
      nodeEnv: process.env.NODE_ENV || 'unknown',
    },
  });
}
