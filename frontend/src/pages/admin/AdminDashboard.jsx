import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle,
  FolderTree,
  PlusCircle,
  Eye,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';
import { fetchAdminStats } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ApplicationStatusBadge from '../../components/jobs/ApplicationStatusBadge';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load administrative analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading dashboard metrics..." />;
  }

  if (error) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
        <button onClick={loadStats} className="btn btn-outline btn-sm">
          Try Again
        </button>
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Total Jobs',
      value: stats?.total_jobs ?? 0,
      icon: Briefcase,
      color: '#6025C5',
      bg: 'rgba(96, 37, 197, 0.08)',
      link: '/admin/jobs',
    },
    {
      label: 'Active Listings',
      value: stats?.active_jobs ?? 0,
      icon: CheckCircle,
      color: '#16A34A',
      bg: 'rgba(22, 163, 74, 0.08)',
      link: '/admin/jobs',
    },
    {
      label: 'Total Applicants',
      value: stats?.total_applications ?? 0,
      icon: Users,
      color: '#2563EB',
      bg: 'rgba(37, 99, 235, 0.08)',
      link: '/admin/applicants',
    },
    {
      label: 'Registered Users',
      value: stats?.total_users ?? 0,
      icon: TrendingUp,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.08)',
      link: '/admin/users',
    },
    {
      label: 'Job Categories',
      value: stats?.total_categories ?? 0,
      icon: FolderTree,
      color: '#0D9488',
      bg: 'rgba(13, 148, 136, 0.08)',
      link: '/admin/categories',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Portal Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Real-time activity and health metrics across the Infovet ecosystem
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            to="/admin/jobs/new"
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <PlusCircle size={16} /> Post New Job
          </Link>
          <Link
            to="/admin/applicants"
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Users size={16} /> View All Applicants
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.label}
              to={m.link}
              className="card"
              style={{
                padding: '1.5rem',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                  {m.value}
                </div>
              </div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: m.bg,
                  color: m.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={24} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Lists Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Recent Applicants */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
                Recent Applications
              </h2>
            </div>
            <Link
              to="/admin/applicants"
              style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {!stats?.recent_applications || stats.recent_applications.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
              No candidates have applied yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.recent_applications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#FAFAFC',
                    gap: '1rem',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.full_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {app.job?.title || 'Job Listing'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ApplicationStatusBadge status={app.status} />
                    <Link
                      to={`/admin/applicants?id=${app.id}`}
                      className="btn btn-outline btn-xs"
                      title="Inspect Application"
                    >
                      <Eye size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Job Listings */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={18} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
                Recent Job Listings
              </h2>
            </div>
            <Link
              to="/admin/jobs"
              style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {!stats?.recent_jobs || stats.recent_jobs.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
              No jobs posted yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.recent_jobs.map((job) => (
                <div
                  key={job.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#FAFAFC',
                    gap: '1rem',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {job.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {job.company} • {job.location}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge ${job.is_active ? 'badge-success' : 'badge-neutral'}`}>
                      {job.is_active ? 'Active' : 'Draft'}
                    </span>
                    <Link
                      to={`/admin/jobs/${job.id}/edit`}
                      className="btn btn-outline btn-xs"
                      title="Edit Job"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

