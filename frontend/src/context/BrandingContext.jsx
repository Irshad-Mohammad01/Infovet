import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchPublicSettings } from '../services/api';

const DEFAULT_BRANDING = {
  platform_name: 'Infovate',
  platform_logo_url: null,
  favicon_url: null,
  tagline: 'Software Development & IT Solutions',
  primary_color: '#6025C5',
  secondary_color: '#F8F7FC',
  background_color: '#F8F7FC',
  support_email: 'contact@infovate.in',
  contact_phone: null,
};

const BrandingContext = createContext({
  branding: DEFAULT_BRANDING,
  loading: true,
  refreshBranding: async () => {},
});

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);

  const applyBrandingToDocument = (data) => {
    if (!data) return;

    // 1. Dynamic Document Title
    if (data.platform_name) {
      document.title = `${data.platform_name}${data.tagline ? ` — ${data.tagline}` : ''}`;
    }

    // 2. Dynamic Browser Favicon
    if (data.favicon_url) {
      let favicon = document.querySelector("link[rel~='icon']");
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(favicon);
      }
      favicon.href = data.favicon_url;
    }

    // 2. Dynamic Primary Brand Color
    if (data.primary_color) {
      document.documentElement.style.setProperty('--primary', data.primary_color);
    }
  };

  const loadBranding = useCallback(async () => {
    try {
      const data = await fetchPublicSettings();
      if (data) {
        setBranding(data);
        applyBrandingToDocument(data);
      }
    } catch (err) {
      console.warn('Could not load dynamic platform settings, falling back to defaults:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranding();
  }, [loadBranding]);

  return (
    <BrandingContext.Provider
      value={{
        branding,
        loading,
        refreshBranding: loadBranding,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);

export default BrandingContext;
