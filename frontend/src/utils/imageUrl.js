/**
 * Utility functions for image and logo URL normalization.
 */

/**
 * Normalizes an image or logo URL to ensure direct binary image delivery.
 *
 * Handles:
 * 1. Google Drive sharing links:
 *    - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *    - https://drive.google.com/open?id=FILE_ID
 *    - https://drive.google.com/uc?id=FILE_ID
 *    - Converts to: https://lh3.googleusercontent.com/d/FILE_ID (Google's direct image CDN)
 * 2. Relative API upload paths:
 *    - e.g. /api/uploads/logos/logo_xxx.png
 *    - Prepends VITE_API_BASE_URL if configured, otherwise preserves relative path for Vite proxy
 * 3. Regular absolute / blob / data URLs:
 *    - Preserved as-is
 *
 * @param {string} url - raw input image URL
 * @returns {string|null} - normalized direct image URL
 */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Pattern A: Google Drive standard view / share link: .../file/d/FILE_ID/...
  const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
  }

  // Pattern B: Google Drive query param link: ...drive.google.com...id=FILE_ID
  const queryIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes('drive.google.com') && queryIdMatch && queryIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${queryIdMatch[1]}`;
  }

  // Pattern C: Already using Google UserContent CDN
  if (trimmed.includes('googleusercontent.com/d/')) {
    return trimmed;
  }

  // Relative API upload path
  if (trimmed.startsWith('/api/')) {
    const apiBase = (
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_API_URL ||
      ''
    ).replace(/\/$/, '');
    return apiBase ? `${apiBase}${trimmed}` : trimmed;
  }

  return trimmed;
}

/**
 * Checks if a given URL is a Google Drive link.
 * @param {string} url
 * @returns {boolean}
 */
export function isGoogleDriveUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com') || url.includes('googleusercontent.com/d/');
}

