import type { NextApiRequest, NextApiResponse } from 'next';
import { aggregateJobs } from '@/lib/jobAggregator';

/**
 * API endpoint to trigger job aggregation
 * POST /api/jobs/aggregate
 * 
 * Should be called via cron job or manual trigger
 * Protect this endpoint in production with API key
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple API key protection
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  if (apiKey !== process.env.AGGREGATOR_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🚀 Starting job aggregation via API...');
    await aggregateJobs();
    
    return res.status(200).json({
      success: true,
      message: 'Job aggregation completed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in aggregation API:', error);
    return res.status(500).json({
      success: false,
      error: 'Job aggregation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
