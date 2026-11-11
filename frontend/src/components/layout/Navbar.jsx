import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  Shield,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

/**
 * Public User Portal Navbar.
 * - Fluid full-width container with comfortable edge padding.
 * - Left: INFOVET Logo & Platform Wordmark.
 * - Center: Primary Navigation (Home, Browse Jobs, Contact Us).
 * - Right: Action buttons (Sign In / Create Account) or Authenticated User Menu Dropdown.
 * - Role-based dropdown rendering:
 *   - ADMIN: Admin Portal + Sign Out only.
 *   - CUSTOMER: My Profile + My Applications + Saved Jobs + Sign Out only.
 * - Compact 64px executive height with smooth sticky behavior.
 */
const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleItemClick = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  // Determine admin status strictly from authenticated user state
  const isAdminUser = Boolean(isAdmin || user?.role?.toLowerCase() === 'admin');
  const userInitial = (user?.full_name || user?.email || 'U')[0].toUpperCase();
  const userShortName = user?.full_name ? user.full_name.split(' ')[0] : 'Account';

  return (
    <header className="site-header">
      <div className="header-inner-fluid">
        {/* Left Column: Brand Logo & Wordmark */}
        <div className="header-brand-col">
          <Link to="/" className="header-logo" aria-label="INFOVET Home">
            <Logo size={32} withWordmark />
          </Link>
        </div>

        {/* Center Column: Primary Desktop Navigation */}
        <nav className="header-nav-center" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
          >
            About Us
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
          >
            Services
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
          >
            Our Projects
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
          >
            Contact Us
          </NavLink>
        </nav>

        {/* Right Column: User Profile Dropdown or Actions */}
        <div className="header-actions-col">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/contact" className="btn btn-primary btn-sm" style={{ display: 'none', '@media (min-width: 640px)': { display: 'inline-flex' } }}>
                Get a Quote
              </Link>
              <div className="user-dropdown" ref={dropdownRef}>
                <button
                  type="button"
                  className="user-menu-btn"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-label="User navigation menu"
                >
                  <div className="user-avatar-circle">{userInitial}</div>
                  <span className="user-menu-label">{userShortName}</span>
                  <ChevronDown size={14} className="user-chevron" />
                </button>

                {dropdownOpen && (
                  <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                      <p className="user-menu-name">{user.full_name}</p>
                      <p className="user-menu-email">{user.email}</p>
                      {isAdminUser && (
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            color: 'var(--primary)',
                            backgroundColor: 'var(--primary-light)',
                            padding: '0.1rem 0.5rem',
                            borderRadius: '999px',
                            marginTop: '0.35rem',
                          }}
                        >
                          Administrator
                        </span>
                      )}
                    </div>

                    {isAdminUser ? (
                      /* ADMIN USERS: Admin Portal + Sign Out ONLY */
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="user-menu-item user-menu-admin-link"
                          onClick={handleItemClick}
                        >
                          <Shield size={16} /> Admin Portal
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="user-menu-item user-menu-logout-btn"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </>
                    ) : (
                      /* REGISTERED USERS: My Profile + Sign Out */
                      <>
                        <Link
                          to="/profile"
                          className="user-menu-item"
                          onClick={handleItemClick}
                        >
                          <UserIcon size={16} /> My Profile
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="user-menu-item user-menu-logout-btn"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="header-auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/contact" className="btn btn-primary btn-sm">
                Get a Quote
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/" end className="mobile-nav-link" onClick={handleItemClick}>
            Home
          </NavLink>
          <NavLink to="/about" className="mobile-nav-link" onClick={handleItemClick}>
            About Us
          </NavLink>
          <NavLink to="/services" className="mobile-nav-link" onClick={handleItemClick}>
            Services
          </NavLink>
          <NavLink to="/projects" className="mobile-nav-link" onClick={handleItemClick}>
            Our Projects
          </NavLink>
          <NavLink to="/contact" className="mobile-nav-link" onClick={handleItemClick}>
            Contact Us
          </NavLink>

          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            <Link to="/contact" className="btn btn-primary btn-block" onClick={handleItemClick} style={{ marginBottom: '0.75rem' }}>
              Get a Quote
            </Link>

            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ padding: '0.5rem 0' }}>
                  <p style={{ fontWeight: 700, margin: 0, fontSize: '0.9375rem' }}>{user.full_name}</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>{user.email}</p>
                </div>
                {isAdminUser && (
                  <Link
                    to="/admin/dashboard"
                    className="btn btn-outline btn-block"
                    onClick={handleItemClick}
                  >
                    <Shield size={16} /> Admin Portal
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-danger-outline btn-block"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-secondary btn-block" onClick={handleItemClick}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
