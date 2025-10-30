// Debug script to test the /api/jobs/global endpoint logic
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testQuery(testCase) {
  console.log(`\n=== Testing: ${testCase.name} ===`);
  console.log('Query params:', testCase.params);
  
  const {
    category,
    vibeScore,
    search,
    page = '1',
    limit = '20',
  } = testCase.params;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where = {};
  const andConditions = [
    { isActive: true },
    { locationType: 'REMOTE_GLOBAL' },
  ];

  if (category) {
    andConditions.push({ category: category });
  }

  if (vibeScore) {
    andConditions.push({
      vibeScore: {
        gte: parseInt(vibeScore, 10),
      },
    });
  }

  if (search) {
    andConditions.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  where.AND = andConditions;
  
  console.log('Generated where clause:', JSON.stringify(where, null, 2));

  try {
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

    console.log('✅ Success!');
    console.log(`Found ${total} jobs, ${pages} pages`);
    console.log(`Returned ${jobs.length} jobs`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

async function main() {
  console.log('Starting API endpoint debugging...');
  
  // Test cases from the problem statement
  const testCases = [
    {
      name: 'No parameters (empty query)',
      params: {}
    },
    {
      name: 'Category filter: AI_ML_ENGINEERING',
      params: { category: 'AI_ML_ENGINEERING' }
    },
    {
      name: 'Search filter: training',
      params: { search: 'training' }
    },
    {
      name: 'Combined filters',
      params: { 
        category: 'AI_ML_ENGINEERING',
        search: 'training',
        vibeScore: '50'
      }
    }
  ];

  for (const testCase of testCases) {
    await testQuery(testCase);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
