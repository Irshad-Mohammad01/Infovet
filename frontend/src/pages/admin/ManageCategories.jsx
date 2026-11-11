import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  X,
  AlertCircle,
  Layers,
} from 'lucide-react';
import {
  fetchAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const EMPTY_CAT = {
  name: '',
  slug: '',
  description: '',
  icon: 'Briefcase',
  is_active: true,
  display_order: 0,
};

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_CAT);
  const [saving, setSaving] = useState(false);

  // Delete state
  const [catToDelete, setCatToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(EMPTY_CAT);
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      icon: cat.icon || 'Briefcase',
      is_active: cat.is_active !== undefined ? cat.is_active : true,
      display_order: cat.display_order || 0,
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        display_order: parseInt(formData.display_order, 10) || 0,
      };

      if (editingId) {
        await updateAdminCategory(editingId, payload);
      } else {
        await createAdminCategory(payload);
      }

      setIsFormOpen(false);
      loadCategories();
    } catch (err) {
      setFormError(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!catToDelete) return;
    setDeleting(true);
    try {
      await deleteAdminCategory(catToDelete.id);
      setCatToDelete(null);
      loadCategories();
    } catch (err) {
      setError(err.message || 'Failed to delete category.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Category Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Organize job listings into intuitive functional sectors for candidates ({categories.length} total)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '0.5rem' }}>
          {error}
        </div>
      )}

      {/* Categories Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem 0' }}>
            <LoadingSpinner text="Retrieving categories..." />
          </div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <FolderTree size={36} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>No categories configured</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Add job categories to help candidates explore opportunities.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: '#F8F7FC',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Category Name</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Slug</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Icon</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Order</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      fontSize: '0.875rem',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {cat.name}
                      </div>
                      {cat.description && (
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
                          {cat.description}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      {cat.slug}
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <span className="badge badge-neutral">{cat.icon || 'Briefcase'}</span>
                    </td>
                    <td style={{ padding: '1rem 1rem', color: 'var(--text-secondary)' }}>
                      {cat.display_order}
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <span className={`badge ${cat.is_active ? 'badge-success' : 'badge-neutral'}`}>
                        {cat.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(cat)}
                          className="btn btn-outline btn-xs"
                          title="Edit Category"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => setCatToDelete(cat)}
                          className="btn btn-outline btn-xs"
                          style={{ color: 'var(--danger)', borderColor: 'rgba(220, 38, 38, 0.3)' }}
                          title="Delete Category"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isFormOpen && (
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
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                {editingId ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="alert alert-error" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={18} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="cat-name" className="form-label">
                  Category Name *
                </label>
                <input
                  id="cat-name"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Software Engineering"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="cat-slug" className="form-label">
                  Slug (Optional - auto-generated if blank)
                </label>
                <input
                  id="cat-slug"
                  type="text"
                  className="form-input"
                  placeholder="e.g. software-engineering"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div className="form-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="cat-desc" className="form-label">
                  Description
                </label>
                <textarea
                  id="cat-desc"
                  className="form-textarea"
                  rows={2}
                  placeholder="Brief description of roles in this field..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-field">
                  <label htmlFor="cat-icon" className="form-label">
                    Icon Identifier
                  </label>
                  <select
                    id="cat-icon"
                    className="form-select"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  >
                    <option value="Briefcase">Briefcase</option>
                    <option value="Code">Code</option>
                    <option value="Palette">Palette</option>
                    <option value="TrendingUp">TrendingUp</option>
                    <option value="ShieldCheck">ShieldCheck</option>
                    <option value="HeartPulse">HeartPulse</option>
                    <option value="Cpu">Cpu</option>
                    <option value="Layers">Layers</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="cat-order" className="form-label">
                    Display Order
                  </label>
                  <input
                    id="cat-order"
                    type="number"
                    className="form-input"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span>Active (Visible to candidates)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn btn-outline btn-sm"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Save size={14} />
                  <span>{saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!catToDelete}
        onClose={() => setCatToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Job Category"
        message={`Are you sure you want to delete "${catToDelete?.name}"? Jobs under this category will have their category set to Uncategorized.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Category'}
        confirmVariant="danger"
      />
    </div>
  );
};

export default ManageCategories;

