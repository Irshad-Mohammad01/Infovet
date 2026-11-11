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
import { submitProjectInquiry, sendContactMessage } from '../services/api';

const PROJECT_TYPES = [
  'Custom Web Application',
  'Mobile App (iOS / Android)',
  'SaaS Platform Development',
  'E-Commerce Solution',
  'Cloud Architecture & DevOps',
  'AI Integration & Automation',
  'UI/UX Design & Prototyping',
  'System Modernization / Refactoring',
  'Other / Technical Consulting',
];

const BUDGET_RANGES = [
  'Under $5,000',
  '$5,000 - $15,000',
  '$15,000 - $30,000',
  '$30,000 - $50,000',
  '$50,000+',
  'Flexible / Need Advice',
];

const TIMELINES = [
  'Immediate (Under 2 weeks)',
  'Within 1 month',
  '1 to 3 months',
  '3 to 6 months',
  'Flexible timeline',
];

const Contact = () => {
  const { branding } = useBranding();
  const [searchParams] = useSearchParams();
  const preService = searchParams.get('service') || '';
  const preProjectRef = searchParams.get('project_ref') || '';

  const [formType, setFormType] = useState('project'); // 'project' | 'general'
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Project Inquiry form state
  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
    phone: '',
    company: '',
    project_type: preService ? `Custom ${preService}` : 'Custom Web Application',
    budget_range: '$5,000 - $15,000',
    timeline: 'Within 1 month',
    description: preProjectRef ? `Hi, I am interested in building a solution similar to your "${preProjectRef}" project. Here are our requirements: ` : '',
  });

  // General message form state
  const [generalData, setGeneralData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const supportEmail = branding?.support_email || 'contact@infovet.in';
  const contactPhone = branding?.contact_phone || '+91 98765 43210';

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      if (formType === 'project') {
        await submitProjectInquiry(formData);
      } else {
        await sendContactMessage(generalData);
      }
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
            Let's Collaborate
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
            Start Your Project with <span style={{ color: 'var(--primary)' }}>INFOVET</span>
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              marginTop: '1.25rem',
              lineHeight: 1.65,
            }}
          >
            Tell us about your digital product requirements, architecture vision, or timeline. We deliver clear technical roadmaps and actionable proposals within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Form + Info Section */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 5rem) 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(300px, 1fr)',
              gap: '3.5rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Form Column */}
            <div
              className="card"
              style={{
                padding: 'clamp(2rem, 4vw, 3rem)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {/* Type Switcher */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', padding: '0.35rem', backgroundColor: 'var(--bg)', borderRadius: '12px' }}>
                <button
                  type="button"
                  onClick={() => { setFormType('project'); setStatus('idle'); }}
                  style={{
                    flex: 1,
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    backgroundColor: formType === 'project' ? '#FFFFFF' : 'transparent',
                    color: formType === 'project' ? 'var(--primary)' : 'var(--text-secondary)',
                    boxShadow: formType === 'project' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Request a Project Quote
                </button>
                <button
                  type="button"
                  onClick={() => { setFormType('general'); setStatus('idle'); }}
                  style={{
                    flex: 1,
                    padding: '0.65rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    backgroundColor: formType === 'general' ? '#FFFFFF' : 'transparent',
                    color: formType === 'general' ? 'var(--primary)' : 'var(--text-secondary)',
                    boxShadow: formType === 'general' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  General Inquiry
                </button>
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
                    Thank you for reaching out to INFOVET. A technical project lead has been assigned to review your requirements and will respond within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setFormData({
                        client_name: '',
                        email: '',
                        phone: '',
                        company: '',
                        project_type: 'Custom Web Application',
                        budget_range: '$5,000 - $15,000',
                        timeline: 'Within 1 month',
                        description: '',
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

                  {formType === 'project' ? (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        <div>
                          <label className="form-label">Full Name *</label>
                          <input
                            type="text"
                            name="client_name"
                            value={formData.client_name}
                            onChange={handleProjectChange}
                            required
                            placeholder="John Doe"
                            className="form-control"
                          />
                        </div>
                        <div>
                          <label className="form-label">Work Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleProjectChange}
                            required
                            placeholder="john@company.com"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        <div>
                          <label className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleProjectChange}
                            placeholder="+1 (555) 000-0000"
                            className="form-control"
                          />
                        </div>
                        <div>
                          <label className="form-label">Company / Organization</label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleProjectChange}
                            placeholder="Acme Corp"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        <div>
                          <label className="form-label">Project Type</label>
                          <select
                            name="project_type"
                            value={formData.project_type}
                            onChange={handleProjectChange}
                            className="form-control"
                          >
                            {PROJECT_TYPES.map((pt) => (
                              <option key={pt} value={pt}>{pt}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Estimated Budget</label>
                          <select
                            name="budget_range"
                            value={formData.budget_range}
                            onChange={handleProjectChange}
                            className="form-control"
                          >
                            {BUDGET_RANGES.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Timeline</label>
                          <select
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleProjectChange}
                            className="form-control"
                          >
                            {TIMELINES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div style={{ marginBottom: '1.75rem' }}>
                        <label className="form-label">Project Scope & Requirements *</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleProjectChange}
                          required
                          rows={5}
                          placeholder="Please describe your core product requirements, target audience, any existing tech stack or links..."
                          className="form-control"
                          style={{ resize: 'vertical' }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                        <div>
                          <label className="form-label">Your Name *</label>
                          <input
                            type="text"
                            name="name"
                            value={generalData.name}
                            onChange={handleGeneralChange}
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
                            value={generalData.email}
                            onChange={handleGeneralChange}
                            required
                            placeholder="john@example.com"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label">Subject *</label>
                        <input
                          type="text"
                          name="subject"
                          value={generalData.subject}
                          onChange={handleGeneralChange}
                          required
                          placeholder="Question about services or partnerships"
                          className="form-control"
                        />
                      </div>

                      <div style={{ marginBottom: '1.75rem' }}>
                        <label className="form-label">Your Message *</label>
                        <textarea
                          name="message"
                          value={generalData.message}
                          onChange={handleGeneralChange}
                          required
                          rows={5}
                          placeholder="How can our team help you?"
                          className="form-control"
                          style={{ resize: 'vertical' }}
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="btn btn-primary btn-block btn-lg"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Send size={18} />
                    <span>{status === 'submitting' ? 'Submitting Details...' : (formType === 'project' ? 'Submit Project Requirements' : 'Send Message')}</span>
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                    We respect your privacy. Non-disclosure agreements (NDAs) available upon request.
                  </p>
                </form>
              )}
            </div>

            {/* Coordinates & Reassurance Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div
                className="card"
                style={{
                  padding: '2rem',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  backgroundColor: 'var(--bg)',
                }}
              >
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
              <div
                className="card"
                style={{
                  padding: '2rem',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                }}
              >
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
