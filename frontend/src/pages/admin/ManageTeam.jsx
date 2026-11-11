import React, { useState, useEffect } from 'react';
import {
  Users,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Save,
  Linkedin,
  Github,
} from 'lucide-react';
import {
  fetchAdminTeam,
  createAdminTeamMember,
  updateAdminTeamMember,
  deleteAdminTeamMember,
  uploadTeamPhotoFile,
} from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { normalizeImageUrl } from '../../utils/imageUrl';

const ManageTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photo_url: '',
    linkedin_url: '',
    github_url: '',
    twitter_url: '',
    display_order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const loadTeam = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminTeam();
      setTeam(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: '',
      bio: '',
      photo_url: '',
      linkedin_url: '',
      github_url: '',
      twitter_url: '',
      display_order: team.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingId(member.id);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      photo_url: member.photo_url || '',
      linkedin_url: member.linkedin_url || '',
      github_url: member.github_url || '',
      twitter_url: member.twitter_url || '',
      display_order: member.display_order || 0,
    });
    setModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError('');
    try {
      const res = await uploadTeamPhotoFile(file);
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, photo_url: res.url }));
        setSuccess('Team member photo uploaded.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Photo upload failed.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: formData.name,
      role: formData.role,
      bio: formData.bio || null,
      photo_url: formData.photo_url || null,
      linkedin_url: formData.linkedin_url || null,
      github_url: formData.github_url || null,
      twitter_url: formData.twitter_url || null,
      display_order: parseInt(formData.display_order, 10) || 0,
    };

    try {
      if (editingId) {
        await updateAdminTeamMember(editingId, payload);
        setSuccess('Team member updated.');
      } else {
        await createAdminTeamMember(payload);
        setSuccess('Team member added.');
      }
      setModalOpen(false);
      loadTeam();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save team member.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" from team?`)) return;
    try {
      await deleteAdminTeamMember(id);
      setSuccess(`Team member "${name}" deleted.`);
      loadTeam();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete team member.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Engineering Team & Leadership
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Manage the founders, technical architects, and engineers displayed on the company about page.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <PlusCircle size={16} />
          <span>Add Team Member</span>
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
        <LoadingSpinner text="Loading team members..." />
      ) : team.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <Users size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Team Members Listed</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Click "Add Team Member" to showcase your engineers and leadership.
          </p>
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            Add Member
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)', width: '60px' }}>Photo</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Name & Designation</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Bio</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Socials</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => {
                const photo = normalizeImageUrl(member.photo_url);
                return (
                  <tr key={member.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {photo ? (
                          <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{member.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{member.role}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem', color: 'var(--text-secondary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.bio || '—'}
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        {member.linkedin_url && <Linkedin size={15} />}
                        {member.github_url && <Github size={15} />}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(member)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.3rem 0.6rem' }}
                          title="Edit Member"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id, member.name)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.3rem 0.6rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                          title="Delete Member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                {editingId ? 'Edit Team Member' : 'Add Team Member'}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="e.g. Sarah Jenkins"
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label">Role / Title *</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                    required
                    placeholder="e.g. Principal Architect"
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Bio / Background</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  placeholder="Senior software engineer specializing in distributed cloud backends..."
                  className="form-control"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Photo Upload or Image URL</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={formData.photo_url}
                    onChange={(e) => setFormData((p) => ({ ...p, photo_url: e.target.value }))}
                    placeholder="https://... or upload photo"
                    className="form-control"
                  />
                  <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Upload size={14} />
                    <span>{uploadingPhoto ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhoto}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="form-label">LinkedIn URL</label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData((p) => ({ ...p, linkedin_url: e.target.value }))}
                    placeholder="https://linkedin.com/in/..."
                    className="form-control"
                  />
                </div>
                <div>
                  <label className="form-label">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData((p) => ({ ...p, github_url: e.target.value }))}
                    placeholder="https://github.com/..."
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
                  <span>{saving ? 'Saving...' : 'Save Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeam;

