// Job aggregation service - fetches from multiple sources

import { PrismaClient, LocationType, JobType, JobCategory } from '@prisma/client';

const prisma = new PrismaClient();

interface RawJob {
  title: string;
  company: string;
  description: string;
  location: string;
  url: string;
  tags: string[];
  postedAt: Date;
  jobType?: string;
  salary?: string;
}

/**
 * Fetch jobs from RemoteOK API
 * Free API, no auth required
 */
async function fetchFromRemoteOK(): Promise<RawJob[]> {
  try {
    const response = await fetch('https://remoteok.com/api');
    const data = await response.json();
    
    // Skip first item (it's metadata)
    const jobs = data.slice(1);
    
    return jobs
      .filter((job: any) => job.position && job.company)
      .map((job: any) => ({
        title: job.position,
        company: job.company,
        description: job.description || `${job.position} at ${job.company}`,
        location: job.location || 'Remote (Global)',
        url: `https://remoteok.com/remote-jobs/${job.slug}`,
        tags: job.tags || [],
        postedAt: job.date ? new Date(job.date * 1000) : new Date(), // Fallback to now if no date
        jobType: 'FULL_TIME',
        salary: job.salary_min && job.salary_max 
          ? `$${job.salary_min}-$${job.salary_max}` 
          : undefined,
      }))
      .slice(0, 20); // Limit to 20 jobs
  } catch (error) {
    console.error('Error fetching from RemoteOK:', error);
    return [];
  }
}

/**
 * Fetch jobs from Remotive API
 * Free API for remote jobs
 */
async function fetchFromRemotive(): Promise<RawJob[]> {
  try {
    const response = await fetch('https://remotive.com/api/remote-jobs');
    const data = await response.json();
    
    return data.jobs
      .filter((job: any) => job.title && job.company_name)
      .map((job: any) => ({
        title: job.title,
        company: job.company_name,
        description: job.description || job.title,
        location: job.candidate_required_location || 'Remote (Global)',
        url: job.url,
        tags: job.tags || [job.category],
        postedAt: job.publication_date ? new Date(job.publication_date) : new Date(), // Fallback to now
        jobType: job.job_type || 'FULL_TIME',
        salary: job.salary,
      }))
      .slice(0, 20);
  } catch (error) {
    console.error('Error fetching from Remotive:', error);
    return [];
  }
}

/**
 * Fetch AI/ML jobs from GitHub Jobs (via third-party API)
 */
