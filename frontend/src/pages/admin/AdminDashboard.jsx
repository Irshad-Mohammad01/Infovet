import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Layers,
  Inbox,
  AlertCircle,
  Cpu,
  MessageSquare,
  Users,
  PlusCircle,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { fetchCompanyAdminStats } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STATUS_COLORS = {
  New: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  Contacted: { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  'In Discussion': { bg: '#F3E8FF', text: '#9333EA', border: '#E9D5FF' },
  'Proposal Sent': { bg: '#E0E7FF', text: '#4F46E5', border: '#C7D2FE' },
  Converted: { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' },
  Closed: { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCompanyAdminStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load executive statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading executive metrics..." />;
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
      label: 'Total Projects',
      value: stats?.total_projects ?? 0,
      icon: FolderGit2,
      color: '#6025C5',
      bg: 'rgba(96, 37, 197, 0.08)',
      link: '/admin/projects',
      sub: `${stats?.featured_projects ?? 0} featured on homepage`,
    },
    {
      label: 'Services Offered',
      value: stats?.total_services ?? 0,
      icon: Layers,
      color: '#0284C7',
      bg: 'rgba(2, 132, 199, 0.08)',
      link: '/admin/services',
      sub: 'Active business capabilities',
    },
    {
      label: 'Technologies Stack',
      value: stats?.total_technologies ?? 0,
      icon: Cpu,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.08)',
      link: '/admin/technologies',
      sub: 'Languages, frameworks & clouds',
    },
    {
      label: 'Client Reviews',
      value: stats?.total_testimonials ?? 0,
      icon: MessageSquare,
      color: '#9333EA',
      bg: 'rgba(147, 51, 234, 0.08)',
      link: '/admin/testimonials',
      sub: 'Verified client feedback',
    },
    {
      label: 'Engineering Team',
      value: stats?.total_team_members ?? 0,
      icon: Users,
      color: '#0D9488',
      bg: 'rgba(13, 148, 136, 0.08)',
      link: '/admin/team',
      sub: 'Architects & leaders',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Executive Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Real-time analytics and management for INFOVATE Software Solutions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/projects/new" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <PlusCircle size={15} />
            <span>Add New Project</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {metricCards.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Link
              key={idx}
              to={m.link}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                className="card"
                style={{
                  padding: '1.5rem',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {m.label}
                  </span>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: m.bg,
                      color: m.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    {m.sub}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Projects Panel */}
      <div style={{ marginTop: '1rem' }}>
        <div className="card" style={{ padding: '1.75rem', border: '1px solid var(--border)', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)' }}>
              Projects Overview
            </h2>
            <Link to="/admin/projects" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>Manage Projects</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {!stats?.recent_projects || stats.recent_projects.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
              No projects added yet. Click "Add New Project" to create your first portfolio case study.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {stats.recent_projects.slice(0, 5).map((proj) => (
                <div
                  key={proj.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>
                      {proj.title}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {proj.category} • Client: {proj.client_name || 'Internal'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {proj.is_featured && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                        }}
                      >
                        Featured
                      </span>
                    )}
                    <Link
                      to={`/admin/projects/${proj.id}/edit`}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
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
