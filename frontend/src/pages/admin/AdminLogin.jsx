import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBranding } from '../../context/BrandingContext';
import Logo from '../../components/ui/Logo';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin, isAuthenticated, isAdmin } = useAuth();
  const { branding } = useBranding();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/admin/dashboard';

  // If already logged in as admin, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const targetEmail = email.trim();
    if (!targetEmail || !password) {
      setError('Please enter both administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      await adminLogin(targetEmail, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials or unauthorized role.');
    } finally {
      setLoading(false);
    }
  };

  const platformName = branding?.platform_name || 'Platform';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg)',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} /> Back to {platformName}
          </Link>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <Logo size={42} withWordmark />
            </div>
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: 'rgba(96, 37, 197, 0.08)',
                  color: 'var(--primary)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                <ShieldCheck size={14} /> Admin Access Only
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Management Portal
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Sign in with your authorized administrator credentials
            </p>
          </div>

          {error && (
            <div
              className="alert alert-error"
              style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field" style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="admin-email" className="form-label">
                Administrator Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="admin@yourcompany.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)',
                  }}
                />
              </div>
            </div>

            <div className="form-field" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="admin-password" className="form-label">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: 0,
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ height: '44px', fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>

          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              textAlign: 'center',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
            }}
          >
            Are you a job seeker?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Candidate Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
