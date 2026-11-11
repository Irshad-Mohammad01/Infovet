import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Footer from './Footer';

/**
 * The shell every page renders inside. Used as a wrapper route in App.jsx, so
 * the header and footer mount once for the whole session rather than being
 * torn down and rebuilt on each navigation.
 */
const Layout = () => {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
