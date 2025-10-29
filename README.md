# Project Aura 🌟

**Version:** 1.0  
**Status:** Production-Ready Foundation  
**Philosophy:** Supercharger Trinity - Think → Ship → Define

## Overview

Project Aura is the world's most reliable and intelligent aggregator for AI-centric opportunities. Built on the Supercharger Manifesto principles, this system aggregates global remote AI jobs and provides dedicated modules for Australian opportunities.

## Core Features

### 🌍 Global Remote Dashboard
Aggregates AI and "vibe coding" opportunities from around the world:
- AI/ML Engineering roles
- Vibe Coding (AI-Assisted) positions
- AI Corporate Training
- AI Governance roles
- Intelligent "Vibe Score" filtering

### 🇦🇺 AU-Exclusive Module
Dedicated Australian opportunities with precise filtering:
- Hybrid and On-site positions
- City-specific search
- Clear work arrangement classification

### 🎯 AU Impact Hub
Special focus on regional, rural, and remote Australia:
- Jobs in regional areas
- Government tenders
- Grants and funding opportunities
- Focus on AI adoption and training

## Tech Stack

Following the Supercharger Constitution:

- **Frontend**: Next.js 14 with React 18, TypeScript (strict mode)
- **Backend**: Next.js API Routes (Vercel Edge Functions)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh rotation
- **Testing**: Jest (Unit) + Playwright (E2E)
- **Deployment**: Vercel
- **Monitoring**: Sentry
- **Crawling**: Python (Scrapy/BeautifulSoup)

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/WeBeCodin/Project-Aura.git
cd Project-Aura

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Development

### Running Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm test
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
npm start
```

## Project Structure

```
/
├── .github/
│   ├── workflows/
│   │   └── supercharger.yml    # CI/CD pipeline
│   └── copilot-instructions.yml # Agent constitution
├── e2e/                         # Playwright E2E tests
├── mockups/                     # Visual specifications
├── prisma/
│   └── schema.prisma            # Database schema
├── specs/                       # Feature specifications
│   ├── aura-global.spec.md
│   ├── aura-au-exclusive.spec.md
│   └── aura-au-impact.spec.md
└── src/
    ├── components/              # React components
    ├── lib/                     # Utilities and helpers
    ├── pages/                   # Next.js pages and API routes
    ├── styles/                  # CSS modules
    └── types/                   # TypeScript types
```

## Specifications

This project follows **Principle 0**: The specification is the single source of truth.

All features are defined in `/specs/`:
- `aura-global.spec.md` - Global Remote Dashboard
- `aura-au-exclusive.spec.md` - Australian Module
- `aura-au-impact.spec.md` - Regional Impact Hub

## Quality Requirements

- ✅ TypeScript strict mode: **100%**
- ✅ Test coverage: **80%+ unit tests**
- ✅ E2E critical paths: **100%** (Search, Filter, AU-Hub)
- ✅ Spec compliance: **100%**
- ✅ Visual compliance: **100%** pixel-perfect to spec

## GitHub Shield Strategy

Every commit goes through:
1. **Specification Validation** - Specs are valid and complete
2. **Type Generation** - Prisma types generated successfully
3. **Test Suite** - All unit and integration tests pass
4. **Visual Regression** - E2E tests with visual validation
5. **Deploy Preview** - Automatic Vercel preview deployment

## Contributing

This project follows the Production-First Mindset:
- Never suggest localhost-only solutions
- Always write tests with code
- Follow specifications strictly
- No console.log debugging in production code

## License

Proprietary - Human-AI Partnership

## Contact

Built with the Supercharger Trinity methodology.