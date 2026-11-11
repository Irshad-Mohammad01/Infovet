import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <section className="section notfound" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container notfound-inner" style={{ textAlign: 'center', margin: '0 auto' }}>
        <span className="notfound-code gradient-text" style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 1 }}>
          404
        </span>
        <h1 className="page-title" style={{ marginTop: '1rem', marginBottom: '0.75rem' }}>
          Page Not Found
        </h1>
        <p className="page-subtitle" style={{ maxWidth: '540px', margin: '0 auto 2rem auto' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={18} aria-hidden="true" />
            Back to Home
          </Link>
          <Link to="/jobs" className="btn btn-outline">
            <Search size={18} aria-hidden="true" />
            Browse Jobs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
