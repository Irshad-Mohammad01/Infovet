import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  clearToken,
  fetchProfile,
  getToken,
  loginUser,
  adminLogin as apiAdminLogin,
  registerUser,
  setToken,
  updateProfile as apiUpdateProfile,
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load existing session on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const existingToken = getToken();
      if (!existingToken) {
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchProfile();
        setUser(profile);
      } catch (err) {
        console.error('Session initialization error:', err);
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const adminLogin = async (email, password) => {
    const data = await apiAdminLogin(email, password);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const updated = await fetchProfile();
      setUser(updated);
      return updated;
    } catch {
      return null;
    }
  };

  const updateUserProfile = async (formData) => {
    const updated = await apiUpdateProfile(formData);
    setUser(updated);
    return updated;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    adminLogin,
    logout,
    refreshProfile,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

