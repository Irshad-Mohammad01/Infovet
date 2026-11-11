import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const WORKPLACE_TYPES = ['Remote', 'Hybrid', 'On-site'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Director / Lead'];

const JobFilters = ({
  categories = [],
  filters = {},
  onChange,
  onReset,
}) => {
  const handleFilterChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const hasActiveFilters = Boolean(
    filters.category ||
    filters.workplace_type ||
    filters.job_type ||
    filters.experience_level ||
    filters.q ||
    filters.location
  );

  return (
    <aside className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} style={{ color: 'var(--primary)' }} />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        )}
      </div>

      {/* Category */}
      <div className="filter-group">
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
        <select
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Workplace Type */}
      <div className="filter-group">
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Workplace Type</label>
        <select
          value={filters.workplace_type || ''}
          onChange={(e) => handleFilterChange('workplace_type', e.target.value)}
        >
          <option value="">All Workplace Types</option>
          {WORKPLACE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div className="filter-group">
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Employment Type</label>
        <select
          value={filters.job_type || ''}
          onChange={(e) => handleFilterChange('job_type', e.target.value)}
        >
          <option value="">All Job Types</option>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Level */}
      <div className="filter-group">
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Experience Level</label>
        <select
          value={filters.experience_level || ''}
          onChange={(e) => handleFilterChange('experience_level', e.target.value)}
        >
          <option value="">All Experience Levels</option>
          {EXPERIENCE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};

export default JobFilters;

