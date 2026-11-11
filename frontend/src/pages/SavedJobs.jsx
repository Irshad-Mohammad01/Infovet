import React, { useEffect, useState } from 'react';
import { Bookmark, Briefcase } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import JobCard from '../components/jobs/JobCard';
import { fetchSavedJobs } from '../services/api';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs()
      .then((data) => {
        if (Array.isArray(data)) setJobs(data);
      })
      .catch((err) => console.error('Failed to load saved jobs:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleBookmarkChange = (jobId, isSaved) => {
    if (!isSaved) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Saved Jobs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Bookmark positions you are interested in and apply when you are ready.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching your saved jobs…" height="320px" />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="You haven't saved any jobs yet"
            description="Browse through our job listings and click the bookmark icon to save roles for quick access."
            actionText="Browse Open Jobs"
            actionLink="/jobs"
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={{ ...job, is_saved: true }} onBookmarkChange={handleBookmarkChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;

