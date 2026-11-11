import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { BrandingProvider } from './context/BrandingContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ScrollToTop from './components/layout/ScrollToTop';

// Candidate & Public Pages
import Home from './pages/Home';
import BrowseJobs from './pages/BrowseJobs';
import JobDetails from './pages/JobDetails';
import ApplyJob from './pages/ApplyJob';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import MyApplications from './pages/MyApplications';
import ApplicationDetails from './pages/ApplicationDetails';
import SavedJobs from './pages/SavedJobs';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Administration Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageJobs from './pages/admin/ManageJobs';
import JobForm from './pages/admin/JobForm';
import ManageApplicants from './pages/admin/ManageApplicants';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/ManageCategories';
import AdminSettings from './pages/admin/AdminSettings';

import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <BrandingProvider>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
          {/* Public & Candidate Experience */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<BrowseJobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Candidate Protected Routes */}
            <Route
              path="/jobs/:id/apply"
              element={
                <ProtectedRoute>
                  <ApplyJob />
                </ProtectedRoute>
              }
            />
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
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications/:id"
              element={
                <ProtectedRoute>
                  <ApplicationDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved-jobs"
              element={
                <ProtectedRoute>
                  <SavedJobs />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Dedicated Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Management Console */}
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
            <Route path="jobs" element={<ManageJobs />} />
            <Route path="jobs/new" element={<JobForm />} />
            <Route path="jobs/:id/edit" element={<JobForm />} />
            <Route path="applicants" element={<ManageApplicants />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrandingProvider>
  </BrowserRouter>
  );
}

export default App;
