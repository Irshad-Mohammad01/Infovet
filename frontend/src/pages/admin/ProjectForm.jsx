import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  FolderGit2,
} from 'lucide-react';
import {
  fetchAdminProjectDetail,
  createAdminProject,
  updateAdminProject,
  uploadProjectImageFile,
  addAdminProjectImage,
  deleteAdminProjectImage,
} from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { normalizeImageUrl } from '../../utils/imageUrl';

const CATEGORIES = [
  'Web Application',
  'Mobile App',
  'SaaS Platform',
  'E-Commerce',
  'Custom Software',
  'AI / Automation',
  'Cloud Infrastructure',
  'Other',
];

const STATUSES = ['In Progress', 'Completed', 'Maintained', 'Draft'];

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Web Application',
    client_name: '',
    completion_date: '',
    short_description: '',
    description: '',
    project_url: '',
    github_url: '',
    thumbnail_url: '',
    features_raw: '',
    technologies_raw: '',
    status: 'Completed',
    is_featured: false,
    display_order: 0,
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    const loadProject = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAdminProjectDetail(id);
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          category: data.category || 'Web Application',
          client_name: data.client_name || '',
          completion_date: data.completion_date || '',
          short_description: data.short_description || '',
          description: data.description || '',
          project_url: data.project_url || '',
          github_url: data.github_url || '',
          thumbnail_url: data.thumbnail_url || '',
          features_raw: Array.isArray(data.features) ? data.features.join('\n') : '',
          technologies_raw: Array.isArray(data.technologies) ? data.technologies.join(', ') : '',
          status: data.status || 'Completed',
          is_featured: data.is_featured ?? false,
          display_order: data.display_order || 0,
        });
        setImages(Array.isArray(data.images) ? data.images : []);
      } catch (err) {
        setError(err.message || 'Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, isEditing]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (!isEditing && (!formData.slug || formData.slug === formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, title, slug }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Thumbnail upload handler
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumb(true);
    setError('');
    try {
      const res = await uploadProjectImageFile(file);
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, thumbnail_url: res.url }));
        setSuccess('Thumbnail uploaded successfully.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Thumbnail upload failed.');
    } finally {
      setUploadingThumb(false);
    }
  };

  // Gallery screenshots uploader (multi-file)
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (!isEditing) {
      setError('Please save the project first before uploading gallery screenshots.');
      return;
    }

    setUploadingGallery(true);
    setError('');
    try {
      for (const file of files) {
        const uploadRes = await uploadProjectImageFile(file);
        if (uploadRes && uploadRes.url) {
          const imgRecord = await addAdminProjectImage(id, {
            image_url: uploadRes.url,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            display_order: images.length + 1,
          });
          setImages((prev) => [...prev, imgRecord]);
        }
      }
      setSuccess('Gallery screenshots uploaded successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Gallery upload failed.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Delete this screenshot?')) return;
    try {
      await deleteAdminProjectImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setSuccess('Screenshot deleted.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete screenshot.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const features = formData.features_raw
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const technologies = formData.technologies_raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: formData.category,
      client_name: formData.client_name || null,
      completion_date: formData.completion_date || null,
      short_description: formData.short_description || null,
      description: formData.description,
      project_url: formData.project_url || null,
      github_url: formData.github_url || null,
      thumbnail_url: formData.thumbnail_url || null,
      features,
      technologies,
      status: formData.status,
      is_featured: formData.is_featured,
      display_order: parseInt(formData.display_order, 10) || 0,
    };

    try {
      if (isEditing) {
        await updateAdminProject(id, payload);
        setSuccess('Project updated successfully.');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const created = await createAdminProject(payload);
        navigate(`/admin/projects/${created.id}/edit`);
      }
    } catch (err) {
      setError(err.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading project details..." />;
  }

  const thumbUrl = normalizeImageUrl(formData.thumbnail_url);

  return (
    <div style={{ maxWidth: '960px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/admin/projects"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Projects List</span>
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
          {isEditing ? `Edit Project: ${formData.title}` : 'Add New Portfolio Project'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Configure case study details, deliverables, technologies, and visual screenshots.
        </p>
      </div>

      {success && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', backgroundColor: 'var(--error-bg)', color: 'var(--error)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ padding: '2.5rem', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '2rem' }}>
          {/* Basic Info */}
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            1. Core Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                required
                placeholder="Enterprise FinTech Dashboard"
                className="form-control"
              />
            </div>
            <div>
              <label className="form-label">Slug / URL Key *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="enterprise-fintech-dashboard"
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-control">
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Client Name</label>
              <input
                type="text"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                placeholder="Stripe, Razorpay, or Internal"
                className="form-control"
              />
            </div>
            <div>
              <label className="form-label">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-control">
                {STATUSES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Completion Date</label>
              <input
                type="text"
                name="completion_date"
                value={formData.completion_date}
                onChange={handleChange}
                placeholder="October 2024"
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">Live Project URL</label>
              <input
                type="url"
                name="project_url"
                value={formData.project_url}
                onChange={handleChange}
                placeholder="https://app.clientdomain.com"
                className="form-control"
              />
            </div>
            <div>
              <label className="form-label">GitHub Repository URL</label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/organization/repo"
                className="form-control"
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
              />
              <label htmlFor="is_featured" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                Featured on Homepage Showcase
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="display_order" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Display Order:</label>
              <input
                type="number"
                id="display_order"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                style={{ width: '80px', padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border)' }}
              />
            </div>
          </div>

          {/* Narrative & Scope */}
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginTop: '1.5rem' }}>
            2. Case Study Content & Scope
          </h2>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Short Summary (displayed on portfolio cards) *</label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              placeholder="High-throughput payment gateway orchestrator with real-time analytics..."
              className="form-control"
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Full Case Study Narrative & Architecture *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
              placeholder="Detailed explanation of the business problem, architectural design, solution delivered, and results achieved..."
              className="form-control"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Key Features & Deliverables (one per line)</label>
            <textarea
              name="features_raw"
              value={formData.features_raw}
              onChange={handleChange}
              rows={4}
              placeholder="Micro-frontend architecture&#10;Sub-second GraphQL query caching&#10;Automated KYC pipeline"
              className="form-control"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Technologies Stack (comma-separated tags)</label>
            <input
              type="text"
              name="technologies_raw"
              value={formData.technologies_raw}
              onChange={handleChange}
              placeholder="React, Next.js, FastAPI, PostgreSQL, Redis, AWS ECS, Docker"
              className="form-control"
            />
          </div>

          {/* Main Thumbnail Uploader */}
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginTop: '1.5rem' }}>
            3. Project Thumbnail / Cover Image
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <label className="form-label">Image URL or File Upload</label>
              <input
                type="text"
                name="thumbnail_url"
                value={formData.thumbnail_url}
                onChange={handleChange}
                placeholder="https://... or upload below"
                className="form-control"
                style={{ marginBottom: '0.75rem' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Upload size={14} />
                  <span>{uploadingThumb ? 'Uploading...' : 'Upload Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploadingThumb}
                    style={{ display: 'none' }}
                  />
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JPG, PNG, WebP up to 5MB</span>
              </div>
            </div>

            <div style={{ width: '220px', height: '135px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {thumbUrl ? (
                <img src={thumbUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <ImageIcon size={24} style={{ margin: '0 auto 0.25rem' }} />
                  No Thumbnail
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={18} />
            <span>{saving ? 'Saving Project...' : (isEditing ? 'Update Project' : 'Create Project')}</span>
          </button>
        </div>
      </form>

      {/* Multi-Image Screenshot Gallery Manager (Only for saved projects) */}
      {isEditing && (
        <div className="card" style={{ padding: '2.5rem', border: '1px solid var(--border)', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
                Screenshot Gallery ({images.length})
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                High-resolution mockups, admin screens, or mobile app flow screenshots displayed on the case study page.
              </p>
            </div>

            <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Upload size={15} />
              <span>{uploadingGallery ? 'Uploading Screenshots...' : 'Add Screenshots'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {images.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: 'var(--bg)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
              <ImageIcon size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                No additional screenshots added yet. Click "Add Screenshots" above to upload high-fidelity gallery images.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {images.map((img) => {
                const imgUrl = normalizeImageUrl(img.image_url);
                return (
                  <div
                    key={img.id}
                    style={{
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      position: 'relative',
                    }}
                  >
                    <div style={{ height: '130px', overflow: 'hidden' }}>
                      <img src={imgUrl} alt={img.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' }}>
                        {img.caption || 'Screenshot'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--error)',
                          cursor: 'pointer',
                          padding: '0.2rem',
                        }}
                        title="Delete Screenshot"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectForm;

