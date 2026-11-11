import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import Logo from '../ui/Logo';
import { useBranding } from '../../context/BrandingContext';

const Footer = () => {
  const { branding } = useBranding();
  const platformName = branding?.platform_name || 'INFOVET';
  const tagline = branding?.tagline || 'Software Development & IT Solutions';
  const supportEmail = branding?.support_email || 'contact@infovet.in';
  const contactPhone = branding?.contact_phone || '+91 98765 43210';

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        {/* Brand Column */}
        <div className="footer-brand">
          <Logo size={32} withWordmark />
          <p style={{ marginTop: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '340px' }}>
            We engineer enterprise-grade web applications, mobile apps, and scalable digital solutions tailored to modern business visions.
          </p>

          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {supportEmail && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <a href={`mailto:${supportEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {supportEmail}
                </a>
              </div>
            )}
            {contactPhone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>{contactPhone}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>Bangalore & Hyderabad, India</span>
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="footer-col-title">Quick Navigation</h4>
          <ul className="footer-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Start a Conversation Column */}
        <div>
          <h4 className="footer-col-title">Start a Project</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            Have a product vision or engineering challenge? Tell us about your goals and receive a technical proposal within 24 hours.
          </p>
          <Link
            to="/contact"
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>Discuss Your Project</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {platformName} Technologies. All rights reserved.</p>
        <p>{tagline}</p>
      </div>
    </footer>
  );
};

export default Footer;
