import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, Lock, Mail, Phone, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';
import Logo from '../components/ui/Logo';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const { register } = useAuth();
  const { branding } = useBranding();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!formData.termsAgreed) {
      setError('Please agree to the Infovet Terms of Service and Privacy Policy.');
      return;
    }

    setBusy(true);

    try {
      await register({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password,
      });
      navigate('/jobs', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size={40} withWordmark className="justify-center" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '1.25rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Join {branding?.platform_name || 'our platform'} to explore premier opportunities and track applications.
          </p>
        </div>

        {error && (
          <div className="form-notice form-notice-error" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="reg-name">Full Name</label>
            <div className="input-icon-wrapper">
              <UserIcon size={16} />
              <input
                type="text"
                id="reg-name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                autoComplete="name"
                autoFocus
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="reg-email">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail size={16} />
              <input
                type="email"
                id="reg-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="reg-phone">Phone Number (Optional)</label>
            <div className="input-icon-wrapper">
              <Phone size={16} />
              <input
                type="tel"
                id="reg-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="reg-password">Password</label>
              <div className="input-icon-wrapper">
                <Lock size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 chars"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <div className="input-icon-wrapper">
                <Lock size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-confirm"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="terms-check"
              name="termsAgreed"
              checked={formData.termsAgreed}
              onChange={handleChange}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <label htmlFor="terms-check" style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer' }}>
              I agree to the <Link to="/terms" style={{ color: 'var(--primary)' }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--primary)' }}>Privacy Policy</Link>.
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={busy}
          >
            {busy ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