async function fetchAIMLJobs(): Promise<RawJob[]> {
  try {
    // Using Adzuna API (requires API key) - Alternative: use web scraping
    // For now, returning empty array - you'll need to add your API key
    const apiKey = process.env.ADZUNA_API_KEY;
    const appId = process.env.ADZUNA_APP_ID;
    
    if (!apiKey || !appId) {
      console.log('Adzuna API credentials not set, skipping');
      return [];
    }

    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${apiKey}&what=machine learning OR artificial intelligence&content-type=application/json`
    );
    const data = await response.json();
    
    return data.results.map((job: any) => ({
      title: job.title,
      company: job.company.display_name,
      description: job.description,
      location: job.location.display_name,
      url: job.redirect_url,
      tags: ['AI', 'ML'],
      postedAt: job.created ? new Date(job.created) : new Date(), // Fallback to now
      jobType: job.contract_type || 'FULL_TIME',
    })).slice(0, 20);
  } catch (error) {
    console.error('Error fetching AI/ML jobs:', error);
    return [];
  }
}

/**
 * Categorize job based on title and tags
 */
function categorizeJob(job: RawJob): JobCategory {
  const titleLower = job.title.toLowerCase();
  const tags = job.tags.map(t => t.toLowerCase()).join(' ');
  const combined = `${titleLower} ${tags}`;

  if (combined.includes('ml') || combined.includes('machine learning') || combined.includes('ai engineer')) {
    return JobCategory.AI_ML_ENGINEERING;
  }
  if (combined.includes('prompt') || combined.includes('llm')) {
    return JobCategory.VIBE_CODING;
  }
  if (combined.includes('training') || combined.includes('education')) {
    return JobCategory.AI_CORPORATE_TRAINING;
  }
  if (combined.includes('data scientist') || combined.includes('analyst')) {
    return JobCategory.AI_ML_ENGINEERING;
  }
  if (combined.includes('research')) {
    return JobCategory.AI_GOVERNANCE;
  }
  if (combined.includes('product') || combined.includes('manager')) {
    return JobCategory.AI_IMPLEMENTATION;
  }
  
  return JobCategory.OTHER;
}

/**
 * Determine job type from string
 */
function parseJobType(typeStr?: string): JobType {
  if (!typeStr) return JobType.FULL_TIME;
  
  const lower = typeStr.toLowerCase();
  if (lower.includes('part')) return JobType.PART_TIME;
  if (lower.includes('contract') || lower.includes('freelance')) return JobType.CONTRACT;
  return JobType.FULL_TIME;
}

/**
 * Calculate vibe score based on various factors
 */
function calculateVibeScore(job: RawJob): number {
  let score = 50; // Base score
  
  // Remote = +20
  if (job.location.toLowerCase().includes('remote')) score += 20;
  
  // AI/ML related = +15
  const combined = `${job.title} ${job.tags.join(' ')}`.toLowerCase();
  if (combined.includes('ai') || combined.includes('ml') || combined.includes('machine learning')) {
    score += 15;
  }
  
  // Has salary info = +10
  if (job.salary) score += 10;
  
  // Recent posting = +5
  const daysSincePosted = (Date.now() - job.postedAt.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePosted < 7) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Main aggregation function - fetches from all sources
 */
export async function aggregateJobs(): Promise<void> {
  console.log('🔄 Starting job aggregation...');
  
  try {
    // Fetch from all sources in parallel
    const [remoteOKJobs, remotiveJobs, aiMLJobs] = await Promise.all([
      fetchFromRemoteOK(),
      fetchFromRemotive(),
      fetchAIMLJobs(),
    ]);

    const allJobs = [...remoteOKJobs, ...remotiveJobs, ...aiMLJobs];
    console.log(`✅ Fetched ${allJobs.length} jobs from all sources`);

    // Transform and insert into database
    let inserted = 0;
    let skipped = 0;

    for (const rawJob of allJobs) {
      try {
        // Check if job already exists (by URL)
        const existing = await prisma.jobListing.findFirst({
          where: { sourceUrl: rawJob.url },
        });

        if (existing) {
          skipped++;
          continue;
        }

        // Insert new job
        await prisma.jobListing.create({
          data: {
            title: rawJob.title.slice(0, 200), // Limit length
            company: rawJob.company.slice(0, 200),
            description: rawJob.description.slice(0, 5000),
            location: rawJob.location,
            locationType: rawJob.location.toLowerCase().includes('remote') 
              ? LocationType.REMOTE_GLOBAL 
              : LocationType.ONSITE,
            jobType: parseJobType(rawJob.jobType),
            category: categorizeJob(rawJob),
            vibeScore: calculateVibeScore(rawJob),
            source: 'Aggregator',
            sourceUrl: rawJob.url,
            tags: rawJob.tags.slice(0, 10),
            isActive: true,
            isAuOnly: false,
            isImpactHub: false,
            postedAt: rawJob.postedAt && !isNaN(rawJob.postedAt.getTime()) 
              ? rawJob.postedAt 
              : new Date(), // Validate date or use current date
          },
        });
        inserted++;
      } catch (error) {
        console.error(`Failed to insert job: ${rawJob.title}`, error);
      }
    }

    console.log(`✅ Inserted ${inserted} new jobs, skipped ${skipped} duplicates`);
    
    // Deactivate old jobs (older than 60 days)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const deactivated = await prisma.jobListing.updateMany({
      where: {
        postedAt: { lt: sixtyDaysAgo },
        isActive: true,
      },
      data: { isActive: false },
    });
    
    console.log(`✅ Deactivated ${deactivated.count} old jobs`);
    console.log('🎉 Job aggregation complete!');
    
  } catch (error) {
    console.error('❌ Error during job aggregation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  aggregateJobs()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
