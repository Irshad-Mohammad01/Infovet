import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  ExternalLink,
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  Layers,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SectionHeading from '../components/ui/SectionHeading';
import { fetchProjects } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUrl';

const CATEGORIES = [
  'All',
  'Web Application',
  'Mobile App',
  'SaaS Platform',
  'E-Commerce',
  'Custom Software',
  'AI / Automation',
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await fetchProjects(params);
      if (Array.isArray(data)) setProjects(data);
    } catch (err) {
      console.error('Failed to load portfolio projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProjects();
  };

  return (
    <div>
      {/* Hero Header */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F7FC 100%)',
          paddingTop: 'clamp(3.5rem, 6vw, 5rem)',
          paddingBottom: 'clamp(3rem, 5vw, 4.5rem)',
          borderBottom: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            Work Portfolio & Case Studies
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
            Digital Solutions We Have{' '}
            <span style={{ color: 'var(--primary)' }}>Proudly Engineered</span>
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              marginTop: '1.25rem',
              lineHeight: 1.65,
            }}
          >
            Explore our portfolio of bespoke web applications, cross-platform mobile apps, enterprise cloud tools, and scalable SaaS platforms.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section style={{ padding: '2rem 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Search form */}
            <form onSubmit={handleSearchSubmit} style={{ width: '100%', maxWidth: '540px', display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search projects by name, client, or tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.75rem', borderRadius: '999px', height: '46px', fontSize: '0.925rem' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '999px', padding: '0 1.5rem' }}>
                Search
              </button>
            </form>

            {/* Category pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--bg)',
                    color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 5rem) 0', backgroundColor: 'var(--bg)' }}>
        <div className="container">
          {loading ? (
            <LoadingSpinner text="Loading portfolio deliverables..." />
          ) : projects.length === 0 ? (
            <div className="card" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '550px', margin: '0 auto' }}>
              <Layers size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Projects Found</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                There are no projects matching the selected category or search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="btn btn-secondary btn-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '2rem',
              }}
            >
              {projects.map((project) => {
                const thumbUrl = normalizeImageUrl(project.thumbnail_url);
                return (
                  <div
                    key={project.id}
                    className="card"
                    style={{
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid var(--border)',
                      borderRadius: '16px',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div style={{ height: '220px', backgroundColor: '#E9E5F0', position: 'relative', overflow: 'hidden' }}>
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={project.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                          <Code2 size={42} />
                        </div>
                      )}
                      <span
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          backgroundColor: 'rgba(19, 13, 36, 0.85)',
                          backdropFilter: 'blur(6px)',
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                        }}
                      >
                        {project.category}
                      </span>
                    </div>

                    <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        {project.client_name && (
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                            {project.client_name}
                          </div>
                        )}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
                          <Link to={`/projects/${project.slug || project.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {project.title}
                          </Link>
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                          {project.short_description || (project.description && project.description.slice(0, 130) + '...')}
                        </p>

                        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                            {project.technologies.map((tech, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '0.2rem 0.55rem',
                                  backgroundColor: 'var(--bg)',
                                  border: '1px solid var(--border)',
                                  borderRadius: '6px',
                                  color: 'var(--text-secondary)',
                                  fontWeight: 500,
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                        <Link
                          to={`/projects/${project.slug || project.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--primary)',
                            textDecoration: 'none',
                          }}
                        >
                          <span>Read Case Study</span>
                          <ArrowRight size={15} />
                        </Link>
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.8125rem',
                              color: 'var(--text-muted)',
                              textDecoration: 'none',
                            }}
                          >
                            <span>Live Demo</span>
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
            Ready to Build Your Custom Software?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Bring us your product vision, legacy system modernization, or mobile app concept. We provide free architectural estimates.
          </p>
          <Link to="/contact" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Start a Conversation</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Projects;

