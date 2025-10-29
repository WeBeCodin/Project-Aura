# Aura Remote AU Impact Hub Specification

**Version:** 1.0  
**Status:** Defined  
**Owner:** Human-AI Partnership  

## Feature Overview

A special section highlighting opportunities (jobs, tenders, grants) in regional, rural, and remote Australia, focusing on AI adoption, implementation, and training initiatives.

## Requirements

### Data Sources
- Government tender sites:
  - AusTender (Commonwealth Government)
  - State government tender portals
- Regional development hubs:
  - QLD AI Hub
  - Regional Development Australia (RDA) networks
  - Innovation hubs in regional areas
- Industry-specific sources:
  - AgriTech companies and associations
  - Rural Health networks
  - Mining Tech companies

### Target Regions
Focus on regional, rural, and remote Australia:
- Regional Queensland (Townsville, Cairns, Toowoomba)
- Regional NSW (Newcastle, Wollongong, Orange)
- Regional Victoria (Geelong, Ballarat, Bendigo)
- Regional WA (Bunbury, Geraldton, Kalgoorlie)
- Regional SA (Mount Gambier, Whyalla)
- Northern Territory (Alice Springs, Katherine)
- Tasmania (Launceston, Devonport)

### Opportunity Types
Clear separation between:
1. **Jobs**: Traditional employment positions
   - AI Implementation Specialists
   - AI Training Coordinators
   - Data Scientists for regional industries
   
2. **Tenders/Projects**: Contract opportunities
   - Government AI adoption projects
   - Regional AI training programs
   - Industry-specific AI implementation
   
3. **Grants**: Funding opportunities
   - AI research grants
   - Innovation funding
   - Regional development grants

## User Interface Requirements

### Navigation
- Dedicated route: `/au/impact`
- Clear tab separation:
  - Jobs
  - Tenders
  - Grants

### Search & Filter
- Opportunity type (Jobs / Tenders / Grants)
- Region selector (multi-select)
- Industry focus:
  - AgriTech
  - Rural Health
  - Mining Tech
  - Education
  - Government Services
- AI Focus area:
  - AI Implementation
  - AI Training
  - AI Research

### Display

#### Jobs View
- Standard job card with:
  - Regional location badge
  - Industry icon
  - AI focus tag

#### Tenders View
- Tender-specific card with:
  - Tender value (if available)
  - Closing date (prominent)
  - Issuing organization
  - Brief scope
  - Regional location

#### Grants View
- Grant-specific card with:
  - Grant amount range
  - Application deadline
  - Eligibility summary
  - Funding body

## API Endpoints

### GET /api/jobs/au-impact
Returns Impact Hub opportunities

**Query Parameters:**
- `type`: JOB, TENDER, or GRANT
- `region`: Filter by region
- `industry`: Filter by industry
- `aiFocus`: Filter by AI focus area
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "opportunities": [
    {
      "id": "string",
      "title": "AI Staff Training Coordinator",
      "organization": "Townsville Regional Council",
      "description": "string",
      "location": "Townsville, QLD",
      "type": "TENDER",
      "value": "$50,000 - $100,000",
      "closingDate": "2025-11-30",
      "industry": "Government Services",
      "aiFocus": "AI Training",
      "isImpactHub": true,
      "postedAt": "2025-10-29T00:00:00Z"
    }
  ],
  "total": 23,
  "page": 1,
  "pages": 2
}
```

## E2E Test Requirements

### Test: View Impact Hub
**File:** `e2e/au-impact.test.ts`

**Steps:**
1. User navigates to '/au/impact'
2. Page loads Impact Hub interface

**Expected Result:**
- Three tabs visible: Jobs, Tenders, Grants
- Listings are displayed
- Each listing clearly shows type (Job/Tender/Grant)
- Regional Australian locations are shown
- At least 1 opportunity in each category

### Test: Find Training Tender
**File:** `e2e/au-impact.test.ts`

**Steps:**
1. User navigates to '/au/impact'
2. User clicks 'Tenders' tab
3. User filters by 'AI Training' focus area
4. Results load

**Expected Result:**
- Only tenders are shown (not jobs or grants)
- All visible tenders relate to AI Training
- At least one tender from a regional council
- Closing dates are clearly displayed
- Regional location is prominent

## Validation Rules

### Regional Classification
- Must be outside major metro areas (Sydney, Melbourne, Brisbane, Perth, Adelaide)
- Must serve regional/rural communities
- Focus on regional economic development

### Impact Focus
- Must relate to AI adoption, implementation, or training
- Must benefit regional Australia
- Should address skills gap or digital transformation

## Success Metrics
- **Coverage:** Comprehensive regional AI opportunities
- **Categorization:** 100% correct Job/Tender/Grant classification
- **Regional Focus:** All opportunities genuinely regional/remote
- **Value:** High-impact opportunities for regional development
