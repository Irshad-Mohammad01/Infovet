import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';

/**
 * Simplified Public Navbar for INFOVATE Software Solutions.
 * - Left: INFOVATE Logo + Brand Name.
 * - Right: Navigation links (Home, About Us, Contact Us).
 * - Clean, modern, responsive full-width layout with comfortable edge padding.
 * - Zero authentication UI (no sign in, register, user dropdown, or admin login).
 */
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleItemClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Extreme Left: Brand Logo & Wordmark */}
        <div className="header-brand-wrap">
          <Link to="/" className="header-logo" aria-label="INFOVATE Home">
            <Logo size={32} withWordmark />
          </Link>
        </div>

        {/* Center / Right: Primary Desktop Navigation */}
        <nav className="header-nav-desktop" aria-label="Main Navigation">
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
            to="/contact"
            className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
          >
            Contact Us
          </NavLink>
        </nav>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Backdrop */}
      {menuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Dropdown Navigation */}
      {menuOpen && (
        <div className="mobile-menu" role="menu">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'is-active' : ''}`}
            onClick={handleItemClick}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'is-active' : ''}`}
            onClick={handleItemClick}
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => `mobile-nav-link ${isActive ? 'is-active' : ''}`}
            onClick={handleItemClick}
          >
            Contact Us
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
