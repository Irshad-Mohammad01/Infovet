import React, { useState, useEffect } from 'react';
import {
  Cpu,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';
import {
  fetchAdminTechnologies,
  createAdminTechnology,
  updateAdminTechnology,
  deleteAdminTechnology,
} from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CATEGORIES = [
  'Frontend',
  'Backend',
  'Mobile',
  'Database',
  'DevOps & Cloud',
  'AI & Machine Learning',
  'Tools & Architecture',
];

const ManageTechnologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    icon: '',
    proficiency: 95,
    display_order: 0,
  });
  const [saving, setSaving] = useState(false);

  const loadTechnologies = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminTechnologies();
      setTechnologies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load technologies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechnologies();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: activeTab !== 'All' ? activeTab : 'Frontend',
      icon: '',
      proficiency: 90,
      display_order: technologies.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (tech) => {
    setEditingId(tech.id);
    setFormData({
      name: tech.name || '',
      category: tech.category || 'Frontend',
      icon: tech.icon || '',
      proficiency: tech.proficiency || 90,
      display_order: tech.display_order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: formData.name,
      category: formData.category,
      icon: formData.icon || null,
      proficiency: parseInt(formData.proficiency, 10) || 90,
      display_order: parseInt(formData.display_order, 10) || 0,
    };

    try {
      if (editingId) {
        await updateAdminTechnology(editingId, payload);
        setSuccess(`Technology "${formData.name}" updated.`);
      } else {
        await createAdminTechnology(payload);
        setSuccess(`Technology "${formData.name}" added.`);
      }
      setModalOpen(false);
      loadTechnologies();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save technology.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" from technology stack?`)) return;
    try {
      await deleteAdminTechnology(id);
      setSuccess(`Technology "${name}" deleted.`);
      loadTechnologies();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete technology.');
    }
  };

  const filteredTech = activeTab === 'All'
    ? technologies
    : technologies.filter((t) => t.category === activeTab);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Technologies & Frameworks
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage the technology stack badges displayed on the homepage and about page.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <PlusCircle size={16} />
          <span>Add Technology</span>
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: '1px solid',
              borderColor: activeTab === cat ? 'var(--primary)' : 'var(--border)',
              backgroundColor: activeTab === cat ? 'var(--primary)' : '#FFFFFF',
              color: activeTab === cat ? '#FFFFFF' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading technology stack..." />
      ) : filteredTech.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <Cpu size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Technologies Listed</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Click "Add Technology" to configure your stack.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            Add Technology
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Technology Name</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Proficiency</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Order</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTech.map((tech) => (
                <tr key={tech.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                    {tech.name}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg)', padding: '0.2rem 0.55rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      {tech.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, maxWidth: '100px', height: '6px', backgroundColor: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${tech.proficiency || 90}%`, height: '100%', backgroundColor: 'var(--primary)' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tech.proficiency || 90}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600 }}>
                    {tech.display_order}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openEditModal(tech)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.3rem 0.6rem' }}
                        title="Edit Technology"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(tech.id, tech.name)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.3rem 0.6rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                        title="Delete Technology"
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

      {/* Modal */}
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
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingId ? 'Edit Technology' : 'Add New Technology'}
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
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Technology Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="e.g. Next.js, Python, PostgreSQL"
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className="form-control"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="form-label">Proficiency (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.proficiency}
                    onChange={(e) => setFormData((p) => ({ ...p, proficiency: e.target.value }))}
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData((p) => ({ ...p, display_order: e.target.value }))}
                    className="form-control"
                  />
                </div>
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
                  <span>{saving ? 'Saving...' : 'Save Technology'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTechnologies;

