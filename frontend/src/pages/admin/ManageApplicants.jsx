import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Briefcase,
  Mail,
  Phone,
  CheckCircle,
} from 'lucide-react';
import {
  fetchAdminApplicants,
  fetchAdminJobs,
  updateAdminApplicationStatus,
} from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ApplicationStatusBadge from '../../components/jobs/ApplicationStatusBadge';
import ApplicantDetailModal from './ApplicantDetailModal';

const ManageApplicants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get('job_id') || '';
  const initialAppId = searchParams.get('id') || '';

  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  // Modal inspection
  const [activeApplicant, setActiveApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadJobsList = async () => {
    try {
      const data = await fetchAdminJobs({ size: 100 });
      setJobs(data.items || []);
    } catch (err) {
      console.error('Failed to load jobs list for filter:', err);
    }
  };

  const loadApplicants = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminApplicants({
        job_id: selectedJobId || undefined,
        status_filter: statusFilter || undefined,
        q: search || undefined,
      });
      setApplicants(data || []);

      // If initialAppId provided in URL, open modal automatically
      if (initialAppId && data) {
        const found = data.find((a) => a.id === parseInt(initialAppId, 10));
        if (found) {
          setActiveApplicant(found);
          setIsModalOpen(true);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve applicants.');
    } finally {
      setLoading(false);
    }
  }, [selectedJobId, statusFilter, search, initialAppId]);

  useEffect(() => {
    loadJobsList();
  }, []);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadApplicants();
  };

  const handleQuickStatusChange = async (appId, newStatus) => {
    try {
      const updated = await updateAdminApplicationStatus(appId, { status: newStatus });
      setApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: updated.status } : a))
      );
    } catch (err) {
      setError(err.message || 'Failed to update candidate status.');
    }
  };

  const openApplicantModal = (app) => {
    setActiveApplicant(app);
    setIsModalOpen(true);
  };

  const handleApplicantUpdated = (updated) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
    );
    setActiveApplicant(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Candidate Applicants</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Review candidate qualifications, inspect resumes, and manage recruitment pipeline status ({applicants.length} candidates)
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '0.5rem' }}>
          {error}
        </div>
      )}

      {/* Filter Toolbar */}
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
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px', maxWidth: '380px' }}
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search candidate name or email..."
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

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          {/* Job select */}
          <select
            className="form-select"
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              setSearchParams(e.target.value ? { job_id: e.target.value } : {});
            }}
            style={{ width: 'auto', minWidth: '180px', height: '40px' }}
          >
            <option value="">All Job Listings</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.company_name})
              </option>
            ))}
          </select>

          {/* Status select */}
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '150px', height: '40px' }}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem 0' }}>
            <LoadingSpinner text="Loading applicants..." />
          </div>
        ) : applicants.length === 0 ? (
          <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
            <Users size={36} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>No applicants found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {search || selectedJobId || statusFilter
                ? 'Try resetting the filters or searching with different terms.'
                : 'Applicants will appear here once candidates submit applications.'}
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
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Candidate</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Applied Position</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Applied Date</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Pipeline Stage</th>
                  <th style={{ padding: '0.875rem 1rem', fontWeight: 600 }}>Resume</th>
                  <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      fontSize: '0.875rem',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {app.full_name}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
                        {app.email}
                      </div>
                      {app.phone && (
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                          {app.phone}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <div style={{ fontWeight: 600 }}>
                        {app.job?.title || 'Unknown Position'}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                        {app.job?.company_name || 'Infovate'}
                      </div>
                    </td>

                    <td style={{ padding: '1rem 1rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      {app.applied_at
                        ? new Date(app.applied_at).toLocaleDateString()
                        : '—'}
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      <select
                        className="form-select"
                        value={app.status}
                        onChange={(e) => handleQuickStatusChange(app.id, e.target.value)}
                        style={{
                          fontSize: '0.8125rem',
                          height: '32px',
                          padding: '0.2rem 1.75rem 0.2rem 0.6rem',
                          width: 'auto',
                          fontWeight: 600,
                          backgroundColor:
                            app.status === 'accepted'
                              ? 'rgba(22, 163, 74, 0.08)'
                              : app.status === 'rejected'
                              ? 'rgba(220, 38, 38, 0.08)'
                              : app.status === 'shortlisted'
                              ? 'rgba(96, 37, 197, 0.08)'
                              : '#fff',
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    <td style={{ padding: '1rem 1rem' }}>
                      {app.resume_url ? (
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline btn-xs"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          title="Download or open candidate resume"
                        >
                          <Download size={13} /> Resume
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>None</span>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => openApplicantModal(app)}
                        className="btn btn-primary btn-xs"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Eye size={13} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / Evaluation Modal */}
      <ApplicantDetailModal
        application={activeApplicant}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveApplicant(null);
        }}
        onUpdated={handleApplicantUpdated}
      />
    </div>
  );
};

export default ManageApplicants;

