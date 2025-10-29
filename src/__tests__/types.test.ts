import { JobCategory, LocationType, JobType } from '../types';

describe('Type Definitions', () => {
  test('JobCategory enum should have correct values', () => {
    expect(JobCategory.AI_ML_ENGINEERING).toBe('AI_ML_ENGINEERING');
    expect(JobCategory.VIBE_CODING).toBe('VIBE_CODING');
    expect(JobCategory.AI_CORPORATE_TRAINING).toBe('AI_CORPORATE_TRAINING');
    expect(JobCategory.AI_GOVERNANCE).toBe('AI_GOVERNANCE');
    expect(JobCategory.AI_IMPLEMENTATION).toBe('AI_IMPLEMENTATION');
    expect(JobCategory.OTHER).toBe('OTHER');
  });

  test('LocationType enum should have correct values', () => {
    expect(LocationType.REMOTE_GLOBAL).toBe('REMOTE_GLOBAL');
    expect(LocationType.HYBRID).toBe('HYBRID');
    expect(LocationType.ONSITE).toBe('ONSITE');
  });

  test('JobType enum should have correct values', () => {
    expect(JobType.FULL_TIME).toBe('FULL_TIME');
    expect(JobType.PART_TIME).toBe('PART_TIME');
    expect(JobType.CONTRACT).toBe('CONTRACT');
    expect(JobType.FREELANCE).toBe('FREELANCE');
    expect(JobType.TENDER).toBe('TENDER');
    expect(JobType.GRANT).toBe('GRANT');
  });
});
