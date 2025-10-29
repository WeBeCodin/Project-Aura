# Aura AU-Exclusive Module Specification

**Version:** 1.0  
**Status:** Defined  
**Owner:** Human-AI Partnership  

## Feature Overview

A dedicated, filterable module specifically for opportunities physically located within Australia, with clear separation between hybrid and on-site positions.

## Requirements

### Data Sources
- Web crawlers for Australian-specific job boards:
  - Seek (Australia's largest job board)
  - Jora (Australian aggregator)
  - LinkedIn with strict `location=Australia` filter
  - Australian tech job boards
- Geographic validation to ensure listings are AU-based
- All listings must have `isAuOnly: true`

### Location Classification
Jobs must be tagged with precise location types:
- **HYBRID**: Combination of office and remote work
- **ONSITE**: Full-time office presence required

### Geographic Coverage
Primary Australian cities and regions:
- Sydney, NSW
- Melbourne, VIC
- Brisbane, QLD
- Perth, WA
- Adelaide, SA
- Canberra, ACT
- Hobart, TAS
- Darwin, NT

## User Interface Requirements

### AU-Exclusive Toggle
- Prominent toggle switch: "Show Australian Opportunities Only"
- When enabled:
  - Hides all `REMOTE_GLOBAL` listings
  - Shows only jobs with `isAuOnly: true`
  - Displays location badge clearly

### Search & Filter
- City/Region selector (multi-select)
- Work arrangement filter:
  - Hybrid
  - On-site
- Category filter (same as global)
- Salary range (if available)

### Display
- Card-based layout showing:
  - Job title
  - Company name
  - Location: "City - HYBRID" or "City - ONSITE"
  - Brief description
  - Work arrangement badge (color-coded)
  - Posted date

## API Endpoints

### GET /api/jobs/au-exclusive
Returns Australian-only opportunities

**Query Parameters:**
- `city`: Filter by city
- `locationType`: HYBRID or ONSITE
- `category`: Filter by JobCategory
- `search`: Search term
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "jobs": [
    {
      "id": "string",
      "title": "string",
      "company": "string",
      "description": "string",
      "location": "Sydney, NSW",
      "locationType": "HYBRID",
      "category": "AI_ML_ENGINEERING",
      "isAuOnly": true,
      "source": "Seek",
      "postedAt": "2025-10-29T00:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "pages": 3
}
```

## E2E Test Requirements

### Test: AU-Exclusive Filter
**File:** `e2e/au-module.test.ts`

**Steps:**
1. User navigates to '/'
2. User clicks 'AU-Exclusive' toggle
3. Dashboard updates to show only AU opportunities

**Expected Result:**
- All visible jobs have `isAuOnly: true`
- No `REMOTE_GLOBAL` jobs are shown
- Location shows Australian cities
- At least 1 job is displayed

### Test: Hybrid Search Sydney
**File:** `e2e/au-module.test.ts`

**Steps:**
1. User navigates to '/'
2. User enables 'AU-Exclusive' toggle
3. User selects 'Sydney' from city filter
4. User selects 'Hybrid' from work arrangement filter

**Expected Result:**
- All jobs show "Sydney" in location
- All jobs have `locationType: "HYBRID"`
- Jobs show "Sydney - Hybrid" badge
- At least 1 job is displayed

## Validation Rules

### Geographic Validation
- Must verify location is within Australia
- Must map location to correct city/state
- Must reject listings without specific AU location

### Data Quality
- Job must have valid Australian address/location
- Source must confirm on-site/hybrid requirement
- Contact information should include Australian details

## Success Metrics
- **Coverage:** All major Australian AI job opportunities
- **Accuracy:** 100% Australian location verification
- **Distinction:** Clear hybrid vs on-site classification
- **Freshness:** New jobs within 24 hours
