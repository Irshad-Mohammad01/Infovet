import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ApplicationStatusBadge from '../components/jobs/ApplicationStatusBadge';
import { fetchApplicationDetail } from '../services/api';

const ApplicationDetails = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicationDetail(id)
      .then((data) => setApp(data))
      .catch((err) => setError(err.message || 'Could not load application details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <LoadingSpinner text="Loading application record…" />
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Application Record Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/my-applications" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to My Applications
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '80vh', paddingTop: '2rem' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/my-applications"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to My Applications
          </Link>
        </div>

        {/* Application Status Header */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <span className="eyebrow">Application #{app.id}</span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>
                {app.job?.title || 'Job Position'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                {app.job?.company_name} • {app.job?.location}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                CURRENT STATUS
              </span>
              <ApplicationStatusBadge status={app.status} />
            </div>
          </div>
        </div>

        {/* Candidate Submission Details */}
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            Application Submission Summary
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Applicant Name</span>
              <span style={{ fontWeight: 600 }}>{app.full_name}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Contact Email</span>
              <span style={{ fontWeight: 600 }}>{app.email}</span>
            </div>
            {app.phone && (
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Contact Phone</span>
                <span style={{ fontWeight: 600 }}>{app.phone}</span>
              </div>
            )}
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Submission Date</span>
              <span style={{ fontWeight: 600 }}>
                {new Date(app.applied_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              Attached Resume
            </span>
            <a
              href={app.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex' }}
            >
              <FileText size={15} /> Open Submitted Resume <ExternalLink size={12} />
            </a>
          </div>

          {app.cover_note && (
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                Cover Letter / Candidate Note
              </span>
              <div
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'var(--text)',
                  whiteSpace: 'pre-line',
                }}
              >
                {app.cover_note}
              </div>
            </div>
          )}

          {app.admin_notes && (
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
              <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <MessageSquare size={14} /> Employer / Hiring Team Feedback
              </span>
              <div
                style={{
                  backgroundColor: 'var(--primary-light)',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'var(--text)',
                }}
              >
                {app.admin_notes}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;

