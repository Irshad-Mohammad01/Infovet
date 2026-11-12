import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Layers,
  FolderGit2,
  Cpu,
  MessageSquare,
  Users,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { useBranding } from '../../context/BrandingContext';

/**
 * Dedicated Executive Administration Layout for INFOVATE Software Solutions.
 * Features a distinct dark command sidebar (#130D24) paired with a high-visibility topbar
 * and clean data-table friendly content workspace.
 */
const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { branding } = useBranding();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Company Profile', path: '/admin/company-profile', icon: Building2 },
    { label: 'Services', path: '/admin/services', icon: Layers },
    { label: 'Projects / Portfolio', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Technologies', path: '/admin/technologies', icon: Cpu },
    { label: 'Client Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { label: 'Team Members', path: '/admin/team', icon: Users },
    { label: 'Project Inquiries', path: '/admin/inquiries', icon: Inbox },
    { label: 'Settings & Branding', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Executive Dark Sidebar */}
      <aside
        className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          background: '#130D24',
          borderRight: '1px solid #23193D',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
          flexShrink: 0,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem 1.15rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Logo variant="light" size={28} withWordmark />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.45rem' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#C084FC',
                  backgroundColor: 'rgba(168, 85, 247, 0.16)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <Shield size={10} /> Admin Console
              </span>
            </div>
          </div>
          <button
            className="mobile-close-btn"
            style={{
              display: 'none',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '6px',
              padding: '0.35rem',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '1.25rem 0.85rem', flex: 1, overflowY: 'auto' }}>
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 0.625rem 0.5rem',
            }}
          >
            Management
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      backgroundColor: isActive ? 'var(--primary, #6025C5)' : 'transparent',
                      boxShadow: isActive ? '0 4px 14px rgba(96, 37, 197, 0.4)' : 'none',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease',
                    })}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '1.5rem 0.625rem 0.5rem',
            }}
          >
            Quick Links
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#94A3B8',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#94A3B8';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <ExternalLink size={17} />
                <span>Live Website</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Current Authenticated Admin & Logout */}
        <div
          style={{
            padding: '1rem 1.15rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary, #6025C5)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.875rem',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {user?.full_name || 'Administrator'}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#94A3B8',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {user?.email || 'admin@infovate.in'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: '#F87171',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#EF4444';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.color = '#F87171';
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Command Bar */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(1rem, 2.5vw, 2rem)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="admin-hamburger"
              style={{
                display: 'none',
                background: 'none',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                padding: '0.45rem',
                borderRadius: '6px',
                color: 'var(--text)',
              }}
              aria-label="Toggle navigation"
            >
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)' }}>
                {branding?.platform_name || 'Infovate'} Administration Console
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              className="badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                border: '1px solid #BBF7D0',
                padding: '0.3rem 0.65rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#16A34A',
                  boxShadow: '0 0 0 2px rgba(22, 163, 74, 0.25)',
                }}
              />
              Neon DB Online
            </span>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}
            >
              <span>View Portal</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </header>

        {/* Workspace Content */}
        <main style={{ flex: 1, padding: 'clamp(1.25rem, 2.5vw, 2rem)', overflowX: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
