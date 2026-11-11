import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight, ExternalLink, FileText } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ApplicationStatusBadge from '../components/jobs/ApplicationStatusBadge';
import { fetchMyApplications } from '../services/api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications()
      .then((data) => {
        if (Array.isArray(data)) setApplications(data);
      })
      .catch((err) => console.error('Failed to load applications:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Applications</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Track the status and hiring stage of your submitted applications.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching your submitted applications…" height="320px" />
        ) : applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications submitted yet"
            description="Explore our curated job board and submit your application to premier companies today."
            actionText="Browse Open Jobs"
            actionLink="/jobs"
          />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Position & Company</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Attached Resume</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>
                        <Link to={`/jobs/${app.job?.slug || app.job_id}`} style={{ color: 'inherit' }}>
                          {app.job?.title || 'Position'}
                        </Link>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {app.job?.company_name || 'Organization'} • {app.job?.location || 'Remote'}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {new Date(app.applied_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td>
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td>
                      {app.resume_url ? (
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.8125rem' }}
                        >
                          <FileText size={14} /> View File <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/applications/${app.id}`} className="btn btn-secondary btn-sm">
                        Details <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;

