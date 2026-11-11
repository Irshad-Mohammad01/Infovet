import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Edit3,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Key,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const userInitial = (user.full_name || user.email || 'U')[0].toUpperCase();

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Header Profile Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 800,
                  }}
                >
                  {userInitial}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{user.full_name}</h1>
                  <span className="badge badge-primary">{user.role}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', marginTop: '0.25rem' }}>
                  {user.headline || 'Professional Candidate'}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    marginTop: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={14} /> {user.email}
                  </span>
                  {user.phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Phone size={14} /> {user.phone}
                    </span>
                  )}
                  {user.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} /> {user.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/profile/edit" className="btn btn-primary btn-sm">
                <Edit3 size={15} /> Edit Profile
              </Link>
              <Link to="/profile/change-password" className="btn btn-secondary btn-sm">
                <Key size={15} /> Change Password
              </Link>
            </div>
          </div>
        </div>

        {/* Bio & Skills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {/* Bio */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>Professional Summary</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9375rem', whiteSpace: 'pre-line' }}>
              {user.bio || 'No summary provided yet. Click "Edit Profile" to tell employers about your background and expertise.'}
            </p>
          </div>

          {/* Skills */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Skills & Competencies</h2>
            {user.skills ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {user.skills.split(',').map((skill, idx) => (
                  <span key={idx} className="badge badge-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8125rem' }}>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No skills listed yet. Add comma-separated skills in your profile settings.
              </p>
            )}
          </div>

          {/* Resume & Links */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Resume & Online Profiles</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Default Resume
                </span>
                {user.resume_url ? (
                  <a
                    href={user.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex' }}
                  >
                    <FileText size={15} /> View Uploaded Resume
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    No resume uploaded yet. You can attach one when applying or in Edit Profile.
                  </p>
                )}
              </div>

              {(user.linkedin_url || user.github_url || user.portfolio_url) && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {user.linkedin_url && (
                    <a
                      href={user.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <Linkedin size={15} /> LinkedIn
                    </a>
                  )}
                  {user.github_url && (
                    <a
                      href={user.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <Github size={15} /> GitHub
                    </a>
                  )}
                  {user.portfolio_url && (
                    <a
                      href={user.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <Globe size={15} /> Portfolio
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

