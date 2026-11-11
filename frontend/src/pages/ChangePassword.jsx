import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, Key, Lock } from 'lucide-react';
import { changePassword } from '../services/api';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh', paddingTop: '2rem' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to="/profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> Back to Profile
          </Link>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="category-icon-wrapper" style={{ width: '42px', height: '42px' }}>
              <Key size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Change Password</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                Ensure your account is using a strong password.
              </p>
            </div>
          </div>

          {error && (
            <div className="form-notice form-notice-error" role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="form-notice form-notice-success" role="status">
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="cur-pwd">Current Password *</label>
              <div className="input-icon-wrapper">
                <Lock size={16} />
                <input
                  type="password"
                  id="cur-pwd"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="new-pwd">New Password *</label>
              <div className="input-icon-wrapper">
                <Lock size={16} />
                <input
                  type="password"
                  id="new-pwd"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="conf-pwd">Confirm New Password *</label>
              <div className="input-icon-wrapper">
                <Lock size={16} />
                <input
                  type="password"
                  id="conf-pwd"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
              <Link to="/profile" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

