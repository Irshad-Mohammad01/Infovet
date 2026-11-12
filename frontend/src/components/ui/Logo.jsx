import React, { useState, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import { useBranding } from '../../context/BrandingContext';
import { normalizeImageUrl } from '../../utils/imageUrl';

/**
 * Dynamic Platform Logo & Brand Identifier for INFOVATE.
 * Renders the database-configured logo URL from the public settings API.
 * Automatically normalizes Google Drive links and relative paths.
 * If no logo URL is configured or if the image fails to load, displays a clean tech icon badge.
 *
 * @param {number} [size=32] - rendered height in px
 * @param {boolean} [withWordmark=false] - render dynamic platform name text alongside the badge
 * @param {string} [variant='default'] - 'default' or 'light'
 * @param {string} [className=''] - optional CSS classes
 */
const Logo = ({ size = 32, withWordmark = false, variant = 'default', className = '' }) => {
  const { branding } = useBranding();
  const isLight = variant === 'light';

  const platformName = branding?.platform_name || 'INFOVATE';
  const rawLogoUrl = branding?.platform_logo_url;
  const logoUrl = normalizeImageUrl(rawLogoUrl);
  const primaryColor = branding?.primary_color || 'var(--primary, #6025C5)';
  const textColor = isLight ? '#FFFFFF' : 'var(--text, #1F1F1F)';

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [logoUrl]);

  const showImage = Boolean(logoUrl && !hasError);

  const mark = showImage ? (
    <img
      src={logoUrl}
      alt={platformName}
      style={{
        height: `${size}px`,
        maxWidth: `${size * 2.8}px`,
        objectFit: 'contain',
        display: 'block',
      }}
      onError={() => setHasError(true)}
    />
  ) : (
    <span
      className="generic-logo-placeholder"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.max(6, Math.round(size * 0.25))}px`,
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : primaryColor,
        color: isLight ? primaryColor : '#FFFFFF',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
      }}
      aria-hidden="true"
    >
      <Code2 size={Math.round(size * 0.52)} />
    </span>
  );

  return (
    <span
      className={`platform-logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.625rem',
        textDecoration: 'none',
        lineHeight: 1,
      }}
    >
      {mark}
      {withWordmark && (
        <span
          style={{
            fontSize: `${Math.max(1.1, size * 0.038)}rem`,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: textColor,
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {platformName}
        </span>
      )}
    </span>
  );
};

export default Logo;
