import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import JobSearchBar from '../components/jobs/JobSearchBar';
import { fetchCategories, fetchJobs } from '../services/api';

const BrowseJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [jobsData, setJobsData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state from URL query parameters
  const q = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';
  const workplace_type = searchParams.get('workplace_type') || '';
  const job_type = searchParams.get('job_type') || '';
  const experience_level = searchParams.get('experience_level') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        if (Array.isArray(cats)) setCategories(cats);
      })
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Fetch jobs whenever query parameters change
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const res = await fetchJobs({
          q,
          location,
          category,
          workplace_type,
          job_type,
          experience_level,
          sort,
          page,
          size: 10,
        });
        setJobsData(res);
      } catch (err) {
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [q, location, category, workplace_type, job_type, experience_level, sort, page]);

  const updateFilters = (newFilters) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        updated.set(key, val);
      } else {
        updated.delete(key);
      }
    });
    setSearchParams(updated);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    const updated = new URLSearchParams(searchParams);
    updated.set('page', newPage.toString());
    setSearchParams(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        {/* Top Search Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <JobSearchBar
            initialKeyword={q}
            initialLocation={location}
            onSearch={({ q: newQ, location: newLoc }) => {
              updateFilters({ q: newQ, location: newLoc, page: 1 });
            }}
          />
        </div>

        {/* Results Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Explore Job Opportunities</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Showing {jobsData.total} {jobsData.total === 1 ? 'position' : 'positions'} available
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ display: 'none' }}
              onClick={() => setMobileFilterOpen((prev) => !prev)}
            >
              <SlidersHorizontal size={14} /> Filter
            </button>

            <label htmlFor="job-sort-select" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Sort:
            </label>
            <select
              id="job-sort-select"
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value, page: 1 })}
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
            >
              <option value="newest">Newest First</option>
              <option value="salary_high">Highest Compensation</option>
              <option value="salary_low">Lowest Compensation</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Job Listings */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '2rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Filters Sidebar */}
          <div>
            <JobFilters
              categories={categories}
              filters={{ category, workplace_type, job_type, experience_level, q, location }}
              onChange={updateFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Job List Stage */}
          <div>
            {loading ? (
              <LoadingSpinner text="Searching jobs…" height="320px" />
            ) : jobsData.items.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No jobs match your criteria"
                description="Try broadening your search keywords, clearing location filters, or exploring other categories."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {jobsData.items.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}

                {/* Pagination */}
                {jobsData.pages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      marginTop: '2rem',
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page <= 1}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>

                    <span style={{ fontSize: '0.875rem', fontWeight: 600, padding: '0 0.5rem' }}>
                      Page {page} of {jobsData.pages}
                    </span>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page >= jobsData.pages}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseJobs;

