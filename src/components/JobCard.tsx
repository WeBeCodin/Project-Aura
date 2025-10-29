import React from 'react';
import { JobListing, JobCategory, LocationType } from '@/types';
import styles from './JobCard.module.css';

interface JobCardProps {
  job: JobListing;
}

const categoryLabels: Record<JobCategory, string> = {
  [JobCategory.AI_ML_ENGINEERING]: 'AI/ML Engineering',
  [JobCategory.VIBE_CODING]: 'Vibe Coding (AI-Assisted)',
  [JobCategory.AI_CORPORATE_TRAINING]: 'AI Corporate Training',
  [JobCategory.AI_GOVERNANCE]: 'AI Governance',
  [JobCategory.AI_IMPLEMENTATION]: 'AI Implementation',
  [JobCategory.OTHER]: 'Other',
};

const locationTypeLabels: Record<LocationType, string> = {
  [LocationType.REMOTE_GLOBAL]: 'Remote (Global)',
  [LocationType.HYBRID]: 'Hybrid',
  [LocationType.ONSITE]: 'On-site',
};

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className={styles.card} data-testid="job-card">
      <div className={styles.header}>
        <h3 className={styles.title}>{job.title}</h3>
        {job.vibeScore !== null && (
          <span className={styles.vibeScore} data-testid="vibe-score">
            Vibe: {job.vibeScore}
          </span>
        )}
      </div>
      
      <div className={styles.company}>{job.company}</div>
      
      <div className={styles.meta}>
        <span className={styles.location} data-testid="job-location">
          {job.location} - {locationTypeLabels[job.locationType]}
        </span>
        <span className={styles.category} data-testid="job-category">
          {categoryLabels[job.category]}
        </span>
      </div>
      
      <p className={styles.description}>
        {truncateDescription(job.description)}
      </p>
      
      <div className={styles.footer}>
        <span className={styles.source}>via {job.source}</span>
        <span className={styles.date}>{formatDate(job.postedAt)}</span>
      </div>
      
      <a 
        href={job.sourceUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.applyLink}
      >
        View Details →
      </a>
    </div>
  );
};
