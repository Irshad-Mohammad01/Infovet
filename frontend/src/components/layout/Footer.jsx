import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import Logo from '../ui/Logo';
import { useBranding } from '../../context/BrandingContext';

const Footer = () => {
  const { branding } = useBranding();
  const platformName = branding?.platform_name || 'Job Portal';
  const tagline = branding?.tagline || 'A Professional Career Platform';
  const supportEmail = branding?.support_email;
  const contactPhone = branding?.contact_phone;

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo size={32} withWordmark />
          <p style={{ marginTop: '0.75rem' }}>
            {tagline}. Connecting talented professionals with verified organizations worldwide.
          </p>

          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {supportEmail && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: 'var(--primary)' }} />
                <a href={`mailto:${supportEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {supportEmail}
                </a>
              </div>
            )}
            {contactPhone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: 'var(--primary)' }} />
                <span>{contactPhone}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="footer-col-title">For Candidates</h4>
          <ul className="footer-list">
            <li>
              <Link to="/jobs">Browse All Jobs</Link>
            </li>
            <li>
              <Link to="/jobs?workplace_type=Remote">Remote Positions</Link>
            </li>
            <li>
              <Link to="/saved-jobs">Saved Jobs</Link>
            </li>
            <li>
              <Link to="/my-applications">Application Tracker</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title">Explore Careers</h4>
          <ul className="footer-list">
            <li>
              <Link to="/jobs">Featured Opportunities</Link>
            </li>
            <li>
              <Link to="/jobs">Browse by Category</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Get in Touch</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title">Platform Access</h4>
          <ul className="footer-list">
            <li>
              <Link to="/login">Candidate Sign In</Link>
            </li>
            <li>
              <Link to="/register">Create Free Account</Link>
            </li>
            <li>
              <Link to="/admin/login">Management Console</Link>
            </li>
            <li>
              <Link to="/contact">Support & Help</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {platformName}. All rights reserved.</p>
        <p>{tagline}</p>
      </div>
    </footer>
  );
};

export default Footer;
