import { PrismaClient, LocationType, JobType, JobCategory } from '@prisma/client';

const prisma = new PrismaClient();

const sampleJobs = [
  // Global Remote Jobs
  {
    title: 'Senior AI/ML Engineer',
    company: 'TechGlobal Inc',
    description: 'We are looking for an experienced AI/ML engineer to join our distributed team. Work on cutting-edge machine learning models and contribute to our AI platform. Flexible hours, remote-first culture.',
    location: 'Remote (Global)',
    locationType: LocationType.REMOTE_GLOBAL,
    jobType: JobType.FULL_TIME,
    category: JobCategory.AI_ML_ENGINEERING,
    vibeScore: 85,
    source: 'LinkedIn',
    sourceUrl: 'https://example.com/job1',
    tags: ['Python', 'TensorFlow', 'Remote'],
    isActive: true,
    isAuOnly: false,
    isImpactHub: false,
    postedAt: new Date('2025-10-28'),
  },
  {
    title: 'Prompt Engineer',
    company: 'AI Startup Labs',
    description: 'Join our innovative team building the next generation of AI-powered applications. You will design and optimize prompts for large language models. Creative, flexible, startup environment.',
    location: 'Remote (Global)',
    locationType: LocationType.REMOTE_GLOBAL,
    jobType: JobType.FULL_TIME,
    category: JobCategory.VIBE_CODING,
    vibeScore: 92,
    source: 'Hacker News',
    sourceUrl: 'https://example.com/job2',
    tags: ['GPT', 'LLM', 'Prompt Engineering'],
    isActive: true,
    isAuOnly: false,
    isImpactHub: false,
    postedAt: new Date('2025-10-27'),
  },
  {
    title: 'AI Training Specialist',
    company: 'Enterprise Solutions Corp',
    description: 'Lead corporate AI training programs for Fortune 500 companies. Develop curriculum and deliver workshops on AI adoption and best practices.',
    location: 'Remote (Global)',
    locationType: LocationType.REMOTE_GLOBAL,
    jobType: JobType.CONTRACT,
    category: JobCategory.AI_CORPORATE_TRAINING,
    vibeScore: 70,
    source: 'Indeed',
    sourceUrl: 'https://example.com/job3',
    tags: ['Training', 'Workshop', 'Enterprise'],
    isActive: true,
    isAuOnly: false,
    isImpactHub: false,
    postedAt: new Date('2025-10-26'),
  },
  
  // Australian Jobs
  {
    title: 'Machine Learning Developer',
    company: 'Sydney Tech Hub',
    description: 'Join our Sydney office to work on AI-powered fintech solutions. Hybrid role with flexible work arrangements.',
    location: 'Sydney, NSW',
    locationType: LocationType.HYBRID,
    jobType: JobType.FULL_TIME,
    category: JobCategory.AI_ML_ENGINEERING,
    vibeScore: 78,
    source: 'Seek',
    sourceUrl: 'https://example.com/job4',
    tags: ['Machine Learning', 'Fintech', 'Hybrid'],
    isActive: true,
    isAuOnly: true,
    isImpactHub: false,
    postedAt: new Date('2025-10-25'),
  },
  {
    title: 'AI Solutions Architect',
    company: 'Melbourne Innovations',
    description: 'On-site position in Melbourne CBD. Lead AI implementation projects for enterprise clients.',
    location: 'Melbourne, VIC',
    locationType: LocationType.ONSITE,
    jobType: JobType.FULL_TIME,
    category: JobCategory.AI_ML_ENGINEERING,
    vibeScore: 65,
    source: 'Seek',
    sourceUrl: 'https://example.com/job5',
    tags: ['Architecture', 'Enterprise', 'On-site'],
    isActive: true,
    isAuOnly: true,
    isImpactHub: false,
    postedAt: new Date('2025-10-24'),
  },
  
  // AU Impact Hub - Jobs
  {
    title: 'AI Implementation Specialist - Regional',
    company: 'Queensland AI Hub',
    description: 'Help regional businesses adopt AI technologies. Based in Townsville with travel to rural areas.',
    location: 'Townsville, QLD',
    locationType: LocationType.HYBRID,
    jobType: JobType.FULL_TIME,
    category: JobCategory.AI_IMPLEMENTATION,
    vibeScore: 88,
    source: 'QLD AI Hub',
    sourceUrl: 'https://example.com/job6',
    tags: ['AI Implementation', 'Regional', 'AgriTech'],
    isActive: true,
    isAuOnly: true,
    isImpactHub: true,
    postedAt: new Date('2025-10-23'),
  },
  
  // AU Impact Hub - Tenders
  {
    title: 'AI Staff Training Program Development',
    company: 'Townsville Regional Council',
    description: 'Tender for developing and delivering AI training programs for council staff. Focus on AI adoption in local government services.',
    location: 'Townsville, QLD',
    locationType: LocationType.HYBRID,
    jobType: JobType.TENDER,
    category: JobCategory.AI_CORPORATE_TRAINING,
    vibeScore: null,
    source: 'AusTender',
    sourceUrl: 'https://example.com/tender1',
    tags: ['AI Training', 'Government', 'Tender'],
    isActive: true,
    isAuOnly: true,
    isImpactHub: true,
    postedAt: new Date('2025-10-22'),
  },
  {
    title: 'Rural Health AI Integration Project',
    company: 'Northern Territory Health',
    description: 'Contract opportunity to integrate AI solutions in rural health clinics across NT. Improve patient care through technology.',
    location: 'Alice Springs, NT',
    locationType: LocationType.ONSITE,
    jobType: JobType.TENDER,
    category: JobCategory.AI_IMPLEMENTATION,
    vibeScore: null,
    source: 'NT Gov Tenders',
    sourceUrl: 'https://example.com/tender2',
    tags: ['Rural Health', 'AI Implementation', 'Government'],
    isActive: true,
    isAuOnly: true,
    isImpactHub: true,
    postedAt: new Date('2025-10-21'),
  },
  
  // AU Impact Hub - Grants
  {
    title: 'Regional AI Innovation Grant',
    company: 'Regional Development Australia',
    description: 'Funding available for AI research and implementation projects in regional areas. Up to $100,000.',
    location: 'Regional Australia',
    locationType: LocationType.REMOTE_GLOBAL,
    jobType: JobType.GRANT,
    category: JobCategory.AI_IMPLEMENTATION,
    vibeScore: null,
    source: 'RDA',
    sourceUrl: 'https://example.com/grant1',
    tags: ['Grant', 'Research', 'Regional Development'],
    isActive: true,
    isAuOnly: true,
    isImpactHub: true,
    postedAt: new Date('2025-10-20'),
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.jobListing.deleteMany();
  console.log('✓ Cleared existing job listings');

  // Insert sample jobs
  for (const job of sampleJobs) {
    await prisma.jobListing.create({
      data: job,
    });
  }
  
  console.log(`✓ Created ${sampleJobs.length} job listings`);
  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
