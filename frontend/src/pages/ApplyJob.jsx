import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Paperclip,
  Send,
  Upload,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { fetchJobDetail, submitApplication, uploadResume } from '../services/api';

const ApplyJob = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    resumeUrl: '',
    resumeName: '',
    coverNote: '',
    portfolioUrl: '',
    linkedinUrl: '',
  });

  // Load job details and pre-fill authenticated user data
  useEffect(() => {
    const init = async () => {
      try {
        const jobData = await fetchJobDetail(id);
        setJob(jobData);

        if (user) {
          setFormData((prev) => ({
            ...prev,
            fullName: user.full_name || '',
            email: user.email || '',
            phone: user.phone || '',
            resumeUrl: user.resume_url || '',
            resumeName: user.resume_url ? 'Profile Default Resume' : '',
            linkedinUrl: user.linkedin_url || '',
            portfolioUrl: user.portfolio_url || '',
          }));
        }
      } catch (err) {
        setError(err.message || 'Unable to load position.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, user]);

  const handleResumeFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setError('');

    try {
      const res = await uploadResume(file);
      setFormData((prev) => ({
        ...prev,
        resumeUrl: res.url,
        resumeName: file.name,
      }));
    } catch (err) {
      setError(err.message || 'Failed to upload resume file.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.resumeUrl) {
      setError('Please upload your resume to complete your application.');
      return;
    }

    setSubmitting(true);

    try {
      await submitApplication({
        job_id: job.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        resume_url: formData.resumeUrl,
        cover_note: formData.coverNote || null,
        portfolio_url: formData.portfolioUrl || null,
        linkedin_url: formData.linkedinUrl || null,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Application submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <LoadingSpinner text="Preparing application form…" />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="section" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '580px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '3.5rem 2rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Application Submitted!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Your application for <strong>{job.title}</strong> at <strong>{job.company_name}</strong> has been
              delivered to the hiring team.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/my-applications" className="btn btn-primary">
                View My Applications
              </Link>
              <Link to="/jobs" className="btn btn-secondary">
                Explore More Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to={`/jobs/${job.slug || job.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Cancel & Back to Job Details
          </Link>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <span className="eyebrow">Job Application</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>{job.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              {job.company_name} • {job.location} ({job.workplace_type})
            </p>
          </div>

          {error && (
            <div className="form-notice form-notice-error" role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="app-name">Full Name *</label>
              <input
                type="text"
                id="app-name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="app-email">Email Address *</label>
                <input
                  type="email"
                  id="app-email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="app-phone">Phone Number</label>
                <input
                  type="tel"
                  id="app-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Resume Upload Box */}
            <div className="form-field" style={{ margin: '1.25rem 0' }}>
              <label>Resume / CV Document * (PDF, DOC, DOCX up to 10MB)</label>
              <div
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '1.75rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-subtle)',
                  marginTop: '0.5rem',
                }}
              >
                {formData.resumeUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <FileText size={24} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{formData.resumeName || 'Resume Attached'}</span>
                    <label
                      htmlFor="resume-file-input"
                      style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8125rem', textDecoration: 'underline' }}
                    >
                      Change File
                    </label>
                  </div>
                ) : (
                  <div>
                    <Upload size={28} style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
                    <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                      {uploadingResume ? 'Uploading resume…' : 'Click to select resume file'}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                      Supports PDF, DOC, and DOCX formats
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  id="resume-file-input"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeFileChange}
                  style={{ display: 'none' }}
                  disabled={uploadingResume}
                />
                {!formData.resumeUrl && (
                  <label
                    htmlFor="resume-file-input"
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '0.75rem', display: 'inline-flex' }}
                  >
                    Select Resume
                  </label>
                )}
              </div>
            </div>

            {/* Cover Note */}
            <div className="form-field">
              <label htmlFor="app-cover">Cover Note / Why you are a great fit</label>
              <textarea
                id="app-cover"
                rows="4"
                value={formData.coverNote}
                onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                placeholder="Introduce yourself, your key achievements, and what excites you about this role…"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="app-linkedin">LinkedIn Profile URL</label>
                <input
                  type="url"
                  id="app-linkedin"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="form-field">
                <label htmlFor="app-portfolio">Portfolio / GitHub Link</label>
                <input
                  type="url"
                  id="app-portfolio"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '2rem' }}
              disabled={submitting || uploadingResume}
            >
              {submitting ? 'Submitting Application…' : 'Submit Application'}
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;

