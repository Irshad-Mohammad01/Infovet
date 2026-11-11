import React from 'react';
import { Clock, HelpCircle, Mail, MapPin, MessageSquare, Phone, ShieldCheck } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { useBranding } from '../context/BrandingContext';

const Contact = () => {
  const { branding } = useBranding();
  const supportEmail = branding?.support_email || 'support@infovet.io';
  const contactPhone = branding?.contact_phone;
  return (
    <div className="section" style={{ paddingTop: '3rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="eyebrow">Get in Touch</span>
          <h1 className="page-title">
            We are here to <span className="gradient-text">help you succeed</span>
          </h1>
          <p className="page-subtitle" style={{ margin: '0.5rem auto 0 auto' }}>
            Have questions about posting a job, partner inquiries, or technical support? Send us a message and our support team will respond promptly.
          </p>
        </div>

        {/* Form + Info Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '2.5rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Contact Form */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Send Us a Message</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Fill in your details below and we will get back to you within 24 hours.
            </p>
            <ContactForm />
          </div>

          {/* Contact Information & Help */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="category-icon-wrapper" style={{ width: '42px', height: '42px' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.0625rem' }}>Email Inquiries</h3>
                  <a href={`mailto:${supportEmail}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9375rem' }}>
                    {supportEmail}
                  </a>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                For enterprise partnerships, custom recruiter packages, or candidate account support.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="category-icon-wrapper" style={{ width: '42px', height: '42px' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.0625rem' }}>Support Hours</h3>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Monday – Friday, 9:00 AM – 6:00 PM IST
                  </span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Our team monitors urgent system inquiries 24/7.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="category-icon-wrapper" style={{ width: '42px', height: '42px' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.0625rem' }}>Employer Verification</h3>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Verified recruitment pipeline</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Looking to post verified job listings for your company? Access our recruiter portal to list roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
