import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, Save, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { uploadAvatar, uploadResume } from '../services/api';

const EditProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    headline: user?.headline || '',
    phone: user?.phone || '',
    location: user?.location || '',
    skills: user?.skills || '',
    bio: user?.bio || '',
    linkedin_url: user?.linkedin_url || '',
    github_url: user?.github_url || '',
    portfolio_url: user?.portfolio_url || '',
    avatar_url: user?.avatar_url || '',
    resume_url: user?.resume_url || '',
  });

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setError('');
    try {
      const res = await uploadAvatar(file);
      setFormData((prev) => ({ ...prev, avatar_url: res.url }));
      setSuccess('Profile image uploaded. Save profile to confirm.');
    } catch (err) {
      setError(err.message || 'Failed to upload image.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setError('');
    try {
      const res = await uploadResume(file);
      setFormData((prev) => ({ ...prev, resume_url: res.url }));
      setSuccess('Resume uploaded. Save profile to confirm.');
    } catch (err) {
      setError(err.message || 'Failed to upload resume.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile(formData);
      setSuccess('Profile successfully updated.');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh', paddingTop: '2rem' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to Profile
          </Link>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Edit Candidate Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Update your professional information and upload your default resume.
          </p>

          {error && (
            <div className="form-notice form-notice-error" role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="form-notice form-notice-success" role="status">
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Avatar upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              {formData.avatar_url ? (
                <img
                  src={formData.avatar_url}
                  alt="Preview"
                  style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                  }}
                >
                  {(formData.full_name || 'U')[0]}
                </div>
              )}

              <div>
                <label
                  htmlFor="avatar-file"
                  className="btn btn-secondary btn-sm"
                  style={{ cursor: 'pointer', display: 'inline-flex' }}
                >
                  <Upload size={14} /> {uploadingAvatar ? 'Uploading…' : 'Upload Avatar'}
                </label>
                <input
                  type="file"
                  id="avatar-file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                  disabled={uploadingAvatar}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  PNG, JPG, or WEBP up to 5MB
                </p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="edit-name">Full Name *</label>
              <input
                type="text"
                id="edit-name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-headline">Professional Headline</label>
              <input
                type="text"
                id="edit-headline"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="e.g., Senior Full Stack Engineer | React & Python"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="edit-phone">Phone Number</label>
                <input
                  type="tel"
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-loc">Location</label>
                <input
                  type="text"
                  id="edit-loc"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Bengaluru, India or Remote"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="edit-skills">Skills (Comma-separated)</label>
              <input
                type="text"
                id="edit-skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="React, TypeScript, Python, FastAPI, Docker, PostgreSQL"
              />
            </div>

            <div className="form-field">
              <label htmlFor="edit-bio">Professional Bio</label>
              <textarea
                id="edit-bio"
                rows="4"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Summarize your professional experience, key achievements, and what you specialize in…"
              />
            </div>

            {/* Resume Upload */}
            <div className="form-field" style={{ margin: '1.25rem 0' }}>
              <label>Default Resume (PDF, DOC, DOCX)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.35rem' }}>
                <label
                  htmlFor="resume-file"
                  className="btn btn-secondary btn-sm"
                  style={{ cursor: 'pointer', display: 'inline-flex' }}
                >
                  <Upload size={14} /> {uploadingResume ? 'Uploading…' : 'Upload Resume'}
                </label>
                <input
                  type="file"
                  id="resume-file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  style={{ display: 'none' }}
                  disabled={uploadingResume}
                />
                {formData.resume_url && (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600 }}>
                    ✓ Resume file linked
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="edit-li">LinkedIn Profile</label>
                <input
                  type="url"
                  id="edit-li"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="form-field">
                <label htmlFor="edit-gh">GitHub Profile</label>
                <input
                  type="url"
                  id="edit-gh"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="edit-port">Portfolio / Website</label>
              <input
                type="url"
                id="edit-port"
                value={formData.portfolio_url}
                onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
              <Link to="/profile" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={saving || uploadingAvatar || uploadingResume}>
                <Save size={16} /> {saving ? 'Saving Changes…' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

