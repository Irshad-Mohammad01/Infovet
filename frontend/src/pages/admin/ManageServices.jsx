import React, { useState, useEffect } from 'react';
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Code2,
  Smartphone,
  Cloud,
  Cpu,
  Zap,
  ShieldCheck,
  X,
  Save,
} from 'lucide-react';
import {
  fetchAdminServices,
  createAdminService,
  updateAdminService,
  deleteAdminService,
} from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ICONS = ['Code2', 'Smartphone', 'Cloud', 'Cpu', 'Layers', 'Zap', 'ShieldCheck'];

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: 'Code2',
    short_description: '',
    description: '',
    features_raw: '',
    technologies_raw: '',
    display_order: 0,
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      icon: 'Code2',
      short_description: '',
      description: '',
      features_raw: '',
      technologies_raw: '',
      display_order: services.length + 1,
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingId(service.id);
    setFormData({
      title: service.title || '',
      slug: service.slug || '',
      icon: service.icon || 'Code2',
      short_description: service.short_description || '',
      description: service.description || '',
      features_raw: Array.isArray(service.features) ? service.features.join('\n') : '',
      technologies_raw: Array.isArray(service.technologies) ? service.technologies.join(', ') : '',
      display_order: service.display_order || 0,
      is_active: service.is_active ?? true,
    });
    setModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    if (!editingId && (!formData.slug || formData.slug === formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, title, slug }));
    } else {
      setFormData((prev) => ({ ...prev, title }));
    }
  };

  const handleSave = async (e) => {
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
      icon: formData.icon,
      short_description: formData.short_description || null,
      description: formData.description,
      features,
      technologies,
      display_order: parseInt(formData.display_order, 10) || 0,
      is_active: formData.is_active,
    };

    try {
      if (editingId) {
        await updateAdminService(editingId, payload);
        setSuccess('Service updated successfully.');
      } else {
        await createAdminService(payload);
        setSuccess('Service created successfully.');
      }
      setModalOpen(false);
      loadServices();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await deleteAdminService(id);
      setSuccess(`Service "${title}" deleted.`);
      loadServices();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete service.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Manage Services
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Define, organize, and publish your company's core software development services and deliverables.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <PlusCircle size={16} />
          <span>Add New Service</span>
        </button>
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

      {loading ? (
        <LoadingSpinner text="Loading services..." />
      ) : services.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <Layers size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Services Listed</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Click "Add New Service" to publish your first capability.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            Add Service
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Service Title</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Slug</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Icon</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Order</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)' }}>{service.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {service.short_description}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                    {service.slug}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      {service.icon}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                    {service.display_order}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        backgroundColor: service.is_active ? '#DCFCE7' : '#F1F5F9',
                        color: service.is_active ? '#15803D' : '#64748B',
                      }}
                    >
                      {service.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openEditModal(service)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.3rem 0.6rem' }}
                        title="Edit Service"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id, service.title)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.3rem 0.6rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                        title="Delete Service"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              borderRadius: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingId ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Service Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                    placeholder="Custom Software Development"
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                    required
                    placeholder="custom-software"
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
                    className="form-control"
                  >
                    {ICONS.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData((p) => ({ ...p, display_order: e.target.value }))}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Short Description</label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData((p) => ({ ...p, short_description: e.target.value }))}
                  placeholder="Bespoke web applications and enterprise portals..."
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Full Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  required
                  placeholder="Detailed description of the service and business value..."
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Deliverables & Features (one per line)</label>
                <textarea
                  value={formData.features_raw}
                  onChange={(e) => setFormData((p) => ({ ...p, features_raw: e.target.value }))}
                  rows={4}
                  placeholder="Architecture planning&#10;Full-stack development&#10;Automated unit & integration testing"
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={formData.technologies_raw}
                  onChange={(e) => setFormData((p) => ({ ...p, technologies_raw: e.target.value }))}
                  placeholder="React, TypeScript, FastAPI, PostgreSQL, Docker"
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData((p) => ({ ...p, is_active: e.target.checked }))}
                />
                <label htmlFor="is_active" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                  Active & visible on public website
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Save size={15} />
                  <span>{saving ? 'Saving...' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;

