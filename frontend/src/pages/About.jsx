import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Users,
  Target,
  Eye,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  Linkedin,
  Github,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SectionHeading from '../components/ui/SectionHeading';
import { useBranding } from '../context/BrandingContext';
import { fetchCompanyProfile, fetchTeamMembers } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUrl';

const About = () => {
  const { branding } = useBranding();
  const [profile, setProfile] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const [profRes, teamRes] = await Promise.allSettled([
          fetchCompanyProfile(),
          fetchTeamMembers(),
        ]);

        if (profRes.status === 'fulfilled' && profRes.value) setProfile(profRes.value);
        if (teamRes.status === 'fulfilled' && Array.isArray(teamRes.value)) setTeam(teamRes.value);
      } catch (err) {
        console.error('Failed to load about data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  const companyName = profile?.name || branding?.platform_name || 'INFOVATE';
  const tagline = profile?.tagline || branding?.tagline || 'Software Development & IT Solutions';

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
            About Our Company
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
            Engineering Digital Excellence with{' '}
            <span style={{ color: 'var(--primary)' }}>Integrity & Passion</span>
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              marginTop: '1.25rem',
              lineHeight: 1.65,
            }}
          >
            {profile?.description ||
              `${companyName} is an agile IT solutions and custom software engineering company. We partner with ambitious founders, startups, and mid-market enterprises to design, develop, and deploy scalable digital products.`}
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
            }}
          >
            <div
              className="card"
              style={{
                padding: '2.5rem',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                backgroundColor: 'var(--bg)',
              }}
            >
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
                  marginBottom: '1.5rem',
                }}
              >
                <Target size={28} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.85rem' }}>
                Our Mission
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {profile?.mission ||
                  'To empower modern businesses with robust, accessible, and high-performance digital software that accelerates operational efficiency, improves customer experience, and unlocks scalable commercial growth.'}
              </p>
            </div>

            <div
              className="card"
              style={{
                padding: '2.5rem',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                backgroundColor: 'var(--bg)',
              }}
            >
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
                  marginBottom: '1.5rem',
                }}
              >
                <Eye size={28} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.85rem' }}>
                Our Vision
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {profile?.vision ||
                  'To become the world’s most trusted technical engineering partner for digital innovation, recognized for our architectural craftsmanship, honest communication, and unwavering commitment to client success.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Lifecycle / Process */}
      <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', backgroundColor: 'var(--bg)' }}>
        <div className="container">
          <SectionHeading
            eyebrow="How We Deliver"
            title="Our Engineering Process"
            description="A disciplined, transparent delivery framework designed to minimize risk, eliminate delays, and ship production-ready software."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.75rem',
              marginTop: '3.5rem',
            }}
          >
            {[
              {
                step: '01',
                title: 'Discovery & Architecture',
                desc: 'We analyze your business goals, user personas, database requirements, and technical constraints to map out a clear architecture roadmap.',
              },
              {
                step: '02',
                title: 'UI/UX Interactive Design',
                desc: 'We craft intuitive user journeys, wireframes, and high-fidelity interactive prototypes in Figma for fast review and feedback.',
              },
              {
                step: '03',
                title: 'Iterative Sprint Development',
                desc: 'Our engineers build clean, modular frontend and backend code in 1-2 week sprints with live demo environments and progress updates.',
              },
              {
                step: '04',
                title: 'Automated QA & Security',
                desc: 'Rigorous end-to-end testing, integration tests, performance benchmarking, and vulnerability audits before shipping.',
              },
              {
                step: '05',
                title: 'Cloud Launch & CI/CD',
                desc: 'Seamless zero-downtime deployment on AWS, Render, Vercel, or Docker containers with automated observability.',
              },
              {
                step: '06',
                title: 'Support & Scaling',
                desc: 'Continuous post-launch SLA monitoring, regular updates, feature expansions, and infrastructure scaling as your users grow.',
              },
            ].map((p, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '2rem',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: 'rgba(96, 37, 197, 0.12)',
                    lineHeight: 1,
                    marginBottom: '0.75rem',
                  }}
                >
                  {p.step}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Showcase */}
      <section id="team" style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <SectionHeading
            eyebrow="Leadership & Engineers"
            title="Meet Our Engineering Team"
            description="The architects, full-stack developers, and designers building the next generation of digital products."
          />

          {loading ? (
            <LoadingSpinner text="Loading team members..." />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '2rem',
                marginTop: '3.5rem',
              }}
            >
              {team.map((member) => {
                const photoUrl = normalizeImageUrl(member.photo_url);
                return (
                  <div
                    key={member.id}
                    className="card"
                    style={{
                      overflow: 'hidden',
                      textAlign: 'center',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ height: '240px', backgroundColor: 'var(--bg-subtle)', position: 'relative', overflow: 'hidden' }}>
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={member.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            fontSize: '3rem',
                            fontWeight: 800,
                          }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
                          {member.name}
                        </h3>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                          {member.role}
                        </div>
                        {member.bio && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                            {member.bio}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}
                            aria-label={`${member.name} LinkedIn`}
                          >
                            <Linkedin size={18} />
                          </a>
                        )}
                        {member.github_url && (
                          <a
                            href={member.github_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}
                            aria-label={`${member.name} GitHub`}
                          >
                            <Github size={18} />
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
      <section
        style={{
          padding: '4rem 0',
          backgroundColor: 'var(--bg)',
          borderTop: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem' }}>
            Work With Our Senior Engineers
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Whether you need a dedicated development team, technical architecture consulting, or custom software built from scratch, we are ready to assist.
          </p>
          <Link to="/contact" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Schedule a Consultation</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
