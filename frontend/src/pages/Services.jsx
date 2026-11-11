import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Smartphone,
  Cloud,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SectionHeading from '../components/ui/SectionHeading';
import { fetchServices } from '../services/api';

const SERVICE_ICONS = {
  Code2,
  Smartphone,
  Cloud,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices();
        if (Array.isArray(data)) setServices(data);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

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
            Capabilities & Solutions
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
            End-to-End Software Engineering &{' '}
            <span style={{ color: 'var(--primary)' }}>Digital Transformation</span>
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              marginTop: '1.25rem',
              lineHeight: 1.65,
            }}
          >
            We build secure, high-throughput software systems tailored to solve complex business problems, modernize legacy infrastructure, and delight end users.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section style={{ padding: 'clamp(4rem, 7vw, 6rem) 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          {loading ? (
            <LoadingSpinner text="Loading engineering services..." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
              {services.map((service, index) => {
                const IconComponent = SERVICE_ICONS[service.icon] || Code2;
                const isEven = index % 2 === 1;

                return (
                  <div
                    key={service.id}
                    id={service.slug}
                    className="card"
                    style={{
                      padding: 'clamp(2rem, 4vw, 3rem)',
                      border: '1px solid var(--border)',
                      borderRadius: '20px',
                      backgroundColor: '#FFFFFF',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2.5rem',
                        alignItems: 'center',
                      }}
                    >
                      {/* Left: Service description & icon */}
                      <div>
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                          }}
                        >
                          <IconComponent size={28} />
                        </div>

                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
                          {service.title}
                        </h2>

                        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                          {service.description || service.short_description}
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <Link
                            to={`/contact?service=${encodeURIComponent(service.title)}`}
                            className="btn btn-primary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                          >
                            <span>Inquire About This Service</span>
                            <ArrowRight size={15} />
                          </Link>
                          <Link to="/projects" className="btn btn-secondary btn-sm">
                            View Case Studies
                          </Link>
                        </div>
                      </div>

                      {/* Right: Deliverables, Features & Technologies */}
                      <div
                        style={{
                          backgroundColor: 'var(--bg)',
                          padding: '2rem',
                          borderRadius: '16px',
                          border: '1px solid var(--border)',
                        }}
                      >
                        {Array.isArray(service.features) && service.features.length > 0 && (
                          <div style={{ marginBottom: '1.75rem' }}>
                            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                              What We Deliver
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                              {service.features.map((feat, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                                  <CheckCircle2 size={16} style={{ color: 'var(--primary)', marginTop: '0.2rem', flexShrink: 0 }} />
                                  <span style={{ fontSize: '0.925rem', color: 'var(--text)', fontWeight: 500 }}>{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {Array.isArray(service.technologies) && service.technologies.length > 0 && (
                          <div>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                              Stack & Tools
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                              {service.technologies.map((tech, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    padding: '0.25rem 0.65rem',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid var(--border)',
                                    borderRadius: '6px',
                                    color: 'var(--text)',
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
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

      {/* Engagement Models */}
      <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', backgroundColor: 'var(--bg)' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Flexible Partnership"
            title="Engagement Models Designed for Growth"
            description="Whether you need a full turnkey product build, dedicated engineering extension, or specialized technical consulting."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginTop: '3.5rem',
            }}
          >
            <div className="card" style={{ padding: '2.5rem', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Turnkey Delivery
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
                Fixed-Price Projects
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Ideal for well-defined MVPs, web portals, mobile apps, or system redesigns with fixed scope, clear milestones, and guaranteed delivery dates.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--primary)' }} /> Milestone-based payments
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--primary)' }} /> Comprehensive requirements document
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--primary)' }} /> Post-launch warranty & QA
                </li>
              </ul>
            </div>

            <div className="card" style={{ padding: '2.5rem', border: '2px solid var(--primary)', borderRadius: '16px', position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '24px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.75rem',
                  borderRadius: '999px',
                }}
              >
                Most Popular
              </span>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Team Extension
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
                Dedicated Squads
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Full-time senior software engineers, tech leads, and QA specialists who integrate directly into your daily standups and Git repositories.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--primary)' }} /> 100% dedicated talent
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--primary)' }} /> Seamless time-zone overlap
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--primary)' }} /> Flexible month-to-month contracts
                </li>
              </ul>
            </div>

            <div className="card" style={{ padding: '2.5rem', border: '1px solid var(--border)', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Advisory & Audits
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
                Technical Consulting
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                High-level architecture design, code security audits, cloud cost optimization, and database refactoring conducted by senior principal architects.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--primary)' }} /> In-depth vulnerability report
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--primary)' }} /> AWS / Cloud cost reduction plan
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={15} style={{ color: 'var(--primary)' }} /> Technology stack recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
            Have a Specific Technical Challenge?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Schedule an intro call with an INFOVET solutions architect to discuss feasibility, technology choices, and budget estimates.
          </p>
          <Link to="/contact" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Request a Detailed Quote</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;

