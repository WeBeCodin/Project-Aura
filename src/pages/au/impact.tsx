import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { JobListing, JobType } from '@/types';
import styles from './impact.module.css';

export default function ImpactHub() {
  const [opportunities, setOpportunities] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'tenders' | 'grants'>('jobs');

  useEffect(() => {
    fetchOpportunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const typeMap = {
        jobs: JobType.FULL_TIME,
        tenders: JobType.TENDER,
        grants: JobType.GRANT,
      };
      
      const params = new URLSearchParams();
      params.append('type', typeMap[activeTab]);
      
      const response = await fetch(`/api/jobs/au-impact?${params}`);
      const data = await response.json();
      setOpportunities(data.opportunities || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AU Impact Hub - Project Aura</title>
        <meta name="description" content="Regional, rural, and remote Australia AI opportunities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Remote AU Impact Hub</h1>
            <p className={styles.subtitle}>
              AI Opportunities for Regional, Rural, and Remote Australia
            </p>
          </header>

          <div className={styles.tabs} data-testid="opportunity-tabs">
            <button
              className={`${styles.tab} ${activeTab === 'jobs' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('jobs')}
              data-testid="jobs-tab"
            >
              Jobs
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'tenders' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('tenders')}
              data-testid="tenders-tab"
            >
              Tenders
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'grants' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('grants')}
              data-testid="grants-tab"
            >
              Grants
            </button>
          </div>

          <div className={styles.results}>
            {loading ? (
              <div className={styles.loading}>Loading opportunities...</div>
            ) : opportunities.length === 0 ? (
              <div className={styles.empty}>No {activeTab} found</div>
            ) : (
              <div className={styles.opportunityList} data-testid="opportunity-list">
                {opportunities.map((opp) => (
                  <div key={opp.id} className={styles.card} data-testid="opportunity-card">
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{opp.title}</h3>
                      <span className={styles.typeBadge} data-testid="opportunity-type">
                        {activeTab.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className={styles.organization}>{opp.company}</div>
                    
                    <div className={styles.location} data-testid="opportunity-location">
                      📍 {opp.location}
                    </div>
                    
                    <p className={styles.description}>
                      {opp.description.substring(0, 200)}...
                    </p>
                    
                    {opp.tags && opp.tags.length > 0 && (
                      <div className={styles.tags}>
                        {opp.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className={styles.footer}>
                      <span className={styles.source}>via {opp.source}</span>
                      <a 
                        href={opp.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        View Details →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
