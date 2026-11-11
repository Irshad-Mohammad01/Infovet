import React, { useState } from 'react';
import {
  X,
  FileText,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  ExternalLink,
  Download,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Linkedin,
} from 'lucide-react';
import ApplicationStatusBadge from '../../components/jobs/ApplicationStatusBadge';
import { updateAdminApplicationStatus } from '../../services/api';

const ApplicantDetailModal = ({ application, isOpen, onClose, onUpdated }) => {
  const [status, setStatus] = useState(application?.status || 'pending');
  const [adminNotes, setAdminNotes] = useState(application?.admin_notes || '');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Synchronize state when application changes
  React.useEffect(() => {
    if (application) {
      setStatus(application.status || 'pending');
      setAdminNotes(application.admin_notes || '');
      setError('');
      setSuccess(false);
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess(false);

    try {
      const updated = await updateAdminApplicationStatus(application.id, {
        status,
        admin_notes: adminNotes || null,
      });
      setSuccess(true);
      if (onUpdated) onUpdated(updated);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update application status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAFAFC',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                {application.full_name}
              </h2>
              <ApplicationStatusBadge status={status} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', margin: '0.25rem 0 0 0' }}>
              Applied for{' '}
              <strong>{application.job?.title || 'Unknown Position'}</strong> at{' '}
              {application.job?.company_name || 'Infovet'}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '0.25rem',
            }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && (
            <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} />
              <span>Status updated successfully. Candidate notified via system log.</span>
            </div>
          )}

          {/* Candidate Contact & Links */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              backgroundColor: '#F8F7FC',
              padding: '1.25rem',
              borderRadius: '8px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Email Address
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontSize: '0.875rem' }}>
                <Mail size={15} style={{ color: 'var(--primary)' }} />
                <a href={`mailto:${application.email}`} style={{ color: 'inherit', fontWeight: 500 }}>
                  {application.email}
                </a>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Phone
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontSize: '0.875rem' }}>
                <Phone size={15} style={{ color: 'var(--primary)' }} />
                <span>{application.phone || 'Not provided'}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Applied Date
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', fontSize: '0.875rem' }}>
                <Calendar size={15} style={{ color: 'var(--primary)' }} />
                <span>
                  {application.applied_at
                    ? new Date(application.applied_at).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
                Resume / CV
              </span>
              <div style={{ marginTop: '0.25rem' }}>
                {application.resume_url ? (
                  <a
                    href={application.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-xs"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Download size={13} /> View Attached Resume
                  </a>
                ) : (
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>None attached</span>
                )}
              </div>
            </div>
          </div>

          {/* External profiles */}
          {(application.portfolio_url || application.linkedin_url) && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {application.linkedin_url && (
                <a
                  href={application.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-xs"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Linkedin size={14} /> Candidate LinkedIn Profile
                </a>
              )}
              {application.portfolio_url && (
                <a
                  href={application.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-xs"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Globe size={14} /> Candidate Portfolio
                </a>
              )}
            </div>
          )}

          {/* Cover Note */}
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} /> Cover Note / Candidate Statement
            </h3>
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#FAFAFC',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
                minHeight: '80px',
              }}
            >
              {application.cover_note || 'Candidate did not include an additional cover note.'}
            </div>
          </div>

          {/* Admin Evaluation & Status Form */}
          <form onSubmit={handleSaveStatus} style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>
              Evaluation & Application Status
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-field">
                <label htmlFor="eval-status" className="form-label">
                  Workflow Status
                </label>
                <select
                  id="eval-status"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending Review</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="accepted">Accepted / Offer Extended</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="eval-notes" className="form-label">
                  Recruiter Internal Notes (Visible to candidate on application tracker)
                </label>
                <textarea
                  id="eval-notes"
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Cleared round 1 technical interview. Moving to executive presentation..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={updating}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Save size={15} />
                <span>{updating ? 'Saving Changes...' : 'Save Application Decision'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailModal;

