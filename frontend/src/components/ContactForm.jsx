import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';
import { sendContactMessage } from '../services/api';

const EMPTY = { name: '', email: '', subject: '', message: '', website: '' };

/**
 * Dynamic contact form connected to database-stored platform settings.
 */
const ContactForm = () => {
  const { branding } = useBranding();
  const supportEmail = branding?.support_email || 'support@infovet.io';
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'sent' | 'error'
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setError('');

    try {
      await sendContactMessage(values);
      setValues(EMPTY);
      setStatus('sent');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {/* Honeypot field for bot suppression */}
      <div className="honeypot" aria-hidden="true" style={{ display: 'none' }}>
        <label htmlFor="website">Leave this field empty</label>
        <input
          type="text"
          id="website"
          name="website"
          value={values.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="new-password"
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name" className="form-label">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={values.name}
            onChange={handleChange}
            required
            maxLength={120}
            autoComplete="name"
            placeholder="Sarah Jenkins"
          />
        </div>

        <div className="form-field">
          <label htmlFor="email" className="form-label">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={values.email}
            onChange={handleChange}
            required
            maxLength={255}
            autoComplete="email"
            placeholder="sarah@example.com"
          />
        </div>
      </div>

      <div className="form-field" style={{ marginBottom: '1rem' }}>
        <label htmlFor="subject" className="form-label">Subject *</label>
        <input
          type="text"
          id="subject"
          name="subject"
          className="form-input"
          value={values.subject}
          onChange={handleChange}
          required
          maxLength={200}
          placeholder="Inquiry regarding employer partnership or portal support"
        />
      </div>

      <div className="form-field" style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="message" className="form-label">Message *</label>
        <textarea
          id="message"
          name="message"
          className="form-textarea"
          rows={5}
          value={values.message}
          onChange={handleChange}
          required
          maxLength={5000}
          placeholder="Please describe your question, feedback, or inquiry in detail..."
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending Message...' : 'Send Message'}
        {status !== 'sending' && <Send size={16} aria-hidden="true" />}
      </button>

      {status === 'sent' && (
        <div className="alert alert-success" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>Thank you — your message has been received! Our support team will get back to you shortly.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="alert alert-error" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>
            {error || 'Unable to submit message.'} You can also email us directly at{' '}
            <a href={`mailto:${supportEmail}`} style={{ textDecoration: 'underline' }}>{supportEmail}</a>.
          </span>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
