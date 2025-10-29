# Aura Global Remote Dashboard Specification

**Version:** 1.0  
**Status:** Defined  
**Owner:** Human-AI Partnership  

## Feature Overview

The Global AI Dashboard is the main interface for aggregating all remote-only AI opportunities from around the world.

## Requirements

### Data Sources
- Web crawlers for major global job boards:
  - LinkedIn (Remote AI positions)
  - Indeed (Global remote AI jobs)
  - Hacker News (Who's Hiring threads)
  - Niche AI boards (AI Jobs, ML Jobs)
- All listings must be tagged as `REMOTE_GLOBAL`

### AI Classification System
Jobs must be automatically classified into categories:
- **AI/ML Engineering**: Traditional AI/ML development roles
- **Vibe Coding (AI-Assisted)**: Roles emphasizing AI-assisted development
- **AI Corporate Training**: Teaching and training positions
- **AI Governance**: Policy, ethics, and governance roles

### Vibe Score Algorithm
Each listing receives a "Vibe Score" (0-100) based on keyword analysis:
- **High Score Keywords** (+20 each): flexible, creative, startup, innovative, remote-first
- **Medium Score Keywords** (+10 each): collaborative, async, distributed
- **Low Score Keywords** (+5 each): modern, agile, fast-paced

### User Interface Requirements

#### Search & Filter
- Free-text search across title, description, company
- Filter by:
  - Job Category (multi-select)
  - Vibe Score (slider: 0-100)
  - Posted Date (Last 24h, 7 days, 30 days)
  - Source platform

#### Display
- Card-based layout showing:
  - Job title
  - Company name
  - Brief description (150 chars)
  - Vibe Score badge
  - Location: "Remote (Global)"
  - Posted date
- Click to expand for full details

## API Endpoints

### GET /api/jobs/global
Returns paginated list of global remote jobs

**Query Parameters:**
- `category`: Filter by JobCategory
- `vibeScore`: Minimum vibe score
- `search`: Search term
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "jobs": [
    {
      "id": "string",
      "title": "string",
      "company": "string",
      "description": "string",
      "location": "Remote (Global)",
      "locationType": "REMOTE_GLOBAL",
      "category": "AI_ML_ENGINEERING",
      "vibeScore": 85,
      "source": "LinkedIn",
      "sourceUrl": "string",
      "postedAt": "2025-10-29T00:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 8
}
```

## E2E Test Requirements

### Test: Filter by 'Vibe Coding'
**File:** `e2e/global-dashboard.test.ts`

**Steps:**
1. User navigates to '/'
2. User opens the category filter
3. User selects 'Vibe Coding (AI-Assisted)'
4. Job list updates to show only VIBE_CODING roles

**Expected Result:**
- All visible jobs have `category: "VIBE_CODING"`
- At least 1 job is displayed
- Other categories are not shown

### Test: Global Search
**File:** `e2e/global-dashboard.test.ts`

**Steps:**
1. User navigates to '/'
2. User enters "Prompt Engineer" in search box
3. User submits search

**Expected Result:**
- Results include "Prompt Engineer" in title or description
- Jobs are from at least 3 different sources
- All jobs are marked as Remote (Global)

## Success Metrics
- **Coverage:** All major global remote AI jobs aggregated daily
- **Accuracy:** 95%+ correct category classification
- **Performance:** Page load < 2s, search results < 500ms
- **Freshness:** New jobs appear within 24 hours of posting
