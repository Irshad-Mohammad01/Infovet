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
        <div className="footer-brand">
          <Logo size={32} withWordmark />
          <p style={{ marginTop: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '340px' }}>
            We engineer enterprise-grade web applications, mobile apps, and scalable digital solutions tailored to your business vision.
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

        <div>
          <h4 className="footer-col-title">Our Services</h4>
          <ul className="footer-list">
            <li>
              <Link to="/services">Custom Software Development</Link>
            </li>
            <li>
              <Link to="/services">Web Application Engineering</Link>
            </li>
            <li>
              <Link to="/services">Mobile App Development</Link>
            </li>
            <li>
              <Link to="/services">Cloud & DevOps Solutions</Link>
            </li>
            <li>
              <Link to="/services">AI & Automation</Link>
            </li>
            <li>
              <Link to="/services">UI/UX & Product Design</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title">Company</h4>
          <ul className="footer-list">
            <li>
              <Link to="/about">About INFOVET</Link>
            </li>
            <li>
              <Link to="/projects">Featured Projects</Link>
            </li>
            <li>
              <Link to="/about#team">Engineering Team</Link>
            </li>
            <li>
              <Link to="/contact">Get a Free Quote</Link>
            </li>
            <li>
              <Link to="/contact">Contact & Support</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title">Portals & Links</h4>
          <ul className="footer-list">
            <li>
              <Link to="/contact">Start a Project</Link>
            </li>
            <li>
              <Link to="/login">Client Portal</Link>
            </li>
            <li>
              <Link to="/admin/login">Admin Console</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy & Security</Link>
            </li>
          </ul>
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
