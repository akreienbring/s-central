import { useEffect } from 'react';
import { useLocation } from 'react-router';

// ----------------------------------------------------------------------

/**
 * A hook that scrolls the browser window to the top
 * @returns null
 */
export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
