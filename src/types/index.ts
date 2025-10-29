export interface JobListing {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  locationType: LocationType;
  jobType: JobType;
  category: JobCategory;
  vibeScore: number | null;
  source: string;
  sourceUrl: string;
  tags: string[];
  isActive: boolean;
  isAuOnly: boolean;
  isImpactHub: boolean;
  postedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum LocationType {
  REMOTE_GLOBAL = 'REMOTE_GLOBAL',
  HYBRID = 'HYBRID',
  ONSITE = 'ONSITE',
}

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
  TENDER = 'TENDER',
  GRANT = 'GRANT',
}

export enum JobCategory {
  AI_ML_ENGINEERING = 'AI_ML_ENGINEERING',
  VIBE_CODING = 'VIBE_CODING',
  AI_CORPORATE_TRAINING = 'AI_CORPORATE_TRAINING',
  AI_GOVERNANCE = 'AI_GOVERNANCE',
  AI_IMPLEMENTATION = 'AI_IMPLEMENTATION',
  OTHER = 'OTHER',
}
