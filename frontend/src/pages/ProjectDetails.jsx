import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Building2,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Code2,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchProjectDetail } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUrl';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchProjectDetail(id);
        setProject(data);
        setActiveImageIndex(0);
      } catch (err) {
        setError(err.message || 'Project not found.');
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '6rem 0' }}>
        <LoadingSpinner text="Loading case study..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Project Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {error || 'The requested project case study does not exist or has been archived.'}
        </p>
        <Link to="/projects" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} />
          <span>Back to All Projects</span>
        </Link>
      </div>
    );
  }

  // Aggregate images: thumbnail + screenshots gallery
  const allImages = [];
  if (project.thumbnail_url) {
    allImages.push({
      image_url: project.thumbnail_url,
      caption: 'Main Showcase',
    });
  }
  if (Array.isArray(project.images)) {
    project.images.forEach((img) => {
      if (img.image_url && img.image_url !== project.thumbnail_url) {
        allImages.push(img);
      }
    });
  }

  const currentImage = allImages[activeImageIndex] || allImages[0];
  const activeImageUrl = currentImage ? normalizeImageUrl(currentImage.image_url) : null;

  return (
    <div>
      {/* Top Breadcrumb & Hero */}
      <section style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '2.5rem 0 3.5rem' }}>
        <div className="container">
          <Link
            to="/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              marginBottom: '1.5rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Projects</span>
          </Link>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span
              style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {project.category}
            </span>
            {project.status && (
              <span
                style={{
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                }}
              >
                {project.status}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            {project.title}
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '850px', marginBottom: '2rem' }}>
            {project.short_description || project.description}
          </p>

          {/* Quick Meta Strip */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            {project.client_name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={18} style={{ color: 'var(--primary)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Client</div>
                  <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text)' }}>{project.client_name}</div>
                </div>
              </div>
            )}

            {project.completion_date && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} style={{ color: 'var(--primary)' }} />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Delivered</div>
                  <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text)' }}>{project.completion_date}</div>
                </div>
              </div>
            )}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>Visit Live App</span>
                  <ExternalLink size={14} />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Github size={14} />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: 'clamp(3rem, 6vw, 4.5rem) 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 340px)',
              gap: '3rem',
            }}
          >
            {/* Left Column: Gallery & Story */}
            <div>
              {/* Main Screenshot Viewer */}
              {activeImageUrl && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <div
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                      boxShadow: 'var(--shadow-md)',
                      backgroundColor: '#1E1435',
                      maxHeight: '520px',
                    }}
                  >
                    <img
                      src={activeImageUrl}
                      alt={currentImage?.caption || project.title}
                      style={{ width: '100%', height: 'auto', maxHeight: '520px', objectFit: 'contain', display: 'block' }}
                    />
                  </div>

                  {currentImage?.caption && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center', fontStyle: 'italic' }}>
                      {currentImage.caption}
                    </div>
                  )}

                  {/* Thumbnail gallery strip */}
                  {allImages.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                      {allImages.map((img, idx) => {
                        const thumb = normalizeImageUrl(img.image_url);
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            style={{
                              width: '90px',
                              height: '60px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: activeImageIndex === idx ? '2px solid var(--primary)' : '1px solid var(--border)',
                              padding: 0,
                              cursor: 'pointer',
                              flexShrink: 0,
                              opacity: activeImageIndex === idx ? 1 : 0.65,
                              transition: 'opacity 0.15s ease, border-color 0.15s ease',
                            }}
                          >
                            <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Overview / Narrative */}
              <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
                  Project Overview & Problem Statement
                </h2>
                <div style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {project.description}
                </div>
              </div>

              {/* Key Features */}
              {Array.isArray(project.features) && project.features.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1.25rem' }}>
                    Key Features & Technical Capabilities
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {project.features.map((feat, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '1.25rem',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <CheckCircle2 size={18} style={{ color: 'var(--primary)', marginTop: '0.15rem', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)', lineHeight: 1.5 }}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: Tech Stack & CTA Card */}
            <div>
              {/* Tech Stack Widget */}
              <div
                className="card"
                style={{
                  padding: '2rem',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  marginBottom: '2rem',
                }}
              >
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1.25rem' }}>
                  Technologies Used
                </h3>
                {Array.isArray(project.technologies) && project.technologies.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          padding: '0.35rem 0.75rem',
                          backgroundColor: 'var(--bg)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Custom modern stack.</p>
                )}
              </div>

              {/* Inquiry Sidebar Card */}
              <div
                className="card"
                style={{
                  padding: '2rem',
                  backgroundColor: 'var(--bg-inverse)',
                  color: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #23193D',
                  textAlign: 'center',
                }}
              >
                <Sparkles size={32} style={{ color: '#C084FC', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  Need a Similar Solution?
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  We can design, develop, and deploy a tailored platform for your organization with guaranteed milestones.
                </p>
                <Link
                  to={`/contact?project_ref=${encodeURIComponent(project.title)}`}
                  className="btn btn-primary btn-block"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <span>Request a Proposal</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;

