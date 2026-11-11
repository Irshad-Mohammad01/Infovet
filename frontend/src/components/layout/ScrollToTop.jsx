import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A client-side route change leaves the scroll position where it was, which
 * lands you halfway down the next page. This resets it on every navigation.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
