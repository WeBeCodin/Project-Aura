import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { JobCard } from '@/components/JobCard';
import { JobListing, JobCategory } from '@/types';
import styles from './index.module.css';

export default function Home() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<JobCategory | ''>('');
  const [vibeScore, setVibeScore] = useState(0);
  const [auExclusive, setAuExclusive] = useState(false);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, vibeScore, auExclusive]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const endpoint = auExclusive ? '/api/jobs/au-exclusive' : '/api/jobs/global';
      const params = new URLSearchParams();
      
      if (category) params.append('category', category);
      if (vibeScore > 0) params.append('vibeScore', vibeScore.toString());
      
      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = auExclusive ? '/api/jobs/au-exclusive' : '/api/jobs/global';
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (vibeScore > 0) params.append('vibeScore', vibeScore.toString());
      
      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Project Aura - AI Opportunities Aggregator</title>
        <meta name="description" content="The world's most reliable and intelligent aggregator for AI-centric opportunities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Project Aura</h1>
            <p className={styles.subtitle}>AI Opportunities Aggregator</p>
          </header>

          <div className={styles.controls}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
                data-testid="search-input"
              />
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </form>

            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label htmlFor="category" className={styles.label}>
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as JobCategory | '')}
                  className={styles.select}
                  data-testid="category-filter"
                >
                  <option value="">All Categories</option>
                  <option value={JobCategory.AI_ML_ENGINEERING}>AI/ML Engineering</option>
                  <option value={JobCategory.VIBE_CODING}>Vibe Coding (AI-Assisted)</option>
                  <option value={JobCategory.AI_CORPORATE_TRAINING}>AI Corporate Training</option>
                  <option value={JobCategory.AI_GOVERNANCE}>AI Governance</option>
                  <option value={JobCategory.AI_IMPLEMENTATION}>AI Implementation</option>
                  <option value={JobCategory.OTHER}>Other</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="vibeScore" className={styles.label}>
                  Min Vibe Score: {vibeScore}
                </label>
                <input
                  type="range"
                  id="vibeScore"
                  min="0"
                  max="100"
                  value={vibeScore}
                  onChange={(e) => setVibeScore(parseInt(e.target.value, 10))}
                  className={styles.slider}
                  data-testid="vibe-score-slider"
                />
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={auExclusive}
                    onChange={(e) => setAuExclusive(e.target.checked)}
                    className={styles.checkbox}
                    data-testid="au-exclusive-toggle"
                  />
                  <span>AU-Exclusive</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.results}>
            {loading ? (
              <div className={styles.loading}>Loading opportunities...</div>
            ) : jobs.length === 0 ? (
              <div className={styles.empty}>No opportunities found</div>
            ) : (
              <div className={styles.jobList} data-testid="job-list">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
