import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Building2,
  Award,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { useBranding } from '../context/BrandingContext';

const About = () => {
  const { branding } = useBranding();
  const platformName = branding?.platform_name || 'Career Portal';
  const values = [
    {
      icon: ShieldCheck,
      title: 'Verified Employers Only',
      desc: 'We screen and verify employer listings so job seekers can apply with total confidence, free from spam or outdated roles.',
    },
    {
      icon: TrendingUp,
      title: 'Career Advancement',
      desc: 'Connecting ambitious professionals with opportunities across technology, finance, business development, and design.',
    },
    {
      icon: Users,
      title: 'Human-First Hiring',
      desc: 'Transparent application tracking and timely status updates so candidates never wonder where they stand in the hiring process.',
    },
    {
      icon: Globe,
      title: 'Global & Remote Reach',
      desc: 'Enabling companies worldwide to discover high-impact talent across local hubs and remote borders.',
    },
  ];

  return (
    <div>
      {/* Hero Header */}
      <section className="section" style={{ paddingTop: '4rem', paddingBottom: '3rem', backgroundColor: '#fff', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <span className="eyebrow">About {platformName}</span>
          <h1 className="page-title" style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            Empowering Careers, <span className="gradient-text">Connecting Leaders</span>
          </h1>
          <p className="page-subtitle" style={{ fontSize: '1.125rem', lineHeight: 1.6, margin: '0 auto' }}>
            {platformName} is a next-generation professional career portal engineered to bridge high-performing talent with high-growth companies. We streamline every step of the talent acquisition journey.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="eyebrow">Our Mission</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0 1.25rem 0' }}>
                Reinventing the Job Search Experience
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
                Traditional job boards are crowded, outdated, and lack responsiveness. Candidates spend hours tailoring applications only to receive automated silence.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {platformName} was founded with a singular purpose: to bring transparency, speed, and precision back to hiring. With direct application tracking, salary clarity, and verified listings, we make career mobility accessible to everyone.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Real-time application status alerts</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Transparent compensation ranges</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>One-click profile and resume applications</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Award size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Built for Growth</h3>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Trusted by developers, designers, and business leaders
                  </span>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9375rem' }}>
                Whether you are taking the next leap as an engineer, stepping into executive leadership, or recruiting the founding engineers for your startup, {platformName} gives you the tools to succeed.
              </p>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <Link to="/jobs" className="btn btn-primary btn-block">
                  Explore Opportunities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="section" style={{ backgroundColor: '#fff', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span className="eyebrow">Our Values</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>
              What Drives Our Platform
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              Our core commitments to candidates and hiring teams
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="card" style={{ padding: '2rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary-subtle)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {v.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div
            className="card"
            style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              borderRadius: '16px',
            }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}>
              Ready to Advance Your Professional Career?
            </h2>
            <p style={{ maxWidth: '580px', margin: '0 auto 2rem auto', opacity: 0.9, fontSize: '1rem', lineHeight: 1.6 }}>
              Join thousands of skilled professionals discovering new career milestones with {platformName} every day.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/register"
                className="btn"
                style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 700 }}
              >
                Create Free Candidate Account
              </Link>
              <Link
                to="/jobs"
                className="btn btn-outline"
                style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}
              >
                Browse Job Listings <ArrowRight size={16} style={{ marginLeft: '0.4rem' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
