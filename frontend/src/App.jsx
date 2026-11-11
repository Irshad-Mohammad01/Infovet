import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { BrandingProvider } from './context/BrandingContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ScrollToTop from './components/layout/ScrollToTop';

// Software Solutions Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import NotFound from './pages/NotFound';

// Company CMS Administration Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCompanyProfile from './pages/admin/AdminCompanyProfile';
import ManageServices from './pages/admin/ManageServices';
import ManageProjects from './pages/admin/ManageProjects';
import ProjectForm from './pages/admin/ProjectForm';
import ManageTechnologies from './pages/admin/ManageTechnologies';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageTeam from './pages/admin/ManageTeam';
import ManageInquiries from './pages/admin/ManageInquiries';
import AdminSettings from './pages/admin/AdminSettings';

import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <BrandingProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public Software Company Website */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Client / User Profile Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/edit"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Dedicated Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Executive Company CMS Console */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="company-profile" element={<AdminCompanyProfile />} />
              <Route path="services" element={<ManageServices />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id/edit" element={<ProjectForm />} />
              <Route path="technologies" element={<ManageTechnologies />} />
              <Route path="testimonials" element={<ManageTestimonials />} />
              <Route path="team" element={<ManageTeam />} />
              <Route path="inquiries" element={<ManageInquiries />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrandingProvider>
    </BrowserRouter>
  );
}

export default App;
