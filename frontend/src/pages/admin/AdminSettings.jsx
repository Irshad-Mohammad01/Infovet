import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Server,
  Database,
  Mail,
  HardDrive,
  Shield,
  Palette,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Save,
  Globe,
  Phone,
  Image as ImageIcon,
  UploadCloud,
  Trash2,
  ExternalLink,
  Eye,
  Info,
} from 'lucide-react';
import {
  fetchAdminSettings,
  fetchAdminBrandingSettings,
  updateAdminBrandingSettings,
  uploadPlatformLogo,
} from '../../services/api';
import { useBranding } from '../../context/BrandingContext';
import { normalizeImageUrl, isGoogleDriveUrl } from '../../utils/imageUrl';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSettings = () => {
  const { refreshBranding } = useBranding();
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [savingBranding, setSavingBranding] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Logo file upload state
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [logoPreviewError, setLogoPreviewError] = useState(false);
  const fileInputRef = useRef(null);

  // Editable branding state
  const [brandingForm, setBrandingForm] = useState({
    platform_name: '',
    platform_logo_url: '',
    favicon_url: '',
    tagline: '',
    primary_color: '#6025C5',
    secondary_color: '#F8F7FC',
    background_color: '#F8F7FC',
    support_email: '',
    contact_phone: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [diag, brand] = await Promise.all([
        fetchAdminSettings(),
        fetchAdminBrandingSettings(),
      ]);
      setSettingsData(diag);
      if (brand) {
        setBrandingForm({
          platform_name: brand.platform_name || '',
          platform_logo_url: brand.platform_logo_url || '',
          favicon_url: brand.favicon_url || '',
          tagline: brand.tagline || '',
          primary_color: brand.primary_color || '#6025C5',
          secondary_color: brand.secondary_color || '#F8F7FC',
          background_color: brand.background_color || '#F8F7FC',
          support_email: brand.support_email || '',
          contact_phone: brand.contact_phone || '',
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load system settings and branding.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cleanup object preview URL on unmount or file change
  useEffect(() => {
    return () => {
      if (filePreviewUrl && filePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  // Reset logo error when URL changes
  useEffect(() => {
    setLogoPreviewError(false);
  }, [brandingForm.platform_logo_url, filePreviewUrl]);

  const handleBrandingChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    // Auto-normalize if pasting a Google Drive link into platform_logo_url
    if (name === 'platform_logo_url') {
      const normalized = normalizeImageUrl(value);
      if (normalized && normalized !== value) {
        nextValue = normalized;
      }
    }

    setBrandingForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  // Drag and Drop Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndStageFile = (file) => {
    if (!file) return;

    // Validate type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type (${file.type}). Supported formats: PNG, JPG, SVG, WebP.`);
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 5 MB limit.`);
      return;
    }

    setError('');
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setFilePreviewUrl(objectUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndStageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndStageFile(e.target.files[0]);
    }
  };

  // Direct Upload & Save Logo
  const handleUploadAndSaveLogo = async () => {
    if (!selectedFile) return;

    setUploadingLogo(true);
    setError('');
    setSaveSuccess('');

    try {
      // 1. Upload binary file to backend storage
      const uploadRes = await uploadPlatformLogo(selectedFile);
      const relativeUrl = uploadRes.url;

      // 2. Persist URL in database settings
      const updatedForm = { ...brandingForm, platform_logo_url: relativeUrl };
      await updateAdminBrandingSettings(updatedForm);
      setBrandingForm(updatedForm);

      // 3. Clear staged local file
      setSelectedFile(null);
      setFilePreviewUrl(null);

      // 4. Propagate branding across public navbar, footer, admin sidebar
      await refreshBranding();

      setSaveSuccess('Platform logo uploaded and saved to Neon PostgreSQL successfully!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to upload and save platform logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  // Remove Logo
  const handleRemoveLogo = async () => {
    if (!window.confirm('Are you sure you want to remove the custom logo? The platform will use the default branded badge.')) {
      return;
    }

    setSavingBranding(true);
    setError('');
    setSaveSuccess('');

    try {
      const updatedForm = { ...brandingForm, platform_logo_url: '' };
      await updateAdminBrandingSettings(updatedForm);
      setBrandingForm(updatedForm);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      await refreshBranding();
      setSaveSuccess('Custom logo removed. Platform reverted to standard branding badge.');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to remove platform logo.');
    } finally {
      setSavingBranding(false);
    }
  };

  // Save General Branding Form
  const handleSaveBranding = async (e) => {
    e.preventDefault();
    setSavingBranding(true);
    setError('');
    setSaveSuccess('');

    try {
      // Normalize logo URL if user provided one manually
      const payload = {
        ...brandingForm,
        platform_logo_url: normalizeImageUrl(brandingForm.platform_logo_url) || '',
      };
      await updateAdminBrandingSettings(payload);
      setBrandingForm(payload);
      await refreshBranding();
      setSaveSuccess('Platform settings and branding updated successfully in Neon PostgreSQL!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to update platform branding.');
    } finally {
      setSavingBranding(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving platform diagnostics and settings..." />;
  }

  const isSmtpConfigured =
    settingsData?.smtp_status?.toLowerCase().includes('configured (active)');

  const activeDisplayLogo = filePreviewUrl || normalizeImageUrl(brandingForm.platform_logo_url);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
            Platform Settings & Branding
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Database-stored platform identity, logo management, brand palette, and infrastructure diagnostics
          </p>
        </div>

        <button
          onClick={loadData}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RefreshCw size={14} /> Refresh Diagnostics
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* --------------------------------------------------------------------------
         1. Dedicated Platform Logo Uploader & Real-Time Preview
         -------------------------------------------------------------------------- */}
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={20} style={{ color: 'var(--primary)' }} />
              Platform Logo & Visual Identity
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Upload a logo file or link an image. Updates propagate immediately to Public Navbar, Footer, and Admin Sidebar.
            </p>
          </div>

          {brandingForm.platform_logo_url && (
            <button
              type="button"
              onClick={handleRemoveLogo}
              disabled={savingBranding || uploadingLogo}
              className="btn btn-danger-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Trash2 size={14} /> Remove Custom Logo
            </button>
          )}
        </div>

        {/* Dual Mode: Drag & Drop File Upload + External URL */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
          {/* Column A: Drag & Drop Upload Zone */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
              Option 1: Upload Image File (Recommended)
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`,
                backgroundColor: dragActive ? 'var(--primary-subtle)' : 'var(--bg)',
                borderRadius: 'var(--radius)',
                padding: '2rem 1.25rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
              <UploadCloud
                size={36}
                style={{
                  color: dragActive ? 'var(--primary)' : 'var(--text-secondary)',
                  margin: '0 auto 0.75rem',
                }}
              />
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 0.25rem' }}>
                Drag & drop your logo here, or <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>browse</span>
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
                PNG, JPG, SVG, or WebP (max 5 MB)
              </p>
            </div>

            {/* Staged File Details & Action */}
            {selectedFile && (
              <div
                style={{
                  marginTop: '0.85rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid #D8B4FE',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedFile.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB — Ready to upload
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={handleUploadAndSaveLogo}
                    disabled={uploadingLogo}
                    className="btn btn-primary btn-sm"
                  >
                    {uploadingLogo ? 'Uploading...' : 'Upload & Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreviewUrl(null);
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Column A2: Direct URL Input / Google Drive Link */}
            <div style={{ marginTop: '1.25rem' }}>
              <label htmlFor="platform_logo_url_input" className="form-label" style={{ marginBottom: '0.35rem', display: 'block' }}>
                Option 2: Direct Image / Google Drive URL
              </label>
              <input
                id="platform_logo_url_input"
                name="platform_logo_url"
                type="text"
                className="form-input"
                placeholder="https://drive.google.com/file/d/... or direct image URL"
                value={brandingForm.platform_logo_url}
                onChange={handleBrandingChange}
              />
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginTop: '0.45rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <Info size={14} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
                <span>
                  Google Drive sharing URLs are auto-converted to direct binary image CDN links (<code>lh3.googleusercontent.com/d/ID</code>). Ensure file sharing in Google Drive is set to <strong>"Anyone with the link can view"</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Column B: Live Visual Preview */}
          <div style={{ backgroundColor: 'var(--bg)', borderRadius: 'var(--radius)', padding: '1.25rem', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Eye size={15} /> Real-Time Preview
            </h3>

            {/* Light Background Preview (Public Header) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Public Portal Navbar (Light Surface)
              </div>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  minHeight: '64px',
                }}
              >
                {activeDisplayLogo && !logoPreviewError ? (
                  <img
                    src={activeDisplayLogo}
                    alt="Logo Preview Light"
                    style={{ maxHeight: '36px', maxWidth: '140px', objectFit: 'contain' }}
                    onError={() => setLogoPreviewError(true)}
                  />
                ) : (
                  <span
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: brandingForm.primary_color || 'var(--primary)',
                      color: '#FFFFFF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                    }}
                  >
                    <Settings size={18} />
                  </span>
                )}
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1F1F1F', letterSpacing: '-0.025em' }}>
                  {brandingForm.platform_name || 'Infovet'}
                </span>
              </div>
            </div>

            {/* Dark Background Preview (Admin Executive Sidebar) */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Admin Console Sidebar (Dark Surface)
              </div>
              <div
                style={{
                  backgroundColor: '#130D24',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #23193D',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  minHeight: '64px',
                }}
              >
                {activeDisplayLogo && !logoPreviewError ? (
                  <img
                    src={activeDisplayLogo}
                    alt="Logo Preview Dark"
                    style={{ maxHeight: '36px', maxWidth: '140px', objectFit: 'contain' }}
                  />
                ) : (
                  <span
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      color: brandingForm.primary_color || 'var(--primary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                    }}
                  >
                    <Settings size={18} />
                  </span>
                )}
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.025em' }}>
                  {brandingForm.platform_name || 'Infovet'}
                </span>
              </div>
            </div>

            {logoPreviewError && (
              <div style={{ marginTop: '0.85rem', fontSize: '0.75rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <AlertCircle size={14} />
                <span>The logo URL failed to render as an image. Check that the link is publicly accessible.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------
         2. Dynamic Platform Identity & Typography Form
         -------------------------------------------------------------------------- */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Palette size={20} style={{ color: 'var(--primary)' }} />
          Database-Driven Platform Branding
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
          Configures platform name, tagline, brand colors, and contact info stored in Neon PostgreSQL and distributed via <code>GET /api/settings/public</code>.
        </p>

        <form onSubmit={handleSaveBranding}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="form-field">
              <label htmlFor="platform_name" className="form-label">
                Platform Name *
              </label>
              <input
                id="platform_name"
                name="platform_name"
                type="text"
                className="form-input"
                placeholder="e.g. INFOVET"
                value={brandingForm.platform_name}
                onChange={handleBrandingChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="tagline" className="form-label">
                Platform Tagline
              </label>
              <input
                id="tagline"
                name="tagline"
                type="text"
                className="form-input"
                placeholder="e.g. Find Your Next Career Opportunity"
                value={brandingForm.tagline}
                onChange={handleBrandingChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="favicon_url" className="form-label">
                Browser Favicon URL
              </label>
              <input
                id="favicon_url"
                name="favicon_url"
                type="url"
                className="form-input"
                placeholder="https://example.com/favicon.ico"
                value={brandingForm.favicon_url}
                onChange={handleBrandingChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="support_email" className="form-label">
                Public Support Email
              </label>
              <input
                id="support_email"
                name="support_email"
                type="email"
                className="form-input"
                placeholder="support@infovet.in"
                value={brandingForm.support_email}
                onChange={handleBrandingChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact_phone" className="form-label">
                Contact Phone Number
              </label>
              <input
                id="contact_phone"
                name="contact_phone"
                type="text"
                className="form-input"
                placeholder="+91 98765 43210"
                value={brandingForm.contact_phone}
                onChange={handleBrandingChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="primary_color" className="form-label">
                Primary Brand Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  id="primary_color"
                  name="primary_color"
                  type="color"
                  value={brandingForm.primary_color || '#6025C5'}
                  onChange={handleBrandingChange}
                  style={{ width: '42px', height: '40px', padding: '0.2rem', cursor: 'pointer', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
                <input
                  type="text"
                  name="primary_color"
                  className="form-input"
                  value={brandingForm.primary_color || '#6025C5'}
                  onChange={handleBrandingChange}
                  placeholder="#6025C5"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingBranding}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Save size={16} />
              <span>{savingBranding ? 'Saving to Neon DB...' : 'Save Platform Branding'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* --------------------------------------------------------------------------
         3. Infrastructure & Diagnostic Grid (Preserved)
         -------------------------------------------------------------------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Database Status */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(22, 163, 74, 0.08)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Database size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Database Engine</h3>
              <span className="badge badge-success" style={{ marginTop: '0.25rem' }}>
                Connected
              </span>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>Provider:</span>
              <strong style={{ color: 'var(--text)' }}>{settingsData?.database_type}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>Connection:</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>SSL Active / Pooled</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Credentials:</span>
              <span style={{ color: 'var(--text-secondary)' }}>Protected in backend/.env</span>
            </div>
          </div>
        </div>

        {/* Email / SMTP Status */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: isSmtpConfigured
                  ? 'rgba(22, 163, 74, 0.08)'
                  : 'rgba(245, 158, 11, 0.08)',
                color: isSmtpConfigured ? 'var(--success)' : 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Mail size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>SMTP Email Service</h3>
              <span
                className={`badge ${isSmtpConfigured ? 'badge-success' : 'badge-warning'}`}
                style={{ marginTop: '0.25rem' }}
              >
                {settingsData?.smtp_status || 'Simulated'}
              </span>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>Mode:</span>
              <strong style={{ color: 'var(--text)' }}>
                {isSmtpConfigured ? 'Live SMTP Delivery' : 'Simulated (Logged to terminal)'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Sender Address:</span>
              <span style={{ color: 'var(--text)' }}>{settingsData?.smtp_sender || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Storage & Upload Limits */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(96, 37, 197, 0.08)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HardDrive size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>File Storage</h3>
              <span className="badge badge-neutral" style={{ marginTop: '0.25rem' }}>
                Local Mount / Sandboxed
              </span>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>Max Upload Size:</span>
              <strong style={{ color: 'var(--text)' }}>
                {settingsData?.max_upload_size_mb} MB
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Allowed Types:</span>
              <span style={{ color: 'var(--text)' }}>PNG, JPG, SVG, WebP, PDF, DOC</span>
            </div>
          </div>
        </div>

        {/* Security & Sessions */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Security & Auth</h3>
              <span className="badge badge-neutral" style={{ marginTop: '0.25rem' }}>
                JWT Bearer (HS256)
              </span>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span>Token Lifetime:</span>
              <strong style={{ color: 'var(--text)' }}>
                {settingsData?.token_lifetime_days} Days
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Password Algorithm:</span>
              <span style={{ color: 'var(--text)' }}>bcrypt</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
