import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Mail,
  Phone,
  Building2,
  Calendar,
  X,
  Save,
  MessageSquare,
} from 'lucide-react';
import {
  fetchAdminInquiries,
  updateAdminInquiry,
  deleteAdminInquiry,
} from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const INQUIRY_STATUSES = [
  'All',
  'New',
  'Contacted',
  'In Discussion',
  'Proposal Sent',
  'Converted',
  'Closed',
];

const STATUS_COLORS = {
  New: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  Contacted: { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  'In Discussion': { bg: '#F3E8FF', text: '#9333EA', border: '#E9D5FF' },
  'Proposal Sent': { bg: '#E0E7FF', text: '#4F46E5', border: '#C7D2FE' },
  Converted: { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' },
  Closed: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
};

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');

  // Details Modal
  const [activeInquiry, setActiveInquiry] = useState(null);
  const [modalStatus, setModalStatus] = useState('New');
  const [modalNotes, setModalNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (search.trim()) params.search = search.trim();

      const data = await fetchAdminInquiries(params);
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load project inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [selectedStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadInquiries();
  };

  const openDetails = (inq) => {
    setActiveInquiry(inq);
    setModalStatus(inq.status || 'New');
    setModalNotes(inq.admin_notes || '');
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!activeInquiry) return;

    setUpdating(true);
    try {
      const updated = await updateAdminInquiry(activeInquiry.id, {
        status: modalStatus,
        admin_notes: modalNotes,
      });
      setSuccess(`Inquiry #${activeInquiry.id} updated to "${modalStatus}".`);
      setActiveInquiry(null);
      loadInquiries();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update inquiry status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete inquiry from "${name}"?`)) return;
    try {
      await deleteAdminInquiry(id);
      setSuccess('Inquiry deleted.');
      if (activeInquiry?.id === id) setActiveInquiry(null);
      loadInquiries();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete inquiry.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Project Inquiries & Pipeline
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Review incoming software requests, manage client conversations, and track lead conversion.
          </p>
        </div>
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

      {/* Filter and Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '480px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by client, email, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.5rem', height: '38px', fontSize: '0.875rem' }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {INQUIRY_STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedStatus === st ? 'var(--primary)' : 'var(--border)',
                backgroundColor: selectedStatus === st ? 'var(--primary)' : '#FFFFFF',
                color: selectedStatus === st ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading inquiries..." />
      ) : inquiries.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
          <Inbox size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Inquiries Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {selectedStatus !== 'All' ? `There are no inquiries with status "${selectedStatus}".` : 'Inquiries submitted by clients from the contact form will appear here.'}
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Client & Company</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Project Type</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Budget & Timeline</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => {
                const statusStyle = STATUS_COLORS[inq.status] || STATUS_COLORS.New;
                return (
                  <tr key={inq.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{inq.client_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {inq.company ? `${inq.company} • ` : ''}{inq.email}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text)', fontWeight: 500 }}>
                      {inq.project_type || 'Custom Software'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <div>{inq.budget_range || 'Flexible'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inq.timeline || 'Flexible'}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '999px',
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`,
                        }}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openDetails(inq)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.3rem 0.6rem' }}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(inq.id, inq.client_name)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.3rem 0.6rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                          title="Delete Inquiry"
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

      {/* Inquiry Details Modal */}
      {activeInquiry && (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>
                  Inquiry from {activeInquiry.client_name}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Submitted on {new Date(activeInquiry.created_at).toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveInquiry(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Client Coordinates */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Email</div>
                <a href={`mailto:${activeInquiry.email}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <Mail size={14} />
                  <span>{activeInquiry.email}</span>
                </a>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Phone</div>
                <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  {activeInquiry.phone || 'Not provided'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Company</div>
                <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  {activeInquiry.company || 'Not provided'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Type / Budget</div>
                <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  {activeInquiry.project_type} ({activeInquiry.budget_range})
                </div>
              </div>
            </div>

            {/* Scope / Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                Project Requirements & Description:
              </div>
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  color: 'var(--text)',
                  whiteSpace: 'pre-line',
                }}
              >
                {activeInquiry.description}
              </div>
            </div>

            {/* Status & Internal Notes Form */}
            <form onSubmit={handleStatusUpdate} style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label">Pipeline Status</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="form-control"
                  >
                    {INQUIRY_STATUSES.filter((s) => s !== 'All').map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Internal Administrative Notes</label>
                  <input
                    type="text"
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    placeholder="e.g. Intro call held on Tuesday, preparing proposal..."
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <a
                  href={`mailto:${activeInquiry.email}?subject=Regarding Your INFOVET Project Inquiry`}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Mail size={14} />
                  <span>Reply via Email</span>
                </a>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setActiveInquiry(null)}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Save size={14} />
                    <span>{updating ? 'Saving...' : 'Update Inquiry'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInquiries;

