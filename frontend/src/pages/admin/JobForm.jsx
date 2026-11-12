import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Sparkles,
  Layers,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  createAdminJob,
  updateAdminJob,
  fetchJobDetail,
  fetchCategories,
} from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EMPTY_JOB = {
  title: '',
  company_name: '',
  company_logo: '',
  company_website: '',
  category_id: '',
  job_type: 'Full-time',
  workplace_type: 'Remote',
  experience_level: 'Mid Level',
  location: 'Remote',
  salary_min: '',
  salary_max: '',
  salary_currency: 'INR',
  salary_is_negotiable: false,
  description: '',
  requirements: '',
  benefits: '',
  tags: '',
  is_active: true,
  is_featured: false,
  deadline: '',
};

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(EMPTY_JOB);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catList = await fetchCategories();
        setCategories(catList || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!isEditing) return;

    const loadJob = async () => {
      setLoading(true);
      setError('');
      try {
        const job = await fetchJobDetail(id);
        setFormData({
          title: job.title || '',
          company_name: job.company_name || job.company || '',
          company_logo: job.company_logo || '',
          company_website: job.company_website || '',
          category_id: job.category_id || (job.category ? job.category.id : ''),
          job_type: job.job_type || 'Full-time',
          workplace_type: job.workplace_type || 'Remote',
          experience_level: job.experience_level || 'Mid Level',
          location: job.location || 'Remote',
          salary_min: job.salary_min !== null && job.salary_min !== undefined ? String(job.salary_min) : '',
          salary_max: job.salary_max !== null && job.salary_max !== undefined ? String(job.salary_max) : '',
          salary_currency: job.salary_currency || 'INR',
          salary_is_negotiable: Boolean(job.salary_is_negotiable),
          description: job.description || '',
          requirements: job.requirements || '',
          benefits: job.benefits || '',
          tags: job.tags || '',
          is_active: job.is_active !== undefined ? job.is_active : true,
          is_featured: Boolean(job.is_featured),
          deadline: job.deadline ? job.deadline.split('T')[0] : '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load job details for editing.');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.title.trim()) {
      setError('Please provide a job title.');
      return;
    }
    if (!formData.company_name.trim()) {
      setError('Please provide a company name.');
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setError('Job description must be at least 10 characters.');
      return;
    }
    if (!formData.requirements.trim() || formData.requirements.trim().length < 10) {
      setError('Job requirements must be at least 10 characters.');
      return;
    }

    setSubmitting(true);

    const payload = {
      ...formData,
      category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
      salary_min: formData.salary_min ? parseInt(formData.salary_min, 10) : null,
      salary_max: formData.salary_max ? parseInt(formData.salary_max, 10) : null,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
    };

    try {
      if (isEditing) {
        await updateAdminJob(id, payload);
        setSuccess('Job listing updated successfully!');
      } else {
        await createAdminJob(payload);
        setSuccess('Job listing published successfully!');
      }
      setTimeout(() => {
        navigate('/admin/jobs');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to save job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving job information..." />;
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back button */}
      <div>
        <Link
          to="/admin/jobs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} /> Back to Job Management
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
          {isEditing ? 'Edit Job Listing' : 'Post New Opportunity'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          {isEditing
            ? 'Update the requirements, terms, or status of this listing.'
            : 'Publish a new job opening to the Infovate candidate talent pool.'}
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
        {/* Section 1: Basic Information */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={18} style={{ color: 'var(--primary)' }} /> Basic Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-field">
              <label htmlFor="title" className="form-label">
                Job Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-input"
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="category_id" className="form-label">
                Job Category
              </label>
              <select
                id="category_id"
                name="category_id"
                className="form-select"
                value={formData.category_id}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Company Details */}
        <div style={{ marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} style={{ color: 'var(--primary)' }} /> Company Details
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-field">
              <label htmlFor="company_name" className="form-label">
                Company Name *
              </label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                className="form-input"
                placeholder="e.g. Acme Corp"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="company_website" className="form-label">
                Company Website
              </label>
              <input
                id="company_website"
                name="company_website"
                type="url"
                className="form-input"
                placeholder="https://example.com"
                value={formData.company_website}
                onChange={handleChange}
              />
            </div>

            <div className="form-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="company_logo" className="form-label">
                Company Logo URL
              </label>
              <input
                id="company_logo"
                name="company_logo"
                type="url"
                className="form-input"
                placeholder="https://example.com/logo.png"
                value={formData.company_logo}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Job Classification & Location */}
        <div style={{ marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} style={{ color: 'var(--primary)' }} /> Role Classification & Location
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-field">
              <label htmlFor="job_type" className="form-label">
                Job Type
              </label>
              <select
                id="job_type"
                name="job_type"
                className="form-select"
                value={formData.job_type}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="workplace_type" className="form-label">
                Workplace Type
              </label>
              <select
                id="workplace_type"
                name="workplace_type"
                className="form-select"
                value={formData.workplace_type}
                onChange={handleChange}
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="experience_level" className="form-label">
                Experience Level
              </label>
              <select
                id="experience_level"
                name="experience_level"
                className="form-select"
                value={formData.experience_level}
                onChange={handleChange}
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Principal">Lead / Principal</option>
                <option value="Director / Executive">Director / Executive</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-input"
                placeholder="e.g. Bengaluru, India or Remote"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Compensation */}
        <div style={{ marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Compensation & Budget
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="form-field">
              <label htmlFor="salary_currency" className="form-label">
                Currency
              </label>
              <select
                id="salary_currency"
                name="salary_currency"
                className="form-select"
                value={formData.salary_currency}
                onChange={handleChange}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="salary_min" className="form-label">
                Minimum Annual Salary
              </label>
              <input
                id="salary_min"
                name="salary_min"
                type="number"
                min="0"
                className="form-input"
                placeholder="e.g. 1200000"
                value={formData.salary_min}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="salary_max" className="form-label">
                Maximum Annual Salary
              </label>
              <input
                id="salary_max"
                name="salary_max"
                type="number"
                min="0"
                className="form-input"
                placeholder="e.g. 2400000"
                value={formData.salary_max}
                onChange={handleChange}
              />
            </div>

            <div className="form-field" style={{ alignSelf: 'center', paddingTop: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  name="salary_is_negotiable"
                  checked={formData.salary_is_negotiable}
                  onChange={handleChange}
                />
                <span>Salary is negotiable</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 5: Role Details */}
        <div style={{ marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Detailed Specifications
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-field">
              <label htmlFor="description" className="form-label">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                rows={5}
                placeholder="Overview of the mission, day-to-day responsibilities, and team context..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="requirements" className="form-label">
                Key Requirements & Qualifications *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                className="form-textarea"
                rows={5}
                placeholder="Required technical skills, education, and years of experience..."
                value={formData.requirements}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="benefits" className="form-label">
                Perks & Benefits
              </label>
              <textarea
                id="benefits"
                name="benefits"
                className="form-textarea"
                rows={3}
                placeholder="Health insurance, 401(k), equity, remote budget, flexible leave..."
                value={formData.benefits}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="tags" className="form-label">
                Tags / Skills (Comma-separated)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                className="form-input"
                placeholder="React, TypeScript, FastAPI, PostgreSQL"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Section 6: Publishing Options */}
        <div style={{ marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Publishing Controls
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-field">
              <label htmlFor="deadline" className="form-label">
                Application Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                className="form-input"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="form-field" style={{ alignSelf: 'center', paddingTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <span style={{ fontWeight: 600 }}>Active (Visible on public portal)</span>
              </label>
            </div>

            <div className="form-field" style={{ alignSelf: 'center', paddingTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                />
                <span style={{ fontWeight: 600 }}>Featured Job (Highlighted in search)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/admin/jobs')}
            className="btn btn-outline"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={submitting}
          >
            <Save size={16} />
            <span>{submitting ? 'Saving...' : isEditing ? 'Update Job' : 'Publish Job'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;

