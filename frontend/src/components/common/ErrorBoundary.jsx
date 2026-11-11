import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#F8F7FC',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              backgroundColor: '#FFFFFF',
              padding: '2.5rem',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #E5E7EB',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1F1F1F', marginBottom: '0.75rem' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              An unexpected error occurred while loading this page.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              style={{
                backgroundColor: '#6025C5',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Return to Homepage
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

