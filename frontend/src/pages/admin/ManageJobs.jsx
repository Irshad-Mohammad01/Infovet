import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { fetchAdminJobs, toggleAdminJobStatus, deleteAdminJob } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionError, setActionError] = useState('');

  // Delete modal state
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setActionError('');
    try {
      const data = await fetchAdminJobs({
        q: search || undefined,
        status_filter: statusFilter === 'all' ? undefined : statusFilter,
        page,
        size: 10,
      });
      setJobs(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      setActionError(err.message || 'Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadJobs();
  };

  const handleToggleStatus = async (jobId) => {
    try {
      const updated = await toggleAdminJobStatus(jobId);
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, is_active: updated.is_active } : j))
      );
    } catch (err) {
      setActionError(err.message || 'Failed to update job status.');
    }
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    setDeleting(true);
    try {
      await deleteAdminJob(jobToDelete.id);
      setJobToDelete(null);
      loadJobs();
    } catch (err) {
      setActionError(err.message || 'Failed to delete job.');
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Job Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Manage, publish, edit, or archive job postings across the portal ({total} total)
          </p>
        </div>

        <Link
          to="/admin/jobs/new"
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <PlusCircle size={18} />
          <span>Post New Job</span>
        </Link>
      </div>

      {actionError && (
        <div className="alert alert-error" style={{ marginBottom: '0.5rem' }}>
          {actionError}
        </div>
      )}

      {/* Filters Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px', maxWidth: '420px' }}
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by title, company, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem', height: '40px' }}
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
              }}
            />
          </div>
          <button type="submit" className="btn btn-outline btn-sm" style={{ height: '40px' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <Filter size={16} /> Filter Status:
          </div>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{ width: 'auto', minWidth: '130px', height: '40px' }}
          >
            <option value="all">All Jobs</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive / Draft</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem 0' }}>
            <LoadingSpinner text="Retrieving jobs..." />
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <Briefcase size={36} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>No job listings found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {search ? 'Try adjusting your search criteria.' : 'Create your first job listing to get started.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8F7FC', borderBottom: '1px solid var(--border-color)', fontSize: '0.8125rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Title & Company</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Type & Location</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Applications</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Posted Date</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      fontSize: '0.875rem',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        <Link to={`/jobs/${job.id}`} target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>
                          {job.title}
                        </Link>
                        {job.is_featured && (
                          <span className="badge badge-warning" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>
                            Featured
                          </span>
                        )}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
                        {job.company}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <span className="badge badge-neutral">
                        {job.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <div>{job.job_type}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        {job.location} {job.is_remote && '(Remote)'}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <Link
                        to={`/admin/applicants?job_id=${job.id}`}
                        style={{
                          fontWeight: 600,
                          color: 'var(--primary)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        {job.applications_count ?? 0} applicants
                      </Link>
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <button
                        onClick={() => handleToggleStatus(job.id)}
                        className={`badge ${job.is_active ? 'badge-success' : 'badge-neutral'}`}
                        style={{
                          cursor: 'pointer',
                          border: 'none',
                          padding: '0.35rem 0.65rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                        title="Click to toggle status"
                      >
                        {job.is_active ? (
                          <>
                            <CheckCircle size={13} /> Active
                          </>
                        ) : (
                          <>
                            <XCircle size={13} /> Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td style={{ padding: '1rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      {job.created_at ? new Date(job.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link
                          to={`/jobs/${job.id}`}
                          target="_blank"
                          className="btn btn-outline btn-xs"
                          title="View on portal"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <Link
                          to={`/admin/jobs/${job.id}/edit`}
                          className="btn btn-outline btn-xs"
                          title="Edit job listing"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => setJobToDelete(job)}
                          className="btn btn-outline btn-xs"
                          style={{ color: 'var(--danger)', borderColor: 'rgba(220, 38, 38, 0.3)' }}
                          title="Delete job listing"
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

        {/* Pagination Bar */}
        {pages > 1 && (
          <div
            style={{
              padding: '0.875rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: '#FAFAFC',
            }}
          >
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Page {page} of {pages} ({total} listings)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-outline btn-xs"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="btn btn-outline btn-xs"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Job Listing"
        message={`Are you sure you want to delete "${jobToDelete?.title}" at ${jobToDelete?.company}? This will also delete any associated job applications.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Job'}
        confirmVariant="danger"
      />
    </div>
  );
};

export default ManageJobs;

