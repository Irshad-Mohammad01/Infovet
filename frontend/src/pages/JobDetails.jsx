import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Eye,
  Globe,
  MapPin,
  Send,
  Share2,
  Sparkles,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { fetchJobDetail, toggleSaveJob } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUrl';

const formatSalary = (min, max, currency = 'INR') => {
  if (!min && !max) return 'Competitive Compensation';
  const symbol = currency === 'INR' ? '₹' : (currency === 'USD' ? '$' : currency);
  const formatNum = (num) => {
    if (!num) return '';
    if (currency === 'INR') {
      if (num >= 100000) return `${(num / 100000).toFixed(1).replace(/\.0$/, '')} Lakh`;
      return num.toLocaleString('en-IN');
    }
    return num.toLocaleString();
  };

  if (min && max) return `${symbol}${formatNum(min)} - ${symbol}${formatNum(max)} / year`;
  if (min) return `From ${symbol}${formatNum(min)} / year`;
  return `Up to ${symbol}${formatNum(max)} / year`;
};

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchJobDetail(id);
        setJob(data);
        setSaved(data.is_saved || false);
      } catch (err) {
        setError(err.message || 'Unable to load job details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const nextSaved = !saved;
    setSaved(nextSaved);
    try {
      await toggleSaveJob(job.id);
    } catch {
      setSaved(!nextSaved);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <LoadingSpinner text="Loading role details…" height="400px" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Listing Not Available</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {error || 'The job posting you requested does not exist or has been archived.'}
          </p>
          <Link to="/jobs" className="btn btn-primary">
            <ArrowLeft size={16} /> Return to Job Board
          </Link>
        </div>
      </div>
    );
  }

  const companyInitial = (job.company_name || 'I')[0].toUpperCase();

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container">
        {/* Breadcrumb Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/jobs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to all jobs
          </Link>
        </div>

        {/* Hero Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              {normalizeImageUrl(job.company_logo) ? (
                <img
                  src={normalizeImageUrl(job.company_logo)}
                  alt={job.company_name}
                  className="company-logo-placeholder"
                  style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                />
              ) : (
                <div className="company-logo-placeholder" style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                  {companyInitial}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800 }}>{job.title}</h1>
                  {job.is_featured && (
                    <span className="badge badge-primary">
                      <Sparkles size={11} /> Featured
                    </span>
                  )}
                  {job.has_applied && (
                    <span className="badge badge-success">
                      <CheckCircle2 size={11} /> Applied
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.5rem',
                    flexWrap: 'wrap',
                    fontSize: '0.9375rem',
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{job.company_name}</span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={15} /> {job.location}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Briefcase size={15} /> {job.workplace_type}
                  </span>
                  <span>•</span>
                  <span>{job.job_type}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleBookmark}
                className={`btn btn-secondary ${saved ? 'is-active' : ''}`}
                title={saved ? 'Saved' : 'Save for later'}
              >
                <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved' : 'Save Job'}
              </button>

              <button type="button" onClick={handleShare} className="btn btn-secondary" title="Copy job link">
                <Share2 size={16} />
                {copied ? 'Link Copied!' : 'Share'}
              </button>

              <Link to={`/jobs/${job.id}/apply`} className="btn btn-primary btn-lg">
                <Send size={16} /> Apply Now
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Body: Description & Side Metadata */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '2rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Main Description */}
          <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text)' }}>Role Overview</h2>
              <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.9375rem' }}>
                {job.description}
              </div>
            </div>

            {job.requirements && (
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text)' }}>Candidate Requirements</h2>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.9375rem' }}>
                  {job.requirements}
                </div>
              </div>
            )}

            {job.benefits && (
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text)' }}>Perks & Benefits</h2>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', fontSize: '0.9375rem' }}>
                  {job.benefits}
                </div>
              </div>
            )}

            {job.tags && (
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text)' }}>Required Technologies & Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {job.tags.split(',').map((tag, idx) => (
                    <span key={idx} className="badge badge-neutral" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8125rem' }}>
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Info Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                Job Information
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Compensation
                  </span>
                  <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--primary)' }}>
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Category
                  </span>
                  <span style={{ fontWeight: 600 }}>{job.category?.name || 'General'}</span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Experience Level
                  </span>
                  <span style={{ fontWeight: 600 }}>{job.experience_level || 'Not Specified'}</span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Workplace Type
                  </span>
                  <span style={{ fontWeight: 600 }}>{job.workplace_type}</span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Date Posted
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Engagement
                  </span>
                  <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Eye size={14} /> {job.views_count} views
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
                <Link to={`/jobs/${job.id}/apply`} className="btn btn-primary btn-block">
                  Apply for this position
                </Link>
              </div>
            </div>

            {/* Company Info Box */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem' }}>About the Employer</h4>
              <p style={{ fontWeight: 700, color: 'var(--text)' }}>{job.company_name}</p>
              {job.company_website && (
                <a
                  href={job.company_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.8125rem', marginTop: '0.5rem' }}
                >
                  <Globe size={13} /> Visit Company Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

