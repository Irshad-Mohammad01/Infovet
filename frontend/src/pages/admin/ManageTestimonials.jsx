import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Star,
  X,
  Save,
} from 'lucide-react';
import {
  fetchAdminTestimonials,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
} from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_role: '',
    client_company: '',
    rating: 5,
    testimonial: '',
    avatar_url: '',
    display_order: 0,
  });
  const [saving, setSaving] = useState(false);

  const loadTestimonials = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminTestimonials();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load client testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      client_name: '',
      client_role: '',
      client_company: '',
      rating: 5,
      testimonial: '',
      avatar_url: '',
      display_order: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (test) => {
    setEditingId(test.id);
    setFormData({
      client_name: test.client_name || '',
      client_role: test.client_role || '',
      client_company: test.client_company || '',
      rating: test.rating || 5,
      testimonial: test.testimonial || '',
      avatar_url: test.avatar_url || '',
      display_order: test.display_order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      client_name: formData.client_name,
      client_role: formData.client_role || null,
      client_company: formData.client_company || null,
      rating: parseInt(formData.rating, 10) || 5,
      testimonial: formData.testimonial,
      avatar_url: formData.avatar_url || null,
      display_order: parseInt(formData.display_order, 10) || 0,
    };

    try {
      if (editingId) {
        await updateAdminTestimonial(editingId, payload);
        setSuccess('Testimonial updated successfully.');
      } else {
        await createAdminTestimonial(payload);
        setSuccess('Testimonial added successfully.');
      }
      setModalOpen(false);
      loadTestimonials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    try {
      await deleteAdminTestimonial(id);
      setSuccess('Testimonial deleted.');
      loadTestimonials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete testimonial.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Client Testimonials & Reviews
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage client quotes, ratings, and endorsements featured on the homepage.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <PlusCircle size={16} />
          <span>Add Testimonial</span>
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
        <LoadingSpinner text="Loading testimonials..." />
      ) : testimonials.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <MessageSquare size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Testimonials Listed</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Click "Add Testimonial" to publish client feedback.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            Add Testimonial
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Client</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Company & Role</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Rating</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Quote Snippet</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((test) => (
                <tr key={test.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: 'var(--text)' }}>
                    {test.client_name}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                    {test.client_role} {test.client_company ? `• ${test.client_company}` : ''}
                  </td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'inline-flex', gap: '0.15rem', color: '#F59E0B' }}>
                      {[...Array(test.rating || 5)].map((_, i) => (
                        <Star key={i} size={14} fill="#F59E0B" />
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    "{test.testimonial}"
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => openEditModal(test)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.3rem 0.6rem' }}
                        title="Edit Testimonial"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id, test.client_name)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.3rem 0.6rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                        title="Delete Testimonial"
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
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
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
                <label className="form-label">Client Name *</label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData((p) => ({ ...p, client_name: e.target.value }))}
                  required
                  placeholder="e.g. Alex Henderson"
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Role / Title</label>
                  <input
                    type="text"
                    value={formData.client_role}
                    onChange={(e) => setFormData((p) => ({ ...p, client_role: e.target.value }))}
                    placeholder="e.g. CTO, Product Lead"
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    value={formData.client_company}
                    onChange={(e) => setFormData((p) => ({ ...p, client_company: e.target.value }))}
                    placeholder="e.g. ScaleTech Labs"
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Rating (1 to 5 Stars)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData((p) => ({ ...p, rating: e.target.value }))}
                    className="form-control"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Stars</option>
                    ))}
                  </select>
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Testimonial Quote *</label>
                <textarea
                  value={formData.testimonial}
                  onChange={(e) => setFormData((p) => ({ ...p, testimonial: e.target.value }))}
                  rows={4}
                  required
                  placeholder="INFOVET transformed our backend systems with exceptional architectural precision..."
                  className="form-control"
                />
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
                  <span>{saving ? 'Saving...' : 'Save Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;

