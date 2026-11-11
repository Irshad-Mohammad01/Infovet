import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useBranding } from '../context/BrandingContext';
import { submitProjectInquiry } from '../services/api';

const Contact = () => {
  const { branding } = useBranding();
  const [searchParams] = useSearchParams();
  const preService = searchParams.get('service') || '';
  const preSubject = searchParams.get('subject') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: preSubject || (preService ? `Inquiry regarding ${preService}` : ''),
    message: '',
  });

  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Update subject if URL params change
  useEffect(() => {
    if (preSubject) {
      setFormData((prev) => ({ ...prev, subject: preSubject }));
    } else if (preService) {
      setFormData((prev) => ({ ...prev, subject: `Inquiry regarding ${preService}` }));
    }
  }, [preService, preSubject]);

  const supportEmail = branding?.support_email || 'contact@infovet.in';
  const contactPhone = branding?.contact_phone || '+91 98765 43210';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;

    // Client-side validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMessage('Please provide an inquiry subject.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setErrorMessage('Please provide a message with at least 5 characters.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const payload = {
        full_name: formData.name.trim(),
        client_name: formData.name.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        project_description: formData.message.trim(),
        project_type: formData.subject.trim() || 'General Inquiry',
        inquiry_type: 'general',
      };

      await submitProjectInquiry(payload);
      setStatus('success');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div>
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F7FC 100%)',
          paddingTop: 'clamp(3.5rem, 6vw, 5rem)',
          paddingBottom: 'clamp(3rem, 5vw, 4rem)',
          borderBottom: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            Let's Connect
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginTop: '1rem',
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}
          >
            Contact <span style={{ color: 'var(--primary)' }}>INFOVET</span>
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              marginTop: '1.25rem',
              lineHeight: 1.65,
            }}
          >
            Have a question, need technical guidance, or want to discuss a data engineering engagement? Send us a message and our team will get back to you promptly.
          </p>
        </div>
      </section>

      {/* Main Form + Info Section */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 5rem) 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="contact-layout-grid">
            {/* Form Column */}
            <div className="card contact-form-card">
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
                  General Inquiry
                </h2>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Please fill out the details below. All fields marked with an asterisk (*) are required.
                </p>
              </div>

              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--success-bg)',
                      color: 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
                    Inquiry Received Successfully!
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '450px', margin: '0 auto 2rem' }}>
                    Thank you for reaching out to INFOVET. Our team has received your message and will review your inquiry within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: '',
                        message: '',
                      });
                    }}
                    className="btn btn-primary"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {errorMessage && (
                    <div
                      style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        backgroundColor: 'var(--error-bg)',
                        color: 'var(--error)',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <AlertCircle size={18} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="contact-form-row">
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div>
                      <label className="form-label">
                        Phone Number <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label className="form-label">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Data Pipeline Consultation"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.75rem' }}>
                    <label className="form-label">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="How can our team help you? Provide any details regarding your questions or requirements..."
                      className="form-control"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn btn-primary btn-block btn-lg"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Send size={18} />
                    <span>{status === 'submitting' ? 'Submitting Inquiry...' : 'Submit Inquiry'}</span>
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                    We respect your privacy. Non-disclosure agreements (NDAs) available upon request.
                  </p>
                </form>
              )}
            </div>

            {/* Coordinates & Reassurance Column */}
            <div className="contact-info-col">
              {/* Direct Contact Card */}
              <div className="card contact-info-card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem' }}>
                  Direct Contact
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Inquiries</div>
                      <a href={`mailto:${supportEmail}`} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
                        {supportEmail}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Direct Phone</div>
                      <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem' }}>
                        {contactPhone}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Engineering Centers</div>
                      <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.5 }}>
                        Bangalore & Hyderabad Technology Hubs, India
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="card contact-info-card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>
                  What Happens Next?
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <Zap size={16} style={{ color: 'var(--primary)', marginTop: '0.2rem', flexShrink: 0 }} />
                    <span><strong>1. Discovery Review:</strong> Our senior architect analyzes your scope and tech stack requirements.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <Clock size={16} style={{ color: 'var(--primary)', marginTop: '0.2rem', flexShrink: 0 }} />
                    <span><strong>2. 24-Hour Response:</strong> We schedule a 30-minute intro call or share initial questions.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--primary)', marginTop: '0.2rem', flexShrink: 0 }} />
                    <span><strong>3. Formal Proposal:</strong> Detailed breakdown of sprint milestones, deliverables, and fixed pricing.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
