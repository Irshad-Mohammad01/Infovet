import React, { useState, useEffect } from 'react';
import {
  Building2,
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Linkedin,
  Github,
  Twitter,
} from 'lucide-react';
import { fetchAdminCompanyProfile, updateAdminCompanyProfile } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCompanyProfile = () => {
  const [profile, setProfile] = useState({
    company_name: '',
    tagline: '',
    short_description: '',
    about_markdown: '',
    mission: '',
    vision: '',
    experience_years: 5,
    projects_completed: 45,
    satisfied_clients: 38,
    primary_email: '',
    phone: '',
    address: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminCompanyProfile();
        if (data) {
          setProfile({
            company_name: data.company_name || '',
            tagline: data.tagline || '',
            short_description: data.short_description || '',
            about_markdown: data.about_markdown || '',
            mission: data.mission || '',
            vision: data.vision || '',
            experience_years: data.experience_years ?? 5,
            projects_completed: data.projects_completed ?? 45,
            satisfied_clients: data.satisfied_clients ?? 38,
            primary_email: data.primary_email || '',
            phone: data.phone || '',
            address: data.address || '',
            linkedin_url: data.linkedin_url || '',
            github_url: data.github_url || '',
            twitter_url: data.twitter_url || '',
          });
        }
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load company profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const payload = {
        ...profile,
        experience_years: parseInt(profile.experience_years, 10) || 0,
        projects_completed: parseInt(profile.projects_completed, 10) || 0,
        satisfied_clients: parseInt(profile.satisfied_clients, 10) || 0,
      };
      await updateAdminCompanyProfile(payload);
      setSuccessMessage('Company profile information updated successfully in Neon DB.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading company profile..." />;
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
          Company Profile & Information
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Update your company overview, mission, coordinates, and social profiles displayed across the public website.
        </p>
      </div>

      {successMessage && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: 'var(--error-bg)',
            color: 'var(--error)',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem', border: '1px solid var(--border)', borderRadius: '16px' }}>
        {/* Core Identity */}
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
          1. Business Identity
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label className="form-label">Company Legal / Brand Name *</label>
            <input
              type="text"
              name="company_name"
              value={profile.company_name}
              onChange={handleChange}
              required
              placeholder="INFOVATE"
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={profile.tagline}
              onChange={handleChange}
              placeholder="We Build Digital Solutions That Move Businesses Forward."
              className="form-control"
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Short Description (displayed in hero / footer) *</label>
          <input
            type="text"
            name="short_description"
            value={profile.short_description}
            onChange={handleChange}
            required
            placeholder="INFOVATE is a modern software development startup..."
            className="form-control"
          />
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <label className="form-label">Company Overview / Story (Markdown supported) *</label>
          <textarea
            name="about_markdown"
            value={profile.about_markdown}
            onChange={handleChange}
            rows={5}
            required
            placeholder="Describe your company's core focus, expertise, and target clients..."
            className="form-control"
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Stats Strip */}
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
          2. Platform Statistics
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
          <div>
            <label className="form-label">Years of Experience</label>
            <input
              type="number"
              name="experience_years"
              value={profile.experience_years}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label">Projects Completed</label>
            <input
              type="number"
              name="projects_completed"
              value={profile.projects_completed}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label">Satisfied Clients</label>
            <input
              type="number"
              name="satisfied_clients"
              value={profile.satisfied_clients}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
          3. Mission & Vision Statements
        </h2>

        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Mission Statement</label>
          <textarea
            name="mission"
            value={profile.mission}
            onChange={handleChange}
            rows={3}
            placeholder="To empower businesses through scalable digital products..."
            className="form-control"
            style={{ resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <label className="form-label">Vision Statement</label>
          <textarea
            name="vision"
            value={profile.vision}
            onChange={handleChange}
            rows={3}
            placeholder="To be the premier software engineering partner..."
            className="form-control"
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Contact Coordinates */}
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
          4. Contact Coordinates
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label className="form-label">Official Inquiries Email</label>
            <input
              type="email"
              name="primary_email"
              value={profile.primary_email}
              onChange={handleChange}
              placeholder="contact@infovate.in"
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label">Contact Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="form-control"
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <label className="form-label">Office Address / Development Centers</label>
          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            placeholder="Bengaluru, Karnataka, India"
            className="form-control"
          />
        </div>

        {/* Social Links */}
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginTop: '1rem' }}>
          5. Social & Developer Links
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div>
            <label className="form-label">LinkedIn Page</label>
            <input
              type="url"
              name="linkedin_url"
              value={profile.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/company/infovate"
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label">GitHub Organization</label>
            <input
              type="url"
              name="github_url"
              value={profile.github_url}
              onChange={handleChange}
              placeholder="https://github.com/infovate"
              className="form-control"
            />
          </div>
          <div>
            <label className="form-label">Twitter / X Profile</label>
            <input
              type="url"
              name="twitter_url"
              value={profile.twitter_url}
              onChange={handleChange}
              placeholder="https://twitter.com/infovate"
              className="form-control"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-lg"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Save size={18} />
          <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
};

export default AdminCompanyProfile;
