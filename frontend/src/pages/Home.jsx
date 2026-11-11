import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Code2,
  Smartphone,
  Cloud,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Star,
  Users,
  Award,
  Clock,
  ChevronRight,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SectionHeading from '../components/ui/SectionHeading';
import { useBranding } from '../context/BrandingContext';
import {
  fetchCompanyProfile,
  fetchServices,
  fetchProjects,
  fetchTechnologies,
  fetchTestimonials,
} from '../services/api';
import { normalizeImageUrl } from '../utils/imageUrl';

const SERVICE_ICONS = {
  Code2,
  Smartphone,
  Cloud,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
};

const Home = () => {
  const { branding } = useBranding();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeTechCategory, setActiveTechCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [profRes, servRes, projRes, techRes, testRes] = await Promise.allSettled([
          fetchCompanyProfile(),
          fetchServices(),
          fetchProjects({ featured: true, limit: 6 }),
          fetchTechnologies(),
          fetchTestimonials(),
        ]);

        if (profRes.status === 'fulfilled' && profRes.value) setProfile(profRes.value);
        if (servRes.status === 'fulfilled' && Array.isArray(servRes.value)) setServices(servRes.value);
        if (projRes.status === 'fulfilled' && Array.isArray(projRes.value)) setFeaturedProjects(projRes.value);
        if (techRes.status === 'fulfilled' && Array.isArray(techRes.value)) setTechnologies(techRes.value);
        if (testRes.status === 'fulfilled' && Array.isArray(testRes.value)) setTestimonials(testRes.value);
      } catch (err) {
        console.error('Failed to load company home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const techCategories = ['All', ...new Set(technologies.map((t) => t.category).filter(Boolean))];
  const filteredTech = activeTechCategory === 'All'
    ? technologies
    : technologies.filter((t) => t.category === activeTechCategory);

  const companyName = profile?.name || branding?.platform_name || 'INFOVET';
  const tagline = profile?.tagline || branding?.tagline || 'Software Development & IT Solutions';

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F7FC 100%)',
          paddingTop: 'clamp(3.5rem, 6vw, 5.5rem)',
          paddingBottom: 'clamp(3.5rem, 6vw, 5.5rem)',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            Enterprise Software & Cloud Engineering
          </span>

          <h1
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginTop: '1.25rem',
              color: 'var(--text)',
              maxWidth: '900px',
              marginLeft: 'auto',
              marginRight: 'auto',
              letterSpacing: '-0.02em',
            }}
          >
            We Build Digital Products That{' '}
            <span style={{ color: 'var(--primary)' }}>Move Businesses Forward</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              marginTop: '1.25rem',
              maxWidth: '740px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.6,
            }}
          >
            {profile?.description ||
              'INFOVET is a modern software development consultancy. We design, architect, and ship high-performance web platforms, mobile apps, SaaS ecosystems, and automated cloud backends.'}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              marginTop: '2.5rem',
              flexWrap: 'wrap',
            }}
          >
            <Link to="/contact" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Start Your Project</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/projects" className="btn btn-secondary btn-lg">
              Explore Our Portfolio
            </Link>
          </div>

          {/* Key Metrics Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginTop: '4rem',
              padding: '2rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border)',
            }}
          >
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>99.8%</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontWeight: 500 }}>Client Satisfaction</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>50+</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontWeight: 500 }}>Digital Solutions Shipped</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>100%</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontWeight: 500 }}>Agile Sprint Transparency</div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>24/7</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontWeight: 500 }}>Post-Launch Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Our Engineering Capabilities"
            title="Comprehensive IT & Software Services"
            description="From initial architectural design to deployment and continuous scaling, we cover the full software product lifecycle."
          />

          {loading ? (
            <LoadingSpinner text="Loading services..." />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.75rem',
                marginTop: '3rem',
              }}
            >
              {services.map((service) => {
                const IconComponent = SERVICE_ICONS[service.icon] || Code2;
                return (
                  <div
                    key={service.id}
                    className="card"
                    style={{
                      padding: '2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      border: '1px solid var(--border)',
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
                    <div>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '1.25rem',
                        }}
                      >
                        <IconComponent size={26} />
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
                        {service.title}
                      </h3>

                      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                        {service.short_description || service.description}
                      </p>

                      {Array.isArray(service.features) && service.features.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem' }}>
                          {service.features.slice(0, 4).map((feat, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text)' }}>
                              <CheckCircle2 size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '1rem' }}>
                      <Link
                        to="/contact"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: 'var(--primary)',
                          textDecoration: 'none',
                        }}
                      >
                        <span>Discuss This Service</span>
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/services" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>View All Services & Specializations</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects / Portfolio */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', backgroundColor: 'var(--bg)' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Proven Track Record"
            title="Featured Projects & Case Studies"
            description="Explore our recent engineering deliverables for modern high-growth businesses and enterprises."
          />

          {loading ? (
            <LoadingSpinner text="Loading portfolio..." />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '2rem',
                marginTop: '3rem',
              }}
            >
              {featuredProjects.map((project) => {
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
                    <div style={{ height: '210px', backgroundColor: '#E9E5F0', position: 'relative', overflow: 'hidden' }}>
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
                          <Code2 size={40} />
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
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                          {project.short_description || (project.description && project.description.slice(0, 130) + '...')}
                        </p>

                        {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                            {project.technologies.slice(0, 4).map((tech, idx) => (
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
                          <span>Case Study</span>
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

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/projects" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>View Full Project Archive</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Modern Tools & Frameworks"
            title="Engineered With Modern Technologies"
            description="We leverage battle-tested languages, high-performance web frameworks, and elastic cloud infrastructure."
          />

          {techCategories.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '2.5rem' }}>
              {techCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTechCategory(cat)}
                  style={{
                    padding: '0.45rem 1.15rem',
                    borderRadius: '999px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: activeTechCategory === cat ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: activeTechCategory === cat ? 'var(--primary)' : '#FFFFFF',
                    color: activeTechCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '1.25rem',
              marginTop: '2.5rem',
            }}
          >
            {filteredTech.map((tech) => (
              <div
                key={tech.id}
                style={{
                  padding: '1.25rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                  {tech.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {tech.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Principles / Why Choose Us */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', backgroundColor: 'var(--bg-inverse)', color: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#C084FC',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem',
              }}
            >
              The INFOVET Standard
            </span>
            <h2 style={{ fontSize: 'clamp(1.85rem, 4vw, 2.5rem)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
              Engineering Precision & Business Alignment
            </h2>
            <p style={{ color: '#94A3B8', marginTop: '1rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
              We do not just write code; we architect resilient digital products designed to scale with your user base and revenue.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            <div className="feature-card" style={{ padding: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.65rem' }}>Speed & Agile Velocity</h3>
              <p style={{ color: '#D1C5DF', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Weekly sprints with live staging demo environments. You see real working software each sprint without surprises.
              </p>
            </div>

            <div className="feature-card" style={{ padding: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.65rem' }}>Security & Code Quality</h3>
              <p style={{ color: '#D1C5DF', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Strict linting, automated CI/CD test suites, OWASP security compliance, and comprehensive code reviews.
              </p>
            </div>

            <div className="feature-card" style={{ padding: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Cloud size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.65rem' }}>Elastic Cloud Architecture</h3>
              <p style={{ color: '#D1C5DF', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Containerized microservices and serverless workflows that scale effortlessly under high user loads.
              </p>
            </div>

            <div className="feature-card" style={{ padding: '2rem', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.65rem' }}>Direct Founder Collaboration</h3>
              <p style={{ color: '#D1C5DF', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Direct communication with lead engineers and architects. No bureaucratic layers or delayed replies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <SectionHeading
              eyebrow="Client Success Stories"
              title="What Clients Say About INFOVET"
              description="Real feedback from founders, product managers, and technology leaders we have partnered with."
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2rem',
                marginTop: '3rem',
              }}
            >
              {testimonials.map((test) => (
                <div
                  key={test.id}
                  className="card"
                  style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '0.25rem', color: '#F59E0B', marginBottom: '1rem' }}>
                      {[...Array(test.rating || 5)].map((_, i) => (
                        <Star key={i} size={16} fill="#F59E0B" />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1.5rem' }}>
                      "{test.testimonial}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      {test.client_name ? test.client_name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text)' }}>
                        {test.client_name}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {test.client_role} {test.client_company ? `• ${test.client_company}` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* High Impact Final CTA Banner */}
      <section
        style={{
          padding: 'clamp(4rem, 8vw, 6rem) 0',
          background: 'linear-gradient(135deg, #6025C5 0%, #3B1282 100%)',
          color: '#FFFFFF',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Ready to Build Your Next Digital Product?
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', opacity: 0.9, lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Tell us about your project requirements, scope, or timeline. Our team will review your specs and provide a tailored technical estimate within 24 hours.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/contact"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#6025C5',
                padding: '0.85rem 2rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>Get a Free Project Quote</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/services"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                padding: '0.85rem 1.85rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
