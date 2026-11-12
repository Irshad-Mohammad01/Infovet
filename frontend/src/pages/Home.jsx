import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Database,
  Cloud,
  BarChart3,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  Users,
  ChevronRight,
} from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import { useBranding } from '../context/BrandingContext';
import { fetchCompanyProfile } from '../services/api';

const DATA_ENGINEERING_CAPABILITIES = [
  {
    id: 'etl-pipelines',
    title: 'Data Engineering & ETL Pipelines',
    icon: Database,
    description:
      'Design, build, and optimize high-throughput batch and real-time streaming ETL/ELT pipelines for reliable data flow.',
    features: [
      'Design and development of scalable ETL/ELT pipelines.',
      'Data integration, transformation, and workflow automation.',
    ],
  },
  {
    id: 'big-data-cloud',
    title: 'Big Data & Cloud Data Platforms',
    icon: Cloud,
    description:
      'Architect robust, elastic cloud data infrastructures and distributed processing frameworks tailored for large-scale enterprise datasets.',
    features: [
      'Big data processing using modern data technologies.',
      'Cloud-based data infrastructure and scalable data pipelines.',
    ],
  },
  {
    id: 'data-warehousing-bi',
    title: 'Data Warehousing & Business Intelligence',
    icon: BarChart3,
    description:
      'Implement enterprise-grade data warehouses, optimized dimensional models, and automated reporting systems for strategic analytics.',
    features: [
      'Data warehouse design and implementation.',
      'Data analytics, reporting, and BI solutions.',
    ],
  },
];

const Home = () => {
  const { branding } = useBranding();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const prof = await fetchCompanyProfile();
        if (prof) setProfile(prof);
      } catch (err) {
        console.error('Failed to load company home data:', err);
      }
    };

    loadHomeData();
  }, []);

  const companyName = profile?.name || branding?.platform_name || 'INFOVATE';
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
              'INFOVATE is a modern software development startup. We design, architect, and ship high-performance web platforms, mobile apps, SaaS ecosystems, and automated cloud backends.'}
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
            <Link
              to="/contact"
              className="btn btn-primary btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>Start Your Project</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-secondary btn-lg">
              About Our Company
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

      {/* Data Engineering Capabilities Section */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <SectionHeading
            eyebrow="What We Do"
            title="Our Data Engineering Capabilities"
            description="We architect enterprise data platforms, scalable ETL/ELT pipelines, and modern cloud data warehouses that turn complex data streams into reliable, actionable business intelligence."
          />

          <div className="capabilities-3col-grid">
            {DATA_ENGINEERING_CAPABILITIES.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="card"
                  style={{
                    padding: '2.25rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    backgroundColor: '#FFFFFF',
                    height: '100%',
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

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                      {service.title}
                    </h3>

                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {service.description}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                      {service.features.map((feat, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.5 }}>
                          <CheckCircle2 size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', marginTop: '1rem' }}>
                    <Link
                      to={`/contact?service=${encodeURIComponent(service.title)}`}
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
                      <span>Request a Quote for This</span>
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Engineering Principles / The INFOVATE Standard */}
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
              The INFOVATE Standard
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
            Tell us about your project requirements, scope, or timeline. Our technical team will review your specifications and provide a tailored estimate within 24 hours.
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
              to="/about"
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
              About Our Company
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
