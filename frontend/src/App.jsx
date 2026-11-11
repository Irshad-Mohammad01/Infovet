import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { BrandingProvider } from './context/BrandingContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';

// Three Core Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

import './styles/index.css';

/**
 * INFOVET Software Solutions Website
 * Simplified Public Structure:
 * 1. Home ("/")
 * 2. About Us ("/about")
 * 3. Contact Us ("/contact")
 * All obsolete routes redirect to the Homepage.
 */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <BrandingProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Obsolete routes redirected to Home */}
              <Route path="/services" element={<Navigate to="/" replace />} />
              <Route path="/projects" element={<Navigate to="/" replace />} />
              <Route path="/projects/*" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
              <Route path="/profile/*" element={<Navigate to="/" replace />} />
              <Route path="/admin/*" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrandingProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
