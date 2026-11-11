import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  IndianRupee,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toggleSaveJob } from '../../services/api';
import { normalizeImageUrl } from '../../utils/imageUrl';

const formatSalary = (min, max, currency = 'INR') => {
  if (!min && !max) return 'Competitive';
  const symbol = currency === 'INR' ? '₹' : (currency === 'USD' ? '$' : currency);

  const formatNum = (num) => {
    if (!num) return '';
    if (currency === 'INR') {
      if (num >= 100000) return `${(num / 100000).toFixed(1).replace(/\.0$/, '')} Lakh`;
      return num.toLocaleString('en-IN');
    }
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
    return num.toLocaleString();
  };

  if (min && max) return `${symbol}${formatNum(min)} - ${symbol}${formatNum(max)}/yr`;
  if (min) return `From ${symbol}${formatNum(min)}/yr`;
  return `Up to ${symbol}${formatNum(max)}/yr`;
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const JobCard = ({ job, onBookmarkChange }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(job.is_saved || false);
  const [saving, setSaving] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (saving) return;
    setSaving(true);
    const nextSaved = !saved;
    setSaved(nextSaved);

    try {
      await toggleSaveJob(job.id);
      if (onBookmarkChange) onBookmarkChange(job.id, nextSaved);
    } catch (err) {
      // Revert on error
      setSaved(!nextSaved);
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setSaving(false);
    }
  };

  const companyInitial = (job.company_name || 'I')[0].toUpperCase();
  const jobIdentifier = job.slug || job.id;

  const normalizedCompanyLogo = normalizeImageUrl(job.company_logo);

  return (
    <article className={`job-card ${job.is_featured ? 'is-featured' : ''}`}>
      <div className="job-card-header">
        <div className="job-card-main">
          {normalizedCompanyLogo ? (
            <img
              src={normalizedCompanyLogo}
              alt={job.company_name}
              className="company-logo-placeholder"
              style={{ objectFit: 'contain' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="company-logo-placeholder">{companyInitial}</div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link to={`/jobs/${jobIdentifier}`} className="job-title-link">
                {job.title}
              </Link>
              {job.is_featured && (
                <span className="badge badge-primary">
                  <Sparkles size={11} /> Featured
                </span>
              )}
              {job.has_applied && (
                <span className="badge badge-success">
                  <Check size={11} /> Applied
                </span>
              )}
            </div>
            <p className="job-company-name">{job.company_name}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleBookmark}
          className={`bookmark-btn ${saved ? 'is-active' : ''}`}
          title={saved ? 'Remove from saved jobs' : 'Save job'}
          aria-label="Bookmark job"
          disabled={saving}
        >
          <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="job-chips">
        <span className="job-chip">
          <MapPin size={13} />
          {job.location}
        </span>
        <span className="job-chip">
          <Briefcase size={13} />
          {job.workplace_type}
        </span>
        <span className="job-chip">{job.job_type}</span>
        {job.experience_level && <span className="job-chip">{job.experience_level}</span>}
      </div>

      <div className="job-card-footer">
        <span className="job-salary">
          {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {formatDate(job.created_at)}
          </span>
          <Link to={`/jobs/${jobIdentifier}`} className="btn btn-secondary btn-sm">
            View Details
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default JobCard;

