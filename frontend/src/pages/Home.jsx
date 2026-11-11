import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Bell,
  Briefcase,
  CheckCircle2,
  FileCheck,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import CategoryCard from '../components/jobs/CategoryCard';
import JobCard from '../components/jobs/JobCard';
import JobSearchBar from '../components/jobs/JobSearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SectionHeading from '../components/ui/SectionHeading';
import { useBranding } from '../context/BrandingContext';
import { fetchCategories, fetchFeaturedJobs, fetchJobs } from '../services/api';

const Home = () => {
  const { branding } = useBranding();
  const platformName = branding?.platform_name || 'Career Platform';
  const [categories, setCategories] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catsRes, featuredRes, latestRes] = await Promise.allSettled([
          fetchCategories(),
          fetchFeaturedJobs(4),
          fetchJobs({ page: 1, size: 4, sort: 'newest' }),
        ]);

        if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value)) {
          setCategories(catsRes.value.slice(0, 6));
        }
        if (featuredRes.status === 'fulfilled' && Array.isArray(featuredRes.value)) {
          setFeaturedJobs(featuredRes.value);
        }
        if (latestRes.status === 'fulfilled' && latestRes.value?.items) {
          setLatestJobs(latestRes.value.items);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F7FC 100%)',
          paddingTop: 'clamp(3rem, 6vw, 5rem)',
          paddingBottom: 'clamp(3.5rem, 7vw, 6rem)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="eyebrow">
            <Sparkles size={13} style={{ display: 'inline', marginRight: '0.35rem' }} />
            Premier Career Platform
          </span>

          <h1
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              fontWeight: 800,
              maxWidth: '820px',
              margin: '0.75rem auto 1.25rem auto',
              lineHeight: 1.15,
            }}
          >
            Find Your Next <span className="gradient-text">Opportunity</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '620px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            Discover top-tier roles across Software Engineering, Product Design, AI, Marketing, and Finance.
            Accelerate your career with transparent compensation and verified employers.
          </p>

          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <JobSearchBar />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.75rem',
              marginTop: '2rem',
              flexWrap: 'wrap',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> Verified Opportunities
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> Transparent Salary Ranges
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--success)' }} /> Direct Hiring Pipeline
            </span>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Explore Domains"
            title="Popular Job Categories"
            description="Explore open positions categorized by industry specialization and skill set."
            align="center"
          />

          {loading ? (
            <LoadingSpinner text="Loading categories…" />
          ) : categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '0.875rem' }}>No job categories available right now.</p>
            </div>
          ) : (
            <div className="category-grid">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/jobs" className="btn btn-secondary">
              Browse All Categories
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="section section-white" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="eyebrow">Handpicked Roles</span>
                <h2 className="section-title">Featured Opportunities</h2>
                <p className="section-description">High-priority positions from leading and fast-growing organizations.</p>
              </div>
              <Link to="/jobs" className="btn btn-outline btn-sm">
                View All Jobs <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Jobs */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Fresh Postings"
            title="Latest Job Opportunities"
            description="Recently listed roles ready for applications today."
            align="center"
          />

          {loading ? (
            <LoadingSpinner text="Fetching latest jobs…" />
          ) : latestJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              <Briefcase size={36} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>No jobs available right now</h3>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Check back soon for new opportunities or browse categories.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/jobs" className="btn btn-primary btn-lg">
              Explore All Job Listings
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition / Why Choose Infovet */}
      <section className="section section-white" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <SectionHeading
            eyebrow={`Why ${platformName}`}
            title="Built for the Modern Professional"
            description="We eliminate hiring friction so you can focus on finding roles where you will thrive."
            align="center"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div className="category-icon-wrapper" style={{ marginBottom: '1.25rem' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Verified Employers</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Every job posting is audited for authenticity. Zero ghost jobs, spam listings, or unverified recruiters.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div className="category-icon-wrapper" style={{ marginBottom: '1.25rem' }}>
                <Zap size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Fast-Track Applications</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Store your resume and apply to premier roles in seconds with a tailored cover note.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div className="category-icon-wrapper" style={{ marginBottom: '1.25rem' }}>
                <Bell size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Real-time Status Tracking</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Track the progress of your application at every milestone: from submission to review and shortlisting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Workflow"
            title="How It Works"
            description="Three simple steps to secure your next career milestone."
            align="center"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.125rem',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Search & Filter</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Browse hundreds of curated roles filtered by category, workplace type, and salary range.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.125rem',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Apply in Seconds</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Upload your resume, add a personalized message, and submit directly to the hiring team.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.125rem',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Get Hired</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Receive updates on candidate shortlisting and interview scheduling directly via your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ maxWidth: '580px' }}>
              <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem' }}>
                Ready to take the next step in your career?
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.0625rem' }}>
                Join thousands of professionals discovering premier opportunities every day on {platformName}.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create Free Account
              </Link>
              <Link
                to="/jobs"
                className="btn btn-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#fff', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
